---
title: eth_getTransactionByBlockNumberAndIndex Curl Example
---

```sh
curl --request POST \
  --url https://mainnet.era.zksync.io/ \
  --header 'Content-Type: application/json' \
  --data '{
      "jsonrpc": "2.0",
      "id": 1,
      "method": "eth_getRawTransactionByBlockNumberAndIndex",
      "params": ["0x3E38361", "0x0"]
    }'
```
