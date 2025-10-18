---
title: eth_getBlockByHash Curl Example
---

```sh
curl --request POST \
  --url https://mainnet.era.zksync.io/ \
  --header 'Content-Type: application/json' \
  --data '{
      "jsonrpc": "2.0",
      "id": 1,
      "method": "eth_getBlockByHash",
      "params": [
        "0x5046bdc714b2a9b40e9fbfdfc5140371c1b03b40335d908de92a7686dcc067e9",
        false
      ]
    }'
```
