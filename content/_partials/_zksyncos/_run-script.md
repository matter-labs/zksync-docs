---
title: Hardhat 3 Run Script
---

8. Run the script <!-- markdownlint-disable-line -->

        ::code-group

        ```bash [npm]
        npx hardhat run scripts/increment.ts
        ```

        ```bash [yarn]
        yarn hardhat run scripts/increment.ts
        ```

        ```bash [pnpm]
        pnpm hardhat run scripts/increment.ts
        ```

        ```bash [bun]
        bun hardhat run scripts/increment.ts
        ```

        ::

9. Install the Hardhat verify SDK: <!-- markdownlint-disable-line -->

    ::code-group

    ```bash [npm]
    npm install --save-dev @nomicfoundation/hardhat-verify
    ```

    ```bash [yarn]
    yarn add -D @nomicfoundation/hardhat-verify
    ```

    ```bash [pnpm]
    pnpm add -D @nomicfoundation/hardhat-verify
    ```

    ```bash [bun]
    bun add -D @nomicfoundation/hardhat-verify
    ```

    ::

10. Add `hardhatVerify` to the hardhat plugins and configure the verification endpoint: <!-- markdownlint-disable-line -->

    ```ts [hardhat.config.ts]
    import hardhatVerify from "@nomicfoundation/hardhat-verify";

    const config: HardhatUserConfig = {
    plugins: [
        hardhatVerify,
        // ...other plugins...
    ],
    // ...other config...
    :code-import{filePath="zksync-os/hardhat.config.ts:verify-config"}
    };
    ```

11. Use your deployed contract address to verify using `hardhat-verify`: <!-- markdownlint-disable-line -->

    ::code-group

    ```bash [npm]
    npx hardhat verify --network zksyncOS 0x<YOUR_CONTRACT_ADDRESS>
    ```

    ```bash [yarn]
    yarn hardhat verify --network zksyncOS 0x<YOUR_CONTRACT_ADDRESS>
    ```

    ```bash [pnpm]
    pnpm hardhat verify --network zksyncOS 0x<YOUR_CONTRACT_ADDRESS>
    ```

    ```bash [bun]
    bun hardhat verify --network zksyncOS 0x<YOUR_CONTRACT_ADDRESS>
    ```

    ::
