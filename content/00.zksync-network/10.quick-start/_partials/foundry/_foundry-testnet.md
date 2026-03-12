---
title: Quickstart - Testnet  Foundry
---

If you don't already have `forge` installed,
you can install it via [`foundryup`](https://www.getfoundry.sh/introduction/installation).

1. Create a new foundry project:

    ```bash
    forge init ZeekMessages
    ```

    ```bash
    cd ZeekMessages
    ```

1. Create a new file in the `src` folder called `ZeekMessages.sol`.

1. Copy and paste the `ZeekMessages` contract above into the `ZeekMessages.sol` file.

1. Create a new file in the `script` folder called `ZeekMessages.s.sol`.

1. Copy and paste the script below into `ZeekMessages.s.sol`.

  ```solidity
  :code-import{filePath="zksync-os-foundry/script/ZeekMessages.s.sol"}
  ```

1. Build the project

    ```bash
    forge build
    ```

1. Set your private key for deploying.
    Get this from your browser wallet for the same account where you bridged testnet ETH.

    ```bash
    export TESTNET_PRIVATE_KEY="0x..."
    ```

1. Deploy the contract:

    ```bash
    forge script script/ZeekMessages.s.sol --rpc-url https://zksync-os-testnet-alpha.zksync.dev --broadcast --skip-simulation --private-key $TESTNET_PRIVATE_KEY
    ```

1. (Optional) Verify the contract.
    This will allow you to see the contract code in the block explorer.
    Replace `0x<YOUR_CONTRACT_ADDRESS>` with your deployed contract address from the previous step.

    ```bash
    forge verify-contract \
    --chain-id 8022833 \
    --verifier custom \
    --verifier-url https://block-explorer-api.zksync-os-testnet-alpha.zksync.dev/api \
    0x<YOUR_CONTRACT_ADDRESS> \
    src/ZeekMessages.sol:ZeekMessages
    ```
