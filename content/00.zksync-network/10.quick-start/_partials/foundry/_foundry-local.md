---
title: Quickstart - Local Foundry
---

1. Create a new foundry project.
  You should already have `forge` installed after installing `foundryup` in the previous setup.

    :test-action{actionId="create-foundry-project"}

    ```bash
    forge init QuickstartToken
    ```

    :test-action{actionId="move-into-foundry-project"}

    ```bash
    cd QuickstartToken
    ```

1. Install OpenZeppelin Contracts.

    :display_partial{path="/zksync-network/quick-start/_partials/foundry/_foundry-install-openzeppelin"}

1. Create a new file in the `src` folder called `QuickstartToken.sol`.

    :test-action{actionId="create-foundry-contract-file"}

1. Copy and paste the `QuickstartToken` contract above into the `QuickstartToken.sol` file.

1. Create a new file in the `script` folder called `QuickstartToken.s.sol`.

    :test-action{actionId="create-foundry-deploy-script-file"}

1. Copy and paste the script below into `QuickstartToken.s.sol`.

    :test-action{actionId="add-foundry-deploy-script"}

    ```solidity
    :code-import{filePath="zksync-os-foundry/script/QuickstartToken.s.sol"}
    ```

1. Build the project

    :test-action{actionId="build-foundry-project"}

    ```bash
    forge build
    ```

1. Deploy the contract using one of the test wallets provided by `anvil`:

    :test-action{actionId="deploy-foundry-contract"}

    ```bash
    forge script script/QuickstartToken.s.sol --rpc-url http://localhost:8545 --broadcast --skip-simulation --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
    ```
