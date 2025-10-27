---
title: eth_getFilterLogs Curl Example
---

```sh
curl --request POST \
  --url https://mainnet.era.zksync.io/ \
  --header 'Content-Type: application/json' \
  --data '{
      "jsonrpc": "2.0",
      "id": 1,
      "method": "eth_getFilterLogs",
      "params": [
        "0xae2bfd759a98fd5e7a262f785b7706103a174391c5081dda92fea2cf6d9f94a6"
      ]
    }'
```
