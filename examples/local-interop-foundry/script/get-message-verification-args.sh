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

if [[ $# -lt 1 || $# -gt 3 ]]; then
  echo "usage: $0 <message_tx_hash> [rpc_url] [source_chain_id]" >&2
  echo "example: $0 0xabc... http://localhost:3050 6565" >&2
  exit 1
fi

MESSAGE_TX_HASH="$1"
RPC="${2:-http://localhost:3050}"
SOURCE_CHAIN_ID="${3:-6565}"

L1_MESSENGER="0x0000000000000000000000000000000000008008"
TOPIC_L1_MESSAGE_SENT_NEW="0xd0c9bf6f81b25545624e7ad46931632d5ad2f3313355ab364d096f4967797c90"
TOPIC_L1_MESSAGE_SENT_LEG="0x3a36e47291f4201faf137fab081d92295bce2d53be2c6ca68ba82c7faa9ce241"

RECEIPT_JSON="$(mktemp)"
PROOF_JSON="$(mktemp)"
trap 'rm -f "$RECEIPT_JSON" "$PROOF_JSON"' EXIT

curl -s -X POST "$RPC" -H 'content-type: application/json' \
  --data "{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"eth_getTransactionReceipt\",\"params\":[\"$MESSAGE_TX_HASH\"]}" \
  > "$RECEIPT_JSON"

echo "Fetched receipt for tx $MESSAGE_TX_HASH from $RPC" >&2

MESSAGE_SENDER=$(jq -r '.result.to' "$RECEIPT_JSON")
TX_INDEX_HEX=$(jq -r '.result.transactionIndex' "$RECEIPT_JSON")
TX_NUMBER_IN_BATCH=$(cast --to-dec "$TX_INDEX_HEX")

MESSENGER_LOG_INDEXES=()
while IFS= read -r idx; do
  MESSENGER_LOG_INDEXES+=("$idx")
done < <(
  jq -r \
    --arg a "$L1_MESSENGER" \
    --arg t1 "$TOPIC_L1_MESSAGE_SENT_NEW" \
    --arg t2 "$TOPIC_L1_MESSAGE_SENT_LEG" \
    '.result.logs|to_entries[]|select((.value.address|ascii_downcase)==($a|ascii_downcase) and ((.value.topics[0]|ascii_downcase)==($t1|ascii_downcase) or (.value.topics[0]|ascii_downcase)==($t2|ascii_downcase)))|.key' \
    "$RECEIPT_JSON"
)

if [[ "${#MESSENGER_LOG_INDEXES[@]}" -eq 0 ]]; then
  echo "error: no L1MessageSent log found in receipt" >&2
  exit 1
fi

CHOSEN_LOG_INDEX="${MESSENGER_LOG_INDEXES[0]}"
L2_TO_L1_LOG_INDEX=0

L1_MESSAGE_DATA_ENCODED=$(jq -r --argjson i "$CHOSEN_LOG_INDEX" '.result.logs[$i].data' "$RECEIPT_JSON")
MESSAGE_DATA=$(cast decode-abi "x()(bytes)" "$L1_MESSAGE_DATA_ENCODED" | tr -d '()')

curl -s -X POST "$RPC" -H 'content-type: application/json' \
  --data "{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"zks_getL2ToL1LogProof\",\"params\":[\"$MESSAGE_TX_HASH\",$L2_TO_L1_LOG_INDEX,\"messageRoot\"]}" \
  > "$PROOF_JSON"

L1_BATCH_NUMBER=$(jq -r '.result.batchNumber' "$PROOF_JSON")
L2_MESSAGE_INDEX=$(jq -r '.result.id' "$PROOF_JSON")
GATEWAY_BLOCK_NUMBER=$(jq -r '.result.gatewayBlockNumber' "$PROOF_JSON")
MESSAGE_PROOF_ARRAY=$(jq -r '"[" + (.result.proof | join(",")) + "]"' "$PROOF_JSON")

PROOF_ENCODED_HEX=$(cast abi-encode \
  "x((uint256,uint256,uint256,(uint16,address,bytes),bytes32[]))" \
  "(\
$SOURCE_CHAIN_ID,\
$L1_BATCH_NUMBER,\
$L2_MESSAGE_INDEX,\
($TX_NUMBER_IN_BATCH,$MESSAGE_SENDER,$MESSAGE_DATA),\
$MESSAGE_PROOF_ARRAY\
)")

echo "Verification args ready: batch=$L1_BATCH_NUMBER, msgIndex=$L2_MESSAGE_INDEX, gatewayBlock=$GATEWAY_BLOCK_NUMBER" >&2

cat <<EOF
export SRC_CHAIN_ID=$SOURCE_CHAIN_ID
export L1_BATCH_NUMBER=$L1_BATCH_NUMBER
export L2_MESSAGE_INDEX=$L2_MESSAGE_INDEX
export TX_NUMBER_IN_BATCH=$TX_NUMBER_IN_BATCH
export MESSAGE_SENDER=$MESSAGE_SENDER
export MESSAGE_DATA=$MESSAGE_DATA
export MESSAGE_PROOF_ARRAY='$MESSAGE_PROOF_ARRAY'
export GATEWAY_BLOCK_NUMBER=$GATEWAY_BLOCK_NUMBER
export PROOF_ENCODED_HEX=$PROOF_ENCODED_HEX
EOF
