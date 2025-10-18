---
title: eth_call Curl Example
---

```sh
curl --request POST \
  --url https://mainnet.era.zksync.io/ \
  --header 'Content-Type: application/json' \
  --data '{
      "jsonrpc": "2.0",
      "id": 1,
      "method": "eth_call",
      "params": [
        {
          "to": "0xc94770007dda54cF92009BFF0dE90c06F603a09f"
        },
        "latest"
      ]
    }'
```
