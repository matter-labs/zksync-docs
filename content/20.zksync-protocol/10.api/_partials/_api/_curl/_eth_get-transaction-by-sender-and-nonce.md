---
title: eth_getTransactionBySenderAndNonce Curl Example
---

```sh
curl --request POST \
  --url https://zksync-os-testnet-alpha.zksync.dev/ \
  --header 'Content-Type: application/json' \
  --data '{
      "jsonrpc": "2.0",
      "id": 1,
      "method": "eth_getTransactionBySenderAndNonce",
      "params": ["0x785C0219D5e23950F88452D23113B3b680006e6a", "0xc"]
    }'
```
