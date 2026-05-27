---
title: Hardhat L2 Migration shared
---

8. Create two new files in the `scripts` folder called `interop-asset-transfer.ts` and `interop-asset-migration.ts`. <!-- markdownlint-disable-line -->

    
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
