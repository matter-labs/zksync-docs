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
  echo "usage: $0 [initiate_tx_hash] [source_rpc_url]" >&2
  echo "example: $0 0xabc... http://localhost:3050" >&2
  echo "example: $0" >&2
  exit 1
fi

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd -- "$SCRIPT_DIR/.." && pwd)"
DEFAULT_BROADCAST_RUN_JSON="$PROJECT_ROOT/broadcast/InteropAssetMigrationInitiate.s.sol/6565/run-latest.json"

INITIATE_TX_HASH=""
SOURCE_RPC="${SOURCE_RPC:-http://localhost:3050}"
MAX_ATTEMPTS="${MAX_ATTEMPTS:-30}"
SLEEP_SECONDS="${SLEEP_SECONDS:-2}"
DEBUG="${DEBUG:-0}"
FOUNDRY_RUN_JSON="${FOUNDRY_RUN_JSON:-$DEFAULT_BROADCAST_RUN_JSON}"

L1_MESSENGER="0x0000000000000000000000000000000000008008"
L2_ASSET_TRACKER="0x000000000000000000000000000000000001000f"

RECEIPT_JSON=$(mktemp)
PROOF_JSON=$(mktemp)

cleanup() {
  rm -f "$RECEIPT_JSON" "$PROOF_JSON"
}

trap cleanup EXIT

debug_log() {
  if [[ "$DEBUG" == "1" ]]; then
    echo "debug: $*" >&2
  fi
}

resolve_latest_initiate_tx_hash() {
  local tracker_lower
  tracker_lower="$(printf '%s' "$L2_ASSET_TRACKER" | tr '[:upper:]' '[:lower:]')"

  if [[ ! -f "$FOUNDRY_RUN_JSON" ]]; then
    echo "error: could not find Foundry broadcast artifact at $FOUNDRY_RUN_JSON" >&2
    echo "hint: pass the initiate tx hash explicitly or set FOUNDRY_RUN_JSON" >&2
    exit 1
  fi

  local latest_hash
  latest_hash="$(
    jq -r \
      --arg tracker "$tracker_lower" \
      '
        [
          .transactions[]
          | select(
              (.transactionType // "") == "CALL"
              and (.transaction.to // "" | ascii_downcase) == $tracker
              and (.function // "") == "initiateL1ToGatewayMigrationOnL2(bytes32)"
            )
          | .hash
        ]
        | last // empty
      ' \
      "$FOUNDRY_RUN_JSON"
  )"

  if [[ -z "$latest_hash" ]]; then
    echo "error: could not find an initiateL1ToGatewayMigrationOnL2 transaction hash in $FOUNDRY_RUN_JSON" >&2
    exit 1
  fi

  echo "$latest_hash"
}

if [[ $# -ge 1 ]]; then
  INITIATE_TX_HASH="$1"
fi

if [[ $# -eq 2 ]]; then
  SOURCE_RPC="$2"
fi

if [[ -z "$INITIATE_TX_HASH" ]]; then
  INITIATE_TX_HASH="$(resolve_latest_initiate_tx_hash)"
  debug_log "resolved_latest_initiate_tx_hash=$INITIATE_TX_HASH"
fi

for ((attempt = 1; attempt <= MAX_ATTEMPTS; attempt++)); do
  curl -s -X POST "$SOURCE_RPC" -H 'content-type: application/json' \
    --data "{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"eth_getTransactionReceipt\",\"params\":[\"$INITIATE_TX_HASH\"]}" \
    > "$RECEIPT_JSON"

  if jq -e '.result != null and .result.transactionHash != null' "$RECEIPT_JSON" >/dev/null; then
    break
  fi

  if [[ "$attempt" -eq "$MAX_ATTEMPTS" ]]; then
    echo "error: transaction receipt not available after $MAX_ATTEMPTS attempts" >&2
    exit 1
  fi

  sleep "$SLEEP_SECONDS"
done

CHAIN_ID_HEX="$(curl -s -X POST "$SOURCE_RPC" -H 'content-type: application/json' --data '{"jsonrpc":"2.0","id":1,"method":"eth_chainId","params":[]}' | jq -r '.result')"
CHAIN_ID="$(cast --to-dec "$CHAIN_ID_HEX")"
L2_SENDER="$(jq -r '.result.to' "$RECEIPT_JSON")"
TX_INDEX_HEX="$(jq -r '.result.transactionIndex' "$RECEIPT_JSON")"
TX_INDEX="$(cast --to-dec "$TX_INDEX_HEX")"

MESSENGER_LOG_INDEXES=()
while IFS= read -r idx; do
  MESSENGER_LOG_INDEXES+=("$idx")
done < <(
  jq -r \
    --arg a "$L1_MESSENGER" \
    '.result.logs|to_entries[]|select((.value.address|ascii_downcase)==($a|ascii_downcase))|.key' \
    "$RECEIPT_JSON"
)

if [[ "${#MESSENGER_LOG_INDEXES[@]}" -eq 0 ]]; then
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

L1_MESSAGE_DATA_ENCODED="$(jq -r --argjson i "$CHOSEN_LOG_INDEX" '.result.logs[$i].data' "$RECEIPT_JSON")"
L1_MESSAGE_DATA="$(cast decode-abi "x()(bytes)" "$L1_MESSAGE_DATA_ENCODED" | tr -d '()')"

for ((attempt = 1; attempt <= MAX_ATTEMPTS; attempt++)); do
  curl -s -X POST "$SOURCE_RPC" -H 'content-type: application/json' \
    --data "{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"zks_getL2ToL1LogProof\",\"params\":[\"$INITIATE_TX_HASH\",$L2_TO_L1_LOG_INDEX]}" \
    > "$PROOF_JSON"

  if jq -e '.result != null and .result.batchNumber != null and .result.id != null and (.result.proof | type == "array")' "$PROOF_JSON" >/dev/null; then
    break
  fi

  if [[ "$attempt" -eq "$MAX_ATTEMPTS" ]]; then
    echo "error: L2-to-L1 proof not available after $MAX_ATTEMPTS attempts" >&2
    exit 1
  fi

  sleep "$SLEEP_SECONDS"
done

BATCH="$(jq -r '.result.batchNumber' "$PROOF_JSON")"
MSG_ID="$(jq -r '.result.id' "$PROOF_JSON")"
PROOF_ARRAY="$(jq -r '.result | "[" + (.proof | join(",")) + "]"' "$PROOF_JSON")"

debug_log "chain_id=$CHAIN_ID batch=$BATCH msg_id=$MSG_ID l2_sender=$L2_SENDER tx_index=$TX_INDEX"
debug_log "message=$L1_MESSAGE_DATA"
debug_log "proof_array=$PROOF_ARRAY"

FINALIZE_PARAMS_ENCODED="$(
  cast abi-encode \
    "x((uint256,uint256,uint256,address,uint16,bytes,bytes32[]))" \
    "($CHAIN_ID,$BATCH,$MSG_ID,$L2_SENDER,$TX_INDEX,$L1_MESSAGE_DATA,$PROOF_ARRAY)"
)"

echo "$FINALIZE_PARAMS_ENCODED"
