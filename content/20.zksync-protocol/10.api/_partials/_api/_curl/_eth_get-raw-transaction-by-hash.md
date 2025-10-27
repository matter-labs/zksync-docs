---
title: eth_getRawTransactionByHash Curl Example
---

```sh
curl --request POST \
  --url https://zksync-os-testnet-alpha.zksync.dev/ \
  --header 'Content-Type: application/json' \
  --data '{
      "jsonrpc": "2.0",
      "id": 1,
      "method": "eth_getRawTransactionByHash",
      "params": ["0xa858b5db1e935b50424691e9579a54047ca63979c52f85c2bd856c78cdecb661"]
    }'
```
