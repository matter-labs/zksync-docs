---
title: eth_getBalance Curl Example
---

```sh
curl --request POST \
  --url https://mainnet.era.zksync.io/ \
  --header 'Content-Type: application/json' \
  --data '{
      "jsonrpc": "2.0",
      "id": 1,
      "method": "eth_getBalance",
      "params": [
        "0x103301a002a8AaDC8Fb83A2A70740FA6da7f83b8",
        "latest"
      ]
    }'
```
