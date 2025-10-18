---
title: eth_uninstallFilter Curl Example
---

```sh
curl --request POST \
  --url https://mainnet.era.zksync.io/ \
  --header 'Content-Type: application/json' \
  --data '{
      "jsonrpc": "2.0",
      "id": 1,
      "method": "eth_uninstallFilter",
      "params": ["0xb825a38f6350ff4d75d806e6f83a42a31d39fc7ef4fde02b404e8edeef6799b"]
    }'
```
