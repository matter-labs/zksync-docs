---
title: Quickstart - Hardhat Deploy Local
---

1. Create a new project folder

    ```bash
    mkdir hardhat-example
    cd hardhat-example
    ```

1. Initialize a new Hardhat 3 project.
    You can choose to either use `Mocha` with `Ethers.js` or `Node Test Runner` with `viem`.
    Select `y` to install the dependencies.

    :test-action{actionId="init-hardhat-project"}

    ```bash
    npx hardhat --init
    ```

1. Install OpenZeppelin Contracts.

    :display_partial{path="/zksync-network/quick-start/_partials/hardhat/_hardhat-install-openzeppelin"}

1. Add the local node to the `hardhat.config.ts` file and configure the ignition required confirmations.

    :test-action{actionId="configure-hardhat-local-config"}

    ```ts [hardhat.config.ts]
     :code-import{filePath="zksync-os/hardhat.config.local.ts:hh-config"}
    ```

1. Create a new file in the `contracts` folder called `QuickstartToken.sol`.

    :test-action{actionId="create-hardhat-contract-file"}

1. Copy and paste the `QuickstartToken` contract above into the `QuickstartToken.sol` file.

1. Create a new file in the `ignition/modules` folder called `QuickstartToken.ts`.

    :test-action{actionId="create-hardhat-ignition-module"}

1. Copy and paste the ignition module below into `QuickstartToken.ts`.
    This will be used to deploy the contract.

    :test-action{actionId="add-hardhat-ignition-module"}

    ```solidity
    :code-import{filePath="zksync-os/ignition/modules/QuickstartToken.ts"}
    ```

1. Compile and deploy the contract.

    :test-action{actionId="compile-hardhat-project"}

    :display_partial{path="_partials/commands/_hh_compile"}

    :test-action{actionId="deploy-hardhat-contract"}

    ::code-group

    ```bash [npm]
    npx hardhat ignition deploy ignition/modules/QuickstartToken.ts --network anvil
    ```

    ```bash [yarn]
    yarn hardhat ignition deploy ignition/modules/QuickstartToken.ts --network anvil
    ```

    ```bash [pnpm]
    pnpm hardhat ignition deploy ignition/modules/QuickstartToken.ts --network anvil
    ```

    ```bash [bun]
    bun hardhat ignition deploy ignition/modules/QuickstartToken.ts --network anvil
    ```

    ::
