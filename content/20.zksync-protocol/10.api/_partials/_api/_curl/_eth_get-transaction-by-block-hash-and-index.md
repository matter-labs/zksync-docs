---
title: eth_getTransactionByBlockHashAndIndex Curl Example
---

```sh
curl --request POST \
  --url https://mainnet.era.zksync.io/ \
  --header 'Content-Type: application/json' \
  --data '{
      "jsonrpc": "2.0",
      "id": 2,
      "method": "eth_getTransactionByBlockHashAndIndex",
      "params": [
        "0x5046bdc714b2a9b40e9fbfdfc5140371c1b03b40335d908de92a7686dcc067e9",
        "0x0"
      ]
    }'
```
