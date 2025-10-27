---
title: debug_traceTransaction Curl Example
---

```sh
curl --request POST \
  --url https://mainnet.era.zksync.io/ \
  --header 'Content-Type: application/json' \
  --data '{
      "jsonrpc": "2.0",
      "id": 1,
      "method": "debug_traceTransaction",
      "params": ["0x4b228f90e796de5a18227072745b0f28e0c4a4661a339f70d3bdde591d3b7f3a"]
    }'
```
