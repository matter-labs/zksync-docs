---
title: Ethers with Remix
---

This scripts uses `ethers` to interact with the contract we’ve just deployed.

::callout{icon="i-heroicons-light-bulb"}
Existing libraries like `ethers` , and `viem` can be used to interact with smart contracts deployed on ZKsync Era.
::

Fill the following variables:

- `TOKEN_CONTRACT_ADDRESS`: the contract address of the ERC20 token we just deployed.
- `RECEIVER_WALLET`: address of a different account that will receive new tokens.
- `TOKEN_AMOUNT`: the amount of tokens we’ll send to the account.
