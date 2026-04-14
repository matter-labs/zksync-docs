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

if [[ $# -lt 1 || $# -gt 2 ]]; then
  echo "usage: $0 <send_tx_hash> [rpc_url]" >&2
  echo "example: $0 0xabc... http://localhost:3050" >&2
  exit 1
fi

SEND_TX_HASH="$1"
RPC="${2:-http://localhost:3050}"

CHAIN_ID=6565
INTEROP_CENTER="0x000000000000000000000000000000000001000d"
L1_MESSENGER="0x0000000000000000000000000000000000008008"
TOPIC_BUNDLE_SENT="0xa806bc0307d327c1421b432282433def78085db185d404fcd809931f28b1c4ab"

curl -s -X POST "$RPC" -H 'content-type: application/json' \
  --data "{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"eth_getTransactionReceipt\",\"params\":[\"$SEND_TX_HASH\"]}" \
  > /tmp/send_receipt.json

BUNDLE_LOG_INDEX=$(jq -r --arg a "$INTEROP_CENTER" --arg t "$TOPIC_BUNDLE_SENT" \
  '.result.logs|to_entries[]|select((.value.address|ascii_downcase)==($a|ascii_downcase) and (.value.topics[0]|ascii_downcase)==($t|ascii_downcase))|.key' \
  /tmp/send_receipt.json | head -n1)

if [[ -z "${BUNDLE_LOG_INDEX}" || "${BUNDLE_LOG_INDEX}" == "null" ]]; then
  echo "error: bundle log not found in receipt" >&2
  exit 1
fi

MESSENGER_LOG_INDEXES=()
while IFS= read -r idx; do
  MESSENGER_LOG_INDEXES+=("$idx")
done < <(
  jq -r \
    --arg a "$L1_MESSENGER" \
    '.result.logs|to_entries[]|select((.value.address|ascii_downcase)==($a|ascii_downcase))|.key' \
    /tmp/send_receipt.json
)

if [[ "${#MESSENGER_LOG_INDEXES[@]}" -eq 0 ]]; then
  echo "error: no L1MessageSent log found in receipt" >&2
  exit 1
fi

# Prefer the last messenger log before bundle. If none exist, fall back to the first messenger log.
CHOSEN_LOG_INDEX=""
for idx in "${MESSENGER_LOG_INDEXES[@]}"; do
  if [[ "$idx" -lt "$BUNDLE_LOG_INDEX" ]]; then
    CHOSEN_LOG_INDEX="$idx"
  fi
done
if [[ -z "$CHOSEN_LOG_INDEX" ]]; then
  CHOSEN_LOG_INDEX="${MESSENGER_LOG_INDEXES[0]}"
fi

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

L1_MESSAGE_DATA_ENCODED=$(jq -r --argjson i "$CHOSEN_LOG_INDEX" '.result.logs[$i].data' /tmp/send_receipt.json)

L1_MESSAGE_DATA=$(cast decode-abi "x()(bytes)" "$L1_MESSAGE_DATA_ENCODED" | tr -d '()')

curl -s -X POST "$RPC" -H 'content-type: application/json' \
  --data "{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"zks_getL2ToL1LogProof\",\"params\":[\"$SEND_TX_HASH\",$L2_TO_L1_LOG_INDEX]}" \
  > /tmp/proof.json

BATCH=$(jq -r '.result.batchNumber' /tmp/proof.json)
MSG_ID=$(jq -r '.result.id' /tmp/proof.json)
TX_INDEX_HEX=$(jq -r '.result.transactionIndex' /tmp/send_receipt.json)
TX_INDEX=$(cast --to-dec "$TX_INDEX_HEX")
PROOF_ARRAY=$(jq -r '"[" + (.result.proof | join(",")) + "]"' /tmp/proof.json)

PROOF_ENCODED_HEX=$(cast abi-encode \
  "x((uint256,uint256,uint256,(uint16,address,bytes),bytes32[]))" \
  "($CHAIN_ID,$BATCH,$MSG_ID,($TX_INDEX,$INTEROP_CENTER,$L1_MESSAGE_DATA),$PROOF_ARRAY)")

echo "$PROOF_ENCODED_HEX"
