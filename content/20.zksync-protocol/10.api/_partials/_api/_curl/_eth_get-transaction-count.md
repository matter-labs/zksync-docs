---
title: eth_getTransactionCount Curl Example
---

```sh
curl --request POST \
  --url https://mainnet.era.zksync.io/ \
  --header 'Content-Type: application/json' \
  --data '{
      "jsonrpc": "2.0",
      "id": 2,
      "method": "eth_getTransactionCount",
      "params": [
        "0x0f54f47bf9b8e317b214ccd6a7c3e38b893cd7f0",
        "latest"
      ]
    }'
```
