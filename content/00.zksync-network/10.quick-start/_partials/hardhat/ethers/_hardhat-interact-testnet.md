---
title: Quickstart - Hardhat Interact Testnet Ethers
---

1. Create a new file in the `scripts` folder called `interact.ts`.

1. Copy and paste the script below into `scripts/interact.ts`.

    ```ts
    :code-import{filePath="zksync-os/scripts/interact-testnet-ethers.ts"}
    ```

1. Set your deployed contract address at the top of the script file.

1. Run the script.

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
