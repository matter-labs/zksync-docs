---
title: Quickstart - Foundry Interact Testnet
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
    forge script script/InteractZeekMessages.s.sol --rpc-url https://zksync-os-testnet-alpha.zksync.dev --broadcast --private-key $TESTNET_PRIVATE_KEY
    ```
