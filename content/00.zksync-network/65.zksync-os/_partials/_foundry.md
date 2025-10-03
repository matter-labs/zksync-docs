---
title: Foundry
---

1. Create a new foundry project:

    ```bash
    forge init Counter
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
    forge script script/Counter.s.sol --rpc-url https://zksync-os-testnet-alpha.zksync.dev --broadcast --private-key $TESTNET_PRIVATE_KEY
    ```

1. Set the number value:

    ```bash
    cast send 0xCA1386680bfd9D89c7cc6Fc3ba11938ba6E44fef \
    "setNumber(uint256)" 5 \
    --rpc-url https://zksync-os-testnet-alpha.zksync.dev \
    --private-key $TESTNET_PRIVATE_KEY
    ```

1. Get the latest number value:

    ```bash
    cast call 0xCA1386680bfd9D89c7cc6Fc3ba11938ba6E44fef \
    "number()" \
    --rpc-url https://zksync-os-testnet-alpha.zksync.dev
    ```
