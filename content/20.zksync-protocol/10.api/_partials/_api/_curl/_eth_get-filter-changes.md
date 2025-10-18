---
title: eth_getFilterChanges Curl Example
---

```sh
curl --request POST \
  --url https://mainnet.era.zksync.io/ \
  --header 'Content-Type: application/json' \
  --data '{
      "jsonrpc": "2.0",
      "id": 1,
      "method": "eth_getFilterChanges",
      "params": [
        "0x127e9eca4f7751fb4e5cb5291ad8b455"
      ]
    }'
```
