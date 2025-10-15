---
title: eth_getHeaderByNumber Curl Example
---

```sh
curl --request POST \
  --url https://zksync-os-testnet-alpha.zksync.dev/ \
  --header 'Content-Type: application/json' \
  --data '{
      "jsonrpc": "2.0",
      "id": 1,
      "method": "eth_getHeaderByNumber",
      "params": ["0x1b"]
    }'
```
