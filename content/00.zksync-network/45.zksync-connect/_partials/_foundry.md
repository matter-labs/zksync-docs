---
title: Foundry
---

1. Create a new foundry project:

    ```bash
    forge init Counter
    ```

    ```bash
    cd Counter
    ```

1. Build the project

    ```bash
    forge build
    ```

1. Set your private key for deploying:

    ```bash
    export TESTNET_PRIVATE_KEY="0x..."
    ```

1. Deploy the contract:

    ```bash
    forge script script/Counter.s.sol --rpc-url https://zksync-os-testnet-alpha.zksync.dev --broadcast --skip-simulation --private-key $TESTNET_PRIVATE_KEY
    ```

1. Set the number value:

    ```bash
    cast send 0x<YOUR_CONTRACT_ADDRESS> \
    "setNumber(uint256)" 5 \
    --rpc-url https://zksync-os-testnet-alpha.zksync.dev \
    --private-key $TESTNET_PRIVATE_KEY
    ```

1. Get the latest number value:

    ```bash
    cast call 0x<YOUR_CONTRACT_ADDRESS> \
    "number()" \
    --rpc-url https://zksync-os-testnet-alpha.zksync.dev
    ```

1. Verify the contract:

    ```bash
    forge verify-contract \
    --chain-id 8022833 \
    --verifier custom \
    --verifier-url https://block-explorer-api.zksync-os-testnet-alpha.zksync.dev/api \
    0x<YOUR_CONTRACT_ADDRESS> \
    src/Counter.sol:Counter
    ```
