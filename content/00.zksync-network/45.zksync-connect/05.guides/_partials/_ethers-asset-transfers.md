---
title: Hardhat 3 with Ethers
---

:display_partial{path="_partials/_zksyncos/_setup-folder"}

2. Initialize a new Hardhat 3 project with Mocha and Ethers.js. <!-- markdownlint-disable-line -->

    ```bash
    npx hardhat --init
    ```

:display_partial{path="/zksync-network/zksync-connect/guides/_partials/_hardhat-shared-asset-transfers"}

## Path 1: Deploy the token on L1

8. Create a new file in the `scripts` folder called `interop-asset-transfer.ts`. <!-- markdownlint-disable-line -->

    ```bash
    touch scripts/interop-asset-transfer.ts
    ```

9. Copy and paste the script below into the `interop-asset-transfer.ts` file. <!-- markdownlint-disable-line -->

    ::drop-panel

    ::panel{label="interop-asset-transfer.ts"}

    ```ts
    :code-import{filePath="local-zksync-os/scripts/interop-asset-transfer-from-l1-ethers.ts"}
    ```

    ::

    ::

10. Run the script. <!-- markdownlint-disable-line -->

    ::code-group

    ```bash [npm]
    npx hardhat run scripts/interop-asset-transfer.ts
    ```

    ```bash [yarn]
    yarn hardhat run scripts/interop-asset-transfer.ts
    ```

    ```bash [pnpm]
    pnpm hardhat run scripts/interop-asset-transfer.ts
    ```

    ```bash [bun]
    bun hardhat run scripts/interop-asset-transfer.ts
    ```

    ::

This script deploys the token on L1, bridges it to chain `6565`, and then transfers it to chain `6566` with interop.

## Path 2: Deploy the token on L2

8. Create a new file in the `scripts` folder called `interop-asset-transfer.ts`. <!-- markdownlint-disable-line -->

    ```bash
    touch scripts/interop-asset-transfer.ts
    ```

9. Create a new file in the `ignition/modules` folder called `InteropToken.ts`. <!-- markdownlint-disable-line -->

    ```bash
    touch ignition/modules/InteropToken.ts
    ```

10. Copy and paste the Ignition module below into `InteropToken.ts`. <!-- markdownlint-disable-line -->

    ```ts
    :code-import{filePath="local-zksync-os/ignition/modules/InteropToken.ts"}
    ```

11. Compile and deploy the token contract on chain `6565`. <!-- markdownlint-disable-line -->

    :display_partial{path="_partials/commands/_hh_compile"}

    ::code-group

    ```bash [npm]
    npx hardhat ignition deploy ignition/modules/InteropToken.ts --network localZKsyncOSChain1
    ```

    ```bash [yarn]
    yarn hardhat ignition deploy ignition/modules/InteropToken.ts --network localZKsyncOSChain1
    ```

    ```bash [pnpm]
    pnpm hardhat ignition deploy ignition/modules/InteropToken.ts --network localZKsyncOSChain1
    ```

    ```bash [bun]
    bun hardhat ignition deploy ignition/modules/InteropToken.ts --network localZKsyncOSChain1
    ```

    ::

12. Save the deployed token address as an environment variable. <!-- markdownlint-disable-line -->

    ```bash
    export INTEROP_TOKEN_ADDRESS=0x...
    ```

13. Migrate the token balance to Gateway before using interop. <!-- markdownlint-disable-line -->

    The example helper for that flow is:

    ::drop-panel

    ::panel{label="interop-asset-migration-ethers.ts"}

    ```ts
    :code-import{filePath="local-zksync-os/scripts/interop-asset-migration-ethers.ts"}
    ```

    ::

    ::

14. Copy and paste the script below into the `interop-asset-transfer.ts` file. <!-- markdownlint-disable-line -->

    ::drop-panel

    ::panel{label="interop-asset-transfer.ts"}

    ```ts
    :code-import{filePath="local-zksync-os/scripts/interop-asset-transfer-ethers.ts"}
    ```

    ::

    ::

:display_partial{path="_partials/_zksyncos/_run-script-interop-asset"}
