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
