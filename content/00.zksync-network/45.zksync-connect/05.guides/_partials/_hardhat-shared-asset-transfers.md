---
title: Hardhat shared asset transfers
---

3. Install the `zksync-js` npm package. <!-- markdownlint-disable-line -->

    :display_partial{path="_partials/_zksyncos/_install-zksync-js"}

4. Install OpenZeppelin Contracts. <!-- markdownlint-disable-line -->

    :display_partial{path="/zksync-network/quick-start/_partials/hardhat/_hardhat-install-openzeppelin"}

5. Configure the `hardhat.config.ts` file with the three local chains setup in the [local setup](/zksync-network/zksync-connect/guides/local-setup), <!-- markdownlint-disable-line -->
    a rich wallet, and `ignition.requiredConfirmations` set to `1`.

    ```ts
    :code-import{filePath="local-zksync-os/hardhat.config.ts:networks"}
    ```

6. Create a new file in the `contracts` folder called `InteropToken.sol`. <!-- markdownlint-disable-line -->

    ```bash
    touch contracts/InteropToken.sol
    ```

7. Copy and paste the contract below into the `InteropToken.sol` file. <!-- markdownlint-disable-line -->

    ```solidity
    :code-import{filePath="local-zksync-os/contracts/InteropToken.sol"}
    ```

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
