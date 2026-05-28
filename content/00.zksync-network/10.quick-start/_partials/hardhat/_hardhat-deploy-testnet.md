---
title: Quickstart - Hardhat Deploy Testnet
---

1. Create a new project folder

    ```bash
    mkdir hardhat-example
    cd hardhat-example
    ```

1. Initialize a new Hardhat 3 project.
    You can choose to either use `Mocha` with `Ethers.js` or `Node Test Runner` with `viem`.
    Select `y` to install the dependencies.

    ```bash
    npx hardhat --init
    ```

1. Install OpenZeppelin Contracts.

    :display_partial{path="/zksync-network/quick-start/_partials/hardhat/_hardhat-install-openzeppelin"}

1. Add ZKsync OS to the `hardhat.config.ts` file and configure the ignition required confirmations.

    ```ts [hardhat.config.ts]
     :code-import{filePath="zksync-os/hardhat.config.ts:hh-config"}
    ```

1. Add your private key to the Hardhat keystore as `TESTNET_PRIVATE_KEY`.
    If you've never used `hardhat keystore` before, you will be asked to set up a password.
    Get the private key from your browser wallet for the same account where you bridged testnet ETH.

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

1. Create a new file in the `contracts` folder called `QuickstartToken.sol`.

1. Copy and paste the `QuickstartToken` contract above into the `QuickstartToken.sol` file.

1. Create a new file in the `ignition/modules` folder called `QuickstartToken.ts`.

1. Copy and paste the ignition module below into `QuickstartToken.ts`.
    This will be used to deploy the contract.

    ```solidity
    :code-import{filePath="zksync-os/ignition/modules/QuickstartToken.ts"}
    ```

1. Compile and deploy the contract.
    Your contract address will be logged in the output.

    :display_partial{path="_partials/commands/_hh_compile"}

    ::code-group

    ```bash [npm]
    npx hardhat ignition deploy ignition/modules/QuickstartToken.ts --network zksyncOS
    ```

    ```bash [yarn]
    yarn hardhat ignition deploy ignition/modules/QuickstartToken.ts --network zksyncOS
    ```

    ```bash [pnpm]
    pnpm hardhat ignition deploy ignition/modules/QuickstartToken.ts --network zksyncOS
    ```

    ```bash [bun]
    bun hardhat ignition deploy ignition/modules/QuickstartToken.ts --network zksyncOS
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
    npx hardhat clean
    npx hardhat compile --build-profile production
    npx hardhat verify --build-profile production --network zksyncOS 0x<YOUR_CONTRACT_ADDRESS> "Quickstart Token" "QKT"
    ```

    ```bash [yarn]
    yarn hardhat clean
    yarn hardhat compile --build-profile production
    yarn hardhat verify --build-profile production --network zksyncOS 0x<YOUR_CONTRACT_ADDRESS> "Quickstart Token" "QKT"
    ```

    ```bash [pnpm]
    pnpm hardhat clean
    pnpm hardhat compile --build-profile production
    pnpm hardhat verify --build-profile production --network zksyncOS 0x<YOUR_CONTRACT_ADDRESS> "Quickstart Token" "QKT"
    ```

    ```bash [bun]
    bun hardhat clean
    bun hardhat compile --build-profile production
    bun hardhat verify --build-profile production --network zksyncOS 0x<YOUR_CONTRACT_ADDRESS> "Quickstart Token" "QKT"
    ```

    ::

1. Verify if the contract was successfully verified by searching for your contract address on the [block explorer](https://zksync-os-testnet-alpha.staging-scan-v2.zksync.dev)
    and clicking on the "Contract" tab.
