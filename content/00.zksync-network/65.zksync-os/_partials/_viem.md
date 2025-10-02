---
title: Hardhat 3 with Viem
---

:display_partial{path="_partials/_zksyncos/_setup-folder"}

2. Initialize a new Hardhat 3 project with Node Test Runner and Viem. <!-- markdownlint-disable-line -->

    ```bash
    npx hardhat --init
    ```

:display_partial{path="_partials/_zksyncos/_setup"}

7. Copy/paste the script below. <!-- markdownlint-disable-line -->

    ```ts [increment.ts]
    :code-import{filePath="zksync-os/scripts/increment-viem.ts"}
    ```

:display_partial{path="_partials/_zksyncos/_run-script"}
