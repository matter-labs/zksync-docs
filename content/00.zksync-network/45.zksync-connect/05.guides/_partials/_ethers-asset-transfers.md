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

:display_partial{path="/zksync-network/zksync-connect/guides/_partials/_asset-transfers-shared"}

13. Copy and paste the Gateway migration script below into `scripts/interop-asset-migration.ts`. <!-- markdownlint-disable-line -->

    The example helper for that flow is:

    ::drop-panel

    ::panel{label="interop-asset-migration.ts"}

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
