---
title: Quickstart - Contract code
---

## Review the smart contract code

The quickstart contract is a basic ERC-20 token built with OpenZeppelin.
The entire code is as follows:

:test-action{actionId="add-token-contract"}

```solidity
:code-import{filePath="zksync-os/contracts/QuickstartToken.sol"}
```

The contract:

- imports helper contracts from `@openzeppelin/contracts` so that our contract is a standard ERC-20 contract, has an owner,
  and allows to tokens to be burned
- sets the token name to the symbol using the constructor arguments
- sets the deployer wallet as the owner
- mints an initial supply of 100 tokens to the deployer
- only allows the owner to mint additional tokens using the `mint` function
