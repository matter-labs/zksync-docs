---
title: CallRequest Params
---

**CallRequest** - object
::collapsible

- **from**: DATA, 20 bytes - Sender address. Arbitrary if not provided.
- **to**: DATA, 20 bytes - Recipient address. Required for `eth_call`.
- **gas**: QUANTITY - Gas limit for the transaction. Defaults if not provided.
- **gas_price**: QUANTITY - Gas price for the transaction. Defaults if not provided.
- **max_fee_per_gas**: QUANTITY - Maximum fee per unit of gas.
- **max_priority_fee_per_gas**: QUANTITY - Maximum priority fee per unit of gas.
- **value**: QUANTITY - Value transferred in the transaction. None for no transfer.
- **data / input**: DATA - Data sent with the transaction. Empty if not provided.
- **nonce**: DATA, 32 bytes - Transaction nonce.
- **transaction_type**: QUANTITY, 8 bytes - Type of the transaction.
- **access_list**: AccessList - EIP-2930 access list.
- **customData**: OBJECT - Extra parameters for
[EIP712 transactions](/zksync-protocol/zksync-era/transactions/transaction-lifecycle#eip-712-0x71), like `paymasterParams` or `customSignature`.
::
