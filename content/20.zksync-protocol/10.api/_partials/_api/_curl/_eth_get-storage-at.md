---
title: eth_getStorageAt Curl Example
---

```sh
curl --request POST \
  --url https://mainnet.era.zksync.io/ \
  --header 'Content-Type: application/json' \
  --data '{
      "jsonrpc": "2.0",
      "id": 2,
      "method": "eth_getStorageAt",
      "params": ["0x0cBE9d8a007ac5A090Ebdf044b688Fa8dfD862c3", "0x0", "latest"]
    }'
```
