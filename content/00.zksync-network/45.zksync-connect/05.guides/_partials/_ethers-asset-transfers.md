---
title: Hardhat 3 with Ethers
---

:display_partial{path="_partials/_zksyncos/_setup-folder"}

2. Initialize a new Hardhat 3 project with Mocha and Ethers.js. <!-- markdownlint-disable-line -->

    ```bash
    npx hardhat --init
    ```

:display_partial{path="/zksync-network/zksync-connect/guides/_partials/_hardhat-shared-asset-transfers"}

13. Copy and paste the script below into the `interop-asset-transfer.ts` file. <!-- markdownlint-disable-line -->

    ```ts
    :code-import{filePath="local-zksync-os/scripts/interop-asset-transfer-ethers.ts"}
    ```

:display_partial{path="_partials/_zksyncos/_run-script-interop-asset"}
