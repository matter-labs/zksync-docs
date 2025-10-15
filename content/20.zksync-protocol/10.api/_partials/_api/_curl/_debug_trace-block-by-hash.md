---
title: debug_traceBlockByHash Curl Example
---

```sh
curl --request POST \
  --url https://mainnet.era.zksync.io/ \
  --header 'Content-Type: application/json' \
  --data '{
      "jsonrpc": "2.0",
      "id": 1,
      "method": "debug_traceBlockByHash",
      "params": ["0x4bd0bd4547d8f8a4fc86a024e54558e156c1acf43d82e24733c6dac2fe5c5fc7"]
    }'
```
