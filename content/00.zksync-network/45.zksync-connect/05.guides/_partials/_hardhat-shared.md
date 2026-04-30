---
title: Hardhat shared
---

3. Install the `zksync-js` npm package: <!-- markdownlint-disable-line -->

    :display_partial{path="_partials/_zksyncos/_install-zksync-js"}

4. Configure the `hardhat.config.ts` file with the three local chains setup in the [local setup](/zksync-network/zksync-connect/guides/local-setup) <!-- markdownlint-disable-line -->
    and a rich wallet,
    and the set the ignition required confirmations to 1.

    ```ts
    :code-import{filePath="local-zksync-os/hardhat.config.ts:networks"}
    ```

5. Create a new file in the `contracts` folder called `InteropCounter.sol`: <!-- markdownlint-disable-line -->

    ```bash
    touch contracts/InteropCounter.sol
    ```

6. Copy and paste the contract below into the `InteropCounter.sol` file. <!-- markdownlint-disable-line -->

    ```solidity
    :code-import{filePath="local-zksync-os/contracts/InteropCounter.sol"}
    ```

7. Create a new script in the `scripts` folder called `interop-counter.ts`. <!-- markdownlint-disable-line -->

    ```bash
    touch scripts/interop-counter.ts
    ```
