---
title: Quickstart - Foundry Interact Local
---

1. Create a new file in the `script` folder called `InteractQuickstartToken.s.sol`.

    :test-action{actionId="create-foundry-interact-script-file"}

1. Copy and paste the script below into `InteractQuickstartToken.s.sol`.
    This script will transfer 10 tokens to the recipient address and log some metadata for the token.

    :test-action{actionId="add-foundry-interact-script"}

    ```solidity
    :code-import{filePath="zksync-os-foundry/script/InteractQuickstartToken.s.sol"}
    ```

1. Set your deployed contract address.

    :test-action{actionId="create-env-file"}
    :test-action{actionId="set-foundry-contract-address"}

    ```bash
    export CONTRACT_ADDRESS="0x..."
    ```

    You may also change the recipient address.
    This example uses another `anvil` rich wallet as the recipient by default.

1. Run the interaction script.

    :test-action{actionId="run-foundry-interact-script"}

    ```bash
    forge script script/InteractQuickstartToken.s.sol --rpc-url http://localhost:8545 --broadcast --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
    ```

You should see the token name, symbol, transfer amount, and recipient balance in the logs.
