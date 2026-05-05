#!/usr/bin/env bash
set -euo pipefail

if ! command -v cast >/dev/null 2>&1; then
  echo "error: cast is required" >&2
  exit 1
fi

if [[ $# -lt 1 || $# -gt 4 ]]; then
  echo "usage: $0 <gateway_block_number> [chain2_rpc_url] [gateway_chain_id] [private_key]" >&2
  echo "example: $0 42 http://localhost:3051 506 \$LOCAL_PRIVATE_KEY" >&2
  exit 1
fi

GATEWAY_BLOCK_NUMBER="$1"
CHAIN2_RPC="${2:-http://localhost:3051}"
GATEWAY_CHAIN_ID="${3:-506}"
LOCAL_PRIVATE_KEY="${4:-0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110}"
INTEROP_ROOT_STORAGE="0x0000000000000000000000000000000000010008"
ZERO_ROOT="0x0000000000000000000000000000000000000000000000000000000000000000"

ME=$(cast wallet address --private-key "$LOCAL_PRIVATE_KEY")

while true; do
  INTEROP_ROOT=$(cast call "$INTEROP_ROOT_STORAGE" \
    "interopRoots(uint256,uint256)(bytes32)" \
    "$GATEWAY_CHAIN_ID" \
    "$GATEWAY_BLOCK_NUMBER" \
    --rpc-url "$CHAIN2_RPC")

  if [[ "$INTEROP_ROOT" != "$ZERO_ROOT" ]]; then
    echo "export INTEROP_ROOT=$INTEROP_ROOT"
    exit 0
  fi

  cast send "$ME" \
    --value 1 \
    --rpc-url "$CHAIN2_RPC" \
    --private-key "$LOCAL_PRIVATE_KEY" \
    >/dev/null

  sleep 5
done
