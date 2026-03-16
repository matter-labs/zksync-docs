---
title: Quickstart - Hardhat Interact Local Viem
---

1. Create a new file in the `scripts` folder called `interact.ts`.

    :test-action{actionId="create-hardhat-viem-script-file"}

1. Copy and paste the script below into `scripts/interact.ts`.

    :test-action{actionId="add-hardhat-viem-script"}

    ```ts
    :code-import{filePath="zksync-os/scripts/interact-local-viem.ts"}
    ```

1. Set your deployed contract address at the top of the script file.

    :test-action{actionId="create-hh-env-file"}
    :test-action{actionId="set-hardhat-viem-contract-address"}

1. Run the script.

    :test-action{actionId="run-hardhat-viem-script"}

    ::code-group

    ```bash [npm]
    npx hardhat run scripts/interact.ts
    ```

    ```bash [yarn]
    yarn hardhat run scripts/interact.ts
    ```

    ```bash [pnpm]
    pnpm hardhat run scripts/interact.ts
    ```

    ```bash [bun]
    bun hardhat run scripts/interact.ts
    ```

    ::

You should see in the logs the total messages is `2` and the last message is `Hello from Hardhat`.
