---
title: Transaction Object for Sending
---

Object - A transaction object:

1. **from**: DATA, 20 Bytes - The address the transaction is sent from.
1. **to**: DATA, 20 Bytes - (optional when creating new contract) The address the transaction is directed to.
1. **gas**: QUANTITY - (optional, default: 90000) Integer of the gas provided for the transaction execution. It will return unused gas.
1. **gasPrice**: QUANTITY - (optional, default: To-Be-Determined) Integer of the gasPrice used for each paid gas.
1. **value**: QUANTITY - (optional) Integer of the value sent with this transaction.
1. **input**: DATA - The compiled code of a contract OR the hash of the invoked method signature and encoded parameters.
1. **nonce**: QUANTITY - (optional) Integer of a nonce. This allows to overwrite pending transactions that use the same nonce.
