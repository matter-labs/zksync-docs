---
title: Quickstart - Testnet  Foundry
---

If you don't already have `forge` installed,
you can install it via [`foundryup`](https://www.getfoundry.sh/introduction/installation).

1. Create a new foundry project:

    ```bash
    forge init QuickstartToken
    ```

    ```bash
    cd QuickstartToken
    ```

1. Install OpenZeppelin Contracts.

    :display_partial{path="/zksync-network/quick-start/_partials/foundry/_foundry-install-openzeppelin"}

1. Create a new file in the `src` folder called `QuickstartToken.sol`.

1. Copy and paste the `QuickstartToken` contract above into the `QuickstartToken.sol` file.

1. Create a new file in the `script` folder called `QuickstartToken.s.sol`.

1. Copy and paste the script below into `QuickstartToken.s.sol`.
    This script will be used to deploy the contract.

    ```solidity
    :code-import{filePath="zksync-os-foundry/script/QuickstartToken.s.sol"}
    ```

1. Build the project.

    ```bash
    forge build
    ```

1. Set your private key for deploying.
    Get this from your browser wallet for the same account where you bridged testnet ETH.

    ```bash
    export TESTNET_PRIVATE_KEY="0x..."
    ```

1. Deploy the contract using the command below.
    Your contract address will be logged in the output.

    ```bash
    forge script script/QuickstartToken.s.sol --rpc-url https://zksync-os-testnet-alpha.zksync.dev --broadcast --skip-simulation --private-key $TESTNET_PRIVATE_KEY
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
    src/QuickstartToken.sol:QuickstartToken
    ```

1. Verify if the contract was successfully verified by searching for your contract address on the testnet [block explorer](https://zksync-os-testnet-alpha.staging-scan-v2.zksync.dev)
    and clicking on the "Contract" tab.
