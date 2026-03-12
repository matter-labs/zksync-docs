---
title: Quickstart - Hardhat Deploy Testnet
---

1. Create a new project folder

    ```bash
    mkdir hardhat-example
    cd hardhat-example
    ```

1. Initialize a new Hardhat 3 project with Mocha and Ethers.js.
  Select `y` to install the dependencies.

    ```bash
    npx hardhat --init
    ```

1. Add ZKsync OS to the `hardhat.config.ts` file and configure the ignition required confirmations.

    ```ts [hardhat.config.ts]
     :code-import{filePath="zksync-os/hardhat.config.ts:hh-config"}
    ```

1. Add your private key to the keystore as `TESTNET_PRIVATE_KEY`.
  Get this from your browser wallet for the same account where you bridged testnet ETH.

    ::code-group

    ```bash [npm]
    npx hardhat keystore set TESTNET_PRIVATE_KEY
    ```

    ```bash [yarn]
    yarn hardhat keystore set TESTNET_PRIVATE_KEY
    ```

    ```bash [pnpm]
    pnpm hardhat keystore set TESTNET_PRIVATE_KEY
    ```

    ```bash [bun]
    bun hardhat keystore set TESTNET_PRIVATE_KEY
    ```

    ::

1. Create a new file in the `contracts` folder called `ZeekMessages.sol`.

1. Copy and paste the `ZeekMessages` contract above into the `ZeekMessages.sol` file.

1. Create a new file in the `ignition/modules` folder called `ZeekMessages.ts`.

1. Copy and paste the ignition module below into `ZeekMessages.ts`.

    ```solidity
    :code-import{filePath="zksync-os/ignition/modules/ZeekMessages.ts"}
    ```

1. Compile and deploy the contract.

    :display_partial{path="_partials/commands/_hh_compile"}

    ::code-group

    ```bash [npm]
    npx hardhat ignition deploy ignition/modules/ZeekMessages.ts --network zksyncOS
    ```

    ```bash [yarn]
    yarn hardhat ignition deploy ignition/modules/ZeekMessages.ts --network zksyncOS
    ```

    ```bash [pnpm]
    pnpm hardhat ignition deploy ignition/modules/ZeekMessages.ts --network zksyncOS
    ```

    ```bash [bun]
    bun hardhat ignition deploy ignition/modules/ZeekMessages.ts --network zksyncOS
    ```

    ::

### Verify the contract

You can optionally verify the contract so the code shows on the block explorer.

1. Install the Hardhat verify SDK:

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

1. Add `hardhatVerify` to the hardhat plugins and configure the verification endpoint:

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

1. Use your deployed contract address to verify using `hardhat-verify`:

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
