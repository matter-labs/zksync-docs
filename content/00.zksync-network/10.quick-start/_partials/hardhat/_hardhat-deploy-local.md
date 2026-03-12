---
title: Quickstart - Hardhat Deploy Local
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

1. Add the local node to the `hardhat.config.ts` file and configure the ignition required confirmations.

    ```ts [hardhat.config.ts]
     :code-import{filePath="zksync-os/hardhat.config.local.ts:hh-config"}
    ```

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
    npx hardhat ignition deploy ignition/modules/ZeekMessages.ts --network anvil
    ```

    ```bash [yarn]
    yarn hardhat ignition deploy ignition/modules/ZeekMessages.ts --network anvil
    ```

    ```bash [pnpm]
    pnpm hardhat ignition deploy ignition/modules/ZeekMessages.ts --network anvil
    ```

    ```bash [bun]
    bun hardhat ignition deploy ignition/modules/ZeekMessages.ts --network anvil
    ```

    ::
