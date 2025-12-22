---
title: eth_sendRawTransactionSync Curl Example
---

```sh
curl --request POST \
  --url https://zksync-os-testnet-alpha.zksync.dev/ \
  --header 'Content-Type: application/json' \
  --data '{
      "jsonrpc": "2.0",
      "id": 1,
      "method": "eth_sendRawTransactionSync",
      "params": ["0x..."]
    }'
```
