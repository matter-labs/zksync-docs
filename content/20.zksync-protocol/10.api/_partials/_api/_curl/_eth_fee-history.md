---
title: eth_feeHistory Curl Example
---

```sh
curl --request POST \
  --url https://mainnet.era.zksync.io/ \
  --header 'Content-Type: application/json' \
  --data '{
      "jsonrpc": "2.0",
      "id": 1,
      "method": "eth_feeHistory",
      "params": [
          "10",
          "0x3039",
          [25.0, 50.0, 75.0]
      ]
    }'
```
