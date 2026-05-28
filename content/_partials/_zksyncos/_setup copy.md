---
title: Hardhat 3 Setup
---

3. Add ZKsync OS to the `hardhat.config.ts` file and configure the ignition required confirmations. <!-- markdownlint-disable-line -->

    ```ts [hardhat.config.ts]
     :code-import{filePath="zksync-os/hardhat.config.ts:hh-config"}
    ```

4. Add your private key to the keystore as `TESTNET_PRIVATE_KEY`. <!-- markdownlint-disable-line -->

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

5. Compile and deploy the example contract. <!-- markdownlint-disable-line -->

    :display_partial{path="_partials/commands/_hh_compile"}

    ::code-group

    ```bash [npm]
    npx hardhat ignition deploy ignition/modules/Counter.ts --network zksyncOS
    ```

    ```bash [yarn]
    yarn hardhat ignition deploy ignition/modules/Counter.ts --network zksyncOS
    ```

    ```bash [pnpm]
    pnpm hardhat ignition deploy ignition/modules/Counter.ts --network zksyncOS
    ```

    ```bash [bun]
    bun hardhat ignition deploy ignition/modules/Counter.ts --network zksyncOS
    ```

    ::

6. Create a new script file in the `scripts` folder called `increment.ts`. <!-- markdownlint-disable-line -->

    ```bash
    touch scripts/increment.ts
    ```
