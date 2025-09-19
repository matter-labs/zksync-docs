---
title: Hardhat 3 with Ethers
---

:display_partial{path="_partials/_zksyncos/_setup-folder"}

2. Initialize a new Hardhat 3 project with Mocha and Ethers.js. <!-- markdownlint-disable-line -->

    ```bash
    npx hardhat --init
    ```

:display_partial{path="_partials/_zksyncos/_setup"}

7. Copy/paste the script below. <!-- markdownlint-disable-line -->

    ```ts [increment.ts]
    :code-import{filePath="zksync-os/scripts/increment-ethers.ts"}
    ```

:display_partial{path="_partials/_zksyncos/_run-script"}
