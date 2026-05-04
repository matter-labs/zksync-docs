#!/usr/bin/env bash
set -euo pipefail

if ! command -v jq >/dev/null 2>&1; then
  echo "error: jq is required" >&2
  exit 1
fi

if ! command -v cast >/dev/null 2>&1; then
  echo "error: cast is required" >&2
  exit 1
fi

if [[ $# -gt 2 ]]; then
  echo "usage: $0 [send_tx_hash] [source_rpc_url]" >&2
  echo "example: $0 0xabc... http://localhost:3050" >&2
  echo "example: $0" >&2
  exit 1
fi

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd -- "$SCRIPT_DIR/.." && pwd)"
DEFAULT_BROADCAST_RUN_JSON="$PROJECT_ROOT/broadcast/multi/InteropCounterDeployAndSendBundle.s.sol-latest/run.json"

SEND_TX_HASH=""
SOURCE_RPC="http://localhost:3050"
MAX_ATTEMPTS="${MAX_ATTEMPTS:-30}"
SLEEP_SECONDS="${SLEEP_SECONDS:-2}"
DEBUG="${DEBUG:-0}"
FOUNDRY_RUN_JSON="${FOUNDRY_RUN_JSON:-$DEFAULT_BROADCAST_RUN_JSON}"

CHAIN_ID=6565
INTEROP_CENTER="0x000000000000000000000000000000000001000d"
L1_MESSENGER="0x0000000000000000000000000000000000008008"
INTEROP_ROOT_STORAGE="0x0000000000000000000000000000000000010008"
DEST_RPC="${DEST_RPC:-http://localhost:3051}"
GW_RPC="${GW_RPC:-http://localhost:3052}"
DEST_PRIVATE_KEY="${DEST_PRIVATE_KEY:-${LOCAL_PRIVATE_KEY:-}}"
GW_PRIVATE_KEY="${GW_PRIVATE_KEY:-${LOCAL_PRIVATE_KEY:-}}"

SEND_RECEIPT_JSON=$(mktemp)
PROOF_JSON=$(mktemp)
TX_DETAILS_JSON=$(mktemp)
FINALIZED_BLOCK_JSON=$(mktemp)
GATEWAY_CHAIN_JSON=$(mktemp)
ROOT_CALL_JSON=$(mktemp)

cleanup() {
  rm -f "$SEND_RECEIPT_JSON" "$PROOF_JSON" "$TX_DETAILS_JSON" "$FINALIZED_BLOCK_JSON" "$GATEWAY_CHAIN_JSON" "$ROOT_CALL_JSON"
}

trap cleanup EXIT

receipt_filter='if .result != null then .result else . end'
messenger_log_filter='if .result != null then .result else . end | .logs|to_entries[]|select((.value.address|ascii_downcase)==($a|ascii_downcase))|.key'
message_data_filter='if .result != null then .result else . end | .logs[$i].data'
proof_filter='if .result != null then .result else . end'
root_filter='if .result != null then .result else . end'

debug_log() {
  if [[ "$DEBUG" == "1" ]]; then
    echo "debug: $*" >&2
  fi
}

poke_chain() {
  local rpc_url="$1"
  local private_key="$2"
  local label="$3"

  if [[ -z "$private_key" ]]; then
    debug_log "poke_${label}_chain_skipped no_private_key"
    return 0
  fi

  local sender
  sender="$(cast wallet address --private-key "$private_key" 2>/dev/null || true)"
  if [[ -z "$sender" ]]; then
    debug_log "failed_to_derive_${label}_sender"
    return 0
  fi

  debug_log "poke_${label}_chain sender=$sender"
  local send_output
  local tx_hash
  local sender_balance
  sender_balance="$(cast balance "$sender" --rpc-url "$rpc_url" 2>/dev/null || true)"
  debug_log "poke_${label}_chain sender_balance_wei=${sender_balance:-unknown}"
  send_output="$(
    cast send \
      --json \
      --private-key "$private_key" \
      --rpc-url "$rpc_url" \
      "$sender" \
      --value 1wei \
      2>&1 || true
  )"

  tx_hash="$(printf '%s' "$send_output" | jq -r '.transactionHash // .hash // empty' 2>/dev/null || true)"
  if [[ -z "$tx_hash" ]]; then
    echo "error: failed to send ${label}-chain poke transaction on $rpc_url" >&2
    echo "hint: sender $sender balance on ${label} chain is ${sender_balance:-unknown} wei" >&2
    echo "$send_output" >&2
    exit 1
  fi

  debug_log "poke_${label}_chain tx_hash=$tx_hash"

  for _ in $(seq 1 20); do
    if cast receipt "$tx_hash" --rpc-url "$rpc_url" >/dev/null 2>&1; then
      return 0
    fi
    sleep 1
  done

  debug_log "poke_${label}_chain_receipt_timeout tx_hash=$tx_hash"
}

poke_gateway_chain() {
  poke_chain "$GW_RPC" "${GW_PRIVATE_KEY:-}" "gateway"
}

poke_destination_chain() {
  poke_chain "$DEST_RPC" "${DEST_PRIVATE_KEY:-}" "destination"
}

resolve_latest_send_tx_hash() {
  local interop_center_lower
  interop_center_lower="$(printf '%s' "$INTEROP_CENTER" | tr '[:upper:]' '[:lower:]')"

  if [[ ! -f "$FOUNDRY_RUN_JSON" ]]; then
    echo "error: could not find Foundry broadcast artifact at $FOUNDRY_RUN_JSON" >&2
    echo "hint: pass the send tx hash explicitly or set FOUNDRY_RUN_JSON" >&2
    exit 1
  fi

  local latest_hash
  latest_hash="$(
    jq -r \
      --arg interop_center "$interop_center_lower" \
      '
        [
          .deployments[]
          | .transactions[]
          | select(
              .transactionType == "CALL"
              and (.transaction.to // "" | ascii_downcase) == $interop_center
              and (.function // "") == "sendBundle(bytes,(bytes,bytes,bytes[])[],bytes[])"
            )
          | .hash
        ]
        | last // empty
      ' \
      "$FOUNDRY_RUN_JSON"
  )"

  if [[ -z "$latest_hash" ]]; then
    echo "error: could not find a sendBundle transaction hash in $FOUNDRY_RUN_JSON" >&2
    echo "hint: rerun the deploy script or pass the send tx hash explicitly" >&2
    exit 1
  fi

  echo "$latest_hash"
}

if [[ $# -eq 1 ]]; then
  if [[ "$1" == 0x* ]]; then
    SEND_TX_HASH="$1"
  else
    SOURCE_RPC="$1"
  fi
elif [[ $# -eq 2 ]]; then
  SEND_TX_HASH="$1"
  SOURCE_RPC="$2"
fi

if [[ -z "$SEND_TX_HASH" ]]; then
  SEND_TX_HASH="$(resolve_latest_send_tx_hash)"
  debug_log "resolved_latest_send_tx_hash=$SEND_TX_HASH from $FOUNDRY_RUN_JSON"
fi

for ((attempt = 1; attempt <= MAX_ATTEMPTS; attempt++)); do
  curl -s -X POST "$SOURCE_RPC" -H 'content-type: application/json' \
    --data "{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"eth_getTransactionReceipt\",\"params\":[\"$SEND_TX_HASH\"]}" \
    > "$SEND_RECEIPT_JSON"

  if jq -e "$receipt_filter | .transactionHash != null" "$SEND_RECEIPT_JSON" >/dev/null; then
    break
  fi

  if [[ "$attempt" -eq "$MAX_ATTEMPTS" ]]; then
    echo "error: transaction receipt not available after $MAX_ATTEMPTS attempts" >&2
    exit 1
  fi

  sleep "$SLEEP_SECONDS"
done

debug_log "receipt json:"
if [[ "$DEBUG" == "1" ]]; then
  cat "$SEND_RECEIPT_JSON" >&2
fi
debug_log "receipt transactionHash=$(jq -r "$receipt_filter | .transactionHash // \"null\"" "$SEND_RECEIPT_JSON")"
debug_log "receipt logs length=$(jq -r "$receipt_filter | (.logs | length) // 0" "$SEND_RECEIPT_JSON")"
if [[ "$DEBUG" == "1" ]]; then
  jq -r "$receipt_filter | .logs | to_entries[] | \"log[\(.key)] address=\(.value.address) topic0=\(.value.topics[0] // \"\")\"" "$SEND_RECEIPT_JSON" >&2 || true
fi

curl -s -X POST "$SOURCE_RPC" -H 'content-type: application/json' \
  --data "{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"zks_getTransactionDetails\",\"params\":[\"$SEND_TX_HASH\"]}" \
  > "$TX_DETAILS_JSON" || true

if [[ "$DEBUG" == "1" ]]; then
  echo "debug: tx details json:" >&2
  cat "$TX_DETAILS_JSON" >&2
fi

MESSENGER_LOG_INDEXES=()
while IFS= read -r idx; do
  MESSENGER_LOG_INDEXES+=("$idx")
done < <(
  jq -r \
    --arg a "$L1_MESSENGER" \
    "$messenger_log_filter" \
    "$SEND_RECEIPT_JSON"
)

if [[ "${#MESSENGER_LOG_INDEXES[@]}" -eq 0 ]]; then
  debug_log "expected messenger sender=$L1_MESSENGER"
  echo "error: no L1MessageSent log found in receipt" >&2
  exit 1
fi

LAST_MESSENGER_INDEX=$((${#MESSENGER_LOG_INDEXES[@]} - 1))
CHOSEN_LOG_INDEX="${MESSENGER_LOG_INDEXES[$LAST_MESSENGER_INDEX]}"

L2_TO_L1_LOG_INDEX=-1
for i in "${!MESSENGER_LOG_INDEXES[@]}"; do
  if [[ "${MESSENGER_LOG_INDEXES[$i]}" -eq "$CHOSEN_LOG_INDEX" ]]; then
    L2_TO_L1_LOG_INDEX="$i"
    break
  fi
done

if [[ "$L2_TO_L1_LOG_INDEX" -lt 0 ]]; then
  echo "error: failed to compute L2-to-L1 log index" >&2
  exit 1
fi

L1_MESSAGE_DATA_ENCODED=$(jq -r --argjson i "$CHOSEN_LOG_INDEX" "$message_data_filter" "$SEND_RECEIPT_JSON")
debug_log "chosen_messenger_log_index=$CHOSEN_LOG_INDEX l2_to_l1_log_index=$L2_TO_L1_LOG_INDEX"
debug_log "l1_message_data_encoded=$L1_MESSAGE_DATA_ENCODED"

L1_MESSAGE_DATA=$(cast decode-abi "x()(bytes)" "$L1_MESSAGE_DATA_ENCODED" | tr -d '()')
debug_log "decoded_l1_message_data=$L1_MESSAGE_DATA"

SOURCE_BLOCK_HEX=$(jq -r "$receipt_filter | .blockNumber" "$SEND_RECEIPT_JSON")
SOURCE_BLOCK_DEC=$(cast --to-dec "$SOURCE_BLOCK_HEX")
debug_log "source_block_hex=$SOURCE_BLOCK_HEX source_block_dec=$SOURCE_BLOCK_DEC"

for ((attempt = 1; attempt <= MAX_ATTEMPTS; attempt++)); do
  curl -s -X POST "$SOURCE_RPC" -H 'content-type: application/json' \
    --data '{"jsonrpc":"2.0","id":1,"method":"eth_getBlockByNumber","params":["finalized",false]}' \
    > "$FINALIZED_BLOCK_JSON"

  FINALIZED_BLOCK_HEX=$(jq -r "$receipt_filter | .number // \"null\"" "$FINALIZED_BLOCK_JSON")
  if [[ "$FINALIZED_BLOCK_HEX" == "null" ]]; then
    FINALIZED_BLOCK_DEC=-1
  else
    FINALIZED_BLOCK_DEC=$(cast --to-dec "$FINALIZED_BLOCK_HEX")
  fi
  debug_log "finalized_block_hex=$FINALIZED_BLOCK_HEX finalized_block_dec=$FINALIZED_BLOCK_DEC"

  if [[ "$FINALIZED_BLOCK_DEC" -lt "$SOURCE_BLOCK_DEC" ]]; then
    if [[ "$attempt" -eq "$MAX_ATTEMPTS" ]]; then
      echo "error: source block not finalized after $MAX_ATTEMPTS attempts" >&2
      exit 1
    fi
    sleep "$SLEEP_SECONDS"
    continue
  fi

  curl -s -X POST "$SOURCE_RPC" -H 'content-type: application/json' \
    --data "{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"zks_getL2ToL1LogProof\",\"params\":[\"$SEND_TX_HASH\",$L2_TO_L1_LOG_INDEX,\"messageRoot\"]}" \
    > "$PROOF_JSON"

  if jq -e "$proof_filter | .batchNumber != null and .id != null and (.proof | type == \"array\") and .gatewayBlockNumber != null" "$PROOF_JSON" >/dev/null; then
    break
  fi

  if [[ "$attempt" -eq "$MAX_ATTEMPTS" ]]; then
    echo "error: L2-to-L1 proof not available after $MAX_ATTEMPTS attempts" >&2
    exit 1
  fi

  sleep "$SLEEP_SECONDS"
done

debug_log "proof json:"
if [[ "$DEBUG" == "1" ]]; then
  cat "$PROOF_JSON" >&2
fi

BATCH=$(jq -r "$proof_filter | .batchNumber" "$PROOF_JSON")
MSG_ID=$(jq -r "$proof_filter | .id" "$PROOF_JSON")
GW_BLOCK_NUMBER=$(jq -r "$proof_filter | .gatewayBlockNumber" "$PROOF_JSON")
TX_INDEX_HEX=$(jq -r "$receipt_filter | .transactionIndex" "$SEND_RECEIPT_JSON")
TX_INDEX=$(cast --to-dec "$TX_INDEX_HEX")
PROOF_ARRAY=$(jq -r "$proof_filter | \"[\" + (.proof | join(\",\")) + \"]\"" "$PROOF_JSON")
debug_log "batch=$BATCH msg_id=$MSG_ID gateway_block_number=$GW_BLOCK_NUMBER tx_index_hex=$TX_INDEX_HEX tx_index=$TX_INDEX"
debug_log "proof_array=$PROOF_ARRAY"

curl -s -X POST "$GW_RPC" -H 'content-type: application/json' \
  --data '{"jsonrpc":"2.0","id":1,"method":"eth_chainId","params":[]}' \
  > "$GATEWAY_CHAIN_JSON"

GW_CHAIN_HEX=$(jq -r "$root_filter | . // \"null\"" "$GATEWAY_CHAIN_JSON")
if [[ "$GW_CHAIN_HEX" == "null" ]]; then
  echo "error: failed to read gateway chain id from $GW_RPC" >&2
  exit 1
fi
GW_CHAIN_ID=$(cast --to-dec "$GW_CHAIN_HEX")
debug_log "gateway_chain_hex=$GW_CHAIN_HEX gateway_chain_id=$GW_CHAIN_ID"

ROOT_CALL_DATA=$(cast calldata "interopRoots(uint256,uint256)" "$GW_CHAIN_ID" "$GW_BLOCK_NUMBER")
debug_log "root_call_data=$ROOT_CALL_DATA"

for ((attempt = 1; attempt <= MAX_ATTEMPTS; attempt++)); do
  curl -s -X POST "$DEST_RPC" -H 'content-type: application/json' \
    --data "{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"eth_call\",\"params\":[{\"to\":\"$INTEROP_ROOT_STORAGE\",\"data\":\"$ROOT_CALL_DATA\"},\"latest\"]}" \
    > "$ROOT_CALL_JSON"

  ROOT_VALUE=$(jq -r "$root_filter | . // \"null\"" "$ROOT_CALL_JSON")
  debug_log "interop_root_attempt=$attempt root=$ROOT_VALUE"

  if [[ "$ROOT_VALUE" != "null" && "$ROOT_VALUE" != "0x0000000000000000000000000000000000000000000000000000000000000000" ]]; then
    break
  fi

  if [[ "$attempt" -eq "$MAX_ATTEMPTS" ]]; then
    echo "error: destination interop root not available after $MAX_ATTEMPTS attempts" >&2
    echo "hint: expected interopRoots($GW_CHAIN_ID, $GW_BLOCK_NUMBER) on $DEST_RPC" >&2
    exit 1
  fi

  poke_gateway_chain
  poke_destination_chain
  sleep "$SLEEP_SECONDS"
done

PROOF_ENCODED_HEX=$(cast abi-encode \
  "x((uint256,uint256,uint256,(uint16,address,bytes),bytes32[]))" \
  "($CHAIN_ID,$BATCH,$MSG_ID,($TX_INDEX,$INTEROP_CENTER,$L1_MESSAGE_DATA),$PROOF_ARRAY)")
debug_log "proof_encoded_hex=$PROOF_ENCODED_HEX"

echo "$PROOF_ENCODED_HEX"
