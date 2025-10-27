---
title: debug_traceBlockByNumber Curl Example
---

```sh
curl --request POST \
  --url https://mainnet.era.zksync.io/ \
  --header 'Content-Type: application/json' \
  --data '{
      "jsonrpc": "2.0",
      "id": 1,
      "method": "debug_traceBlockByNumber",
      "params": ["0x24b258"]
    }'
```
