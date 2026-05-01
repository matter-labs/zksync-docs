---
title: Foundry
---

1. Create a new Foundry project.

    ```bash
    forge init InteropAssetTransfer
    ```

    ```bash
    cd InteropAssetTransfer
    ```

1. Install OpenZeppelin Contracts.

    :display_partial{path="/zksync-network/quick-start/_partials/foundry/_foundry-install-openzeppelin"}

1. Create a new file in the `src` folder called `QuickstartToken.sol`.

    ```bash
    touch src/QuickstartToken.sol
    ```

1. Copy and paste the contract below into `QuickstartToken.sol`.

    ```solidity
    :code-import{filePath="zksync-os-foundry/src/QuickstartToken.sol"}
    ```

1. Create a new script in the `script` folder called `QuickstartToken.s.sol`.

    ```bash
    touch script/QuickstartToken.s.sol
    ```

1. Copy and paste the script below into `QuickstartToken.s.sol`.

    ```solidity
    :code-import{filePath="zksync-os-foundry/script/QuickstartToken.s.sol"}
    ```

1. Build the project.

    ```bash
    forge build
    ```

1. Set your private key for deploying.

    ```bash
    export LOCAL_PRIVATE_KEY="0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110"
    ```

1. Deploy the token contract on chain `6565`.

    ```bash
    forge script script/QuickstartToken.s.sol \
      --rpc-url http://localhost:3050 \
      --broadcast \
      --skip-simulation \
      --private-key $LOCAL_PRIVATE_KEY
    ```

::callout{icon="i-heroicons-exclamation-triangle" color="amber"}
TODO: verify the low-level Foundry asset transfer flow.
The repo currently includes a checked-in Foundry example for transaction
bundles, but not yet for creating an interop `sendErc20` action and finalizing
it without `zksync-js`.
::
