---
title: zks_getL2ToL1LogProof Curl Example
---

```sh
curl --request POST \
  --url https://mainnet.era.zksync.io/ \
  --header 'Content-Type: application/json' \
  --data '{
      "jsonrpc": "2.0",
      "id": 1,
      "method": "zks_getL2ToL1LogProof",
      "params": [
        "0x2a1c6c74b184965c0cb015aae9ea134fd96215d2e4f4979cfec12563295f610e"
      ]
    }'
```
