---
title: Quickstart - Foundry Interact Testnet
---

1. Create a new file in the `script` folder called `InteractQuickstartToken.s.sol`.

1. Copy and paste the script below into `InteractQuickstartToken.s.sol`.
    This script will transfer 10 tokens to the recipient address and log some metadata for the token.

    ```solidity
    :code-import{filePath="zksync-os-foundry/script/InteractQuickstartToken.s.sol"}
    ```

1. Set your deployed contract address and recipient address.

    ```bash
    export CONTRACT_ADDRESS="0x..."
    export RECIPIENT_ADDRESS="0x..."
    ```

1. Run the interaction script.

    ```bash
    forge script script/InteractQuickstartToken.s.sol --rpc-url https://zksync-os-testnet-alpha.zksync.dev --skip-simulation --broadcast --private-key $TESTNET_PRIVATE_KEY
    ```

You should see the token name, symbol, transfer amount, and recipient balance in the logs.
