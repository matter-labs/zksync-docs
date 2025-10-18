---
title: debug_traceCall Curl Example
---

```sh
curl --request POST \
  --url https://mainnet.era.zksync.io/ \
  --header 'Content-Type: application/json' \
  --data '{
      "jsonrpc": "2.0",
      "id": 1,
      "method": "debug_traceCall",
      "params": [
        {
          "from": "0x1111111111111111111111111111111111111111",
          "to": "0x2222222222222222222222222222222222222222",
          "data": "0xffffffff"
        },
        "0x24b258"
      ]
    }'
```
