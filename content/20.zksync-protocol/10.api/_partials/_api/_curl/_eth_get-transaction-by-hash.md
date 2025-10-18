---
title: eth_getTransactionByHash Curl Example
---

```sh
curl --request POST \
  --url https://mainnet.era.zksync.io/ \
  --header 'Content-Type: application/json' \
  --data '{
      "jsonrpc": "2.0",
      "id": 2,
      "method": "eth_getTransactionByHash",
      "params": [
        "0xb2adc4d2b3203e186001dc37fdf02cc8e772518425d263adc6a17dbddff3bfda"
      ]
    }'
```
