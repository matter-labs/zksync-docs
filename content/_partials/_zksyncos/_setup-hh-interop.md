---
title: Hardhat 3 Setup For Local Interop
---

3. Add the local networks to the `hardhat.config.ts` file and configure the ignition required confirmations. <!-- markdownlint-disable-line -->
    You can use the private key in the config below to use a pre-configured rich wallet that already has funds on each network.

    ```ts [hardhat.config.ts]
     :code-import{filePath="local-zksync-os/hardhat.config.ts:networks"}
    ```

4. Make a new file in the contracts folder called `InteropCounter.sol`. <!-- markdownlint-disable-line -->

    ```bash
    touch contracts/InteropCounter.sol
    ```

5. Copy and paste the contract below into `InteropCounter.sol`. <!-- markdownlint-disable-line -->

    ```ts [hardhat.config.ts]
     :code-import{filePath="local-zksync-os/contracts/InteropCounter.sol"}
    ```

6. Create a new script file in the `scripts` folder called `interop-counter.ts`. <!-- markdownlint-disable-line -->

    ```bash
    touch scripts/interop-counter.ts
    ```
