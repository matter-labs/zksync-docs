---
title: eth_sendRawTransaction Curl Example
---

```sh
curl --request POST \
  --url https://mainnet.era.zksync.io/ \
  --header 'Content-Type: application/json' \
  --data '{
      "jsonrpc": "2.0",
      "id": 1,
      "method": "eth_sendRawTransaction",
      "params": ["0xf86c808504a817c80082520894095e7baea6a6c7c4c2dfeb977efac326af552d870a868e8..."]
    }'
```
