---
title: Quickstart - Local Foundry
---

1. Create a new foundry project.
  You should already have `forge` installed after installing `foundryup` in the previous setup.

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

1. Deploy the contract using one of the test wallets provided by `anvil`:

    ```bash
    forge script script/ZeekMessages.s.sol --rpc-url http://localhost:8545 --broadcast --skip-simulation --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
    ```
