---
title: Quickstart - Foundry Interact Local
---

1. Create a new file in the `script` folder called `InteractZeekMessages.s.sol`.

1. Copy and paste the script below into `InteractZeekMessages.s.sol`.

    ```solidity
    :code-import{filePath="zksync-os-foundry/script/InteractZeekMessages.s.sol"}
    ```

1. Set your deployed contract address.

    ```bash
    export CONTRACT_ADDRESS="0x..."
    ```

1. Run the interaction script.

    ```bash
    forge script script/InteractZeekMessages.s.sol --rpc-url http://localhost:8545 --broadcast --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
    ```

You should see in the logs the total messages is `1` and the last message is `Hello from Foundry`.
