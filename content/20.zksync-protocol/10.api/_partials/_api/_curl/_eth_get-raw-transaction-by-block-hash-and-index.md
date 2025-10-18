---
title: eth_getRawTransactionByBlockHashAndIndex Curl Example
---


```sh
curl --request POST \
  --url https://zksync-os-testnet-alpha.zksync.dev/ \
  --header 'Content-Type: application/json' \
  --data '{
      "jsonrpc": "2.0",
      "id": 1,
      "method": "eth_getRawTransactionByBlockHashAndIndex",
      "params": ["0x7c9b4377d10d03a44b5a77540d2bb071961be90b506e09a9f0bb27786fdd5fc5", "0x0"]
    }'
```
