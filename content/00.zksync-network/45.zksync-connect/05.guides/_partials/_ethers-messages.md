---
title: Hardhat 3 with Ethers
---

:display_partial{path="_partials/_zksyncos/_setup-folder"}

1. Initialize a new Hardhat 3 project with Mocha and Ethers.js. <!-- markdownlint-disable-line -->

    ```bash
    npx hardhat --init
    ```

1. Install the `zksync-js` npm package. <!-- markdownlint-disable-line -->

    :display_partial{path="_partials/_zksyncos/_install-zksync-js"}

1. Configure `hardhat.config.ts` with the local chains from the [local setup guide](/zksync-network/zksync-connect/guides/local-setup). <!-- markdownlint-disable-line -->

    ```ts
    :code-import{filePath="local-zksync-os/hardhat.config.ts:networks"}
    ```

## Sending a message

1. Create a sender contract in `contracts/InteropSendMessage.sol`.

    ```bash
    touch contracts/InteropSendMessage.sol
    ```

1. Copy and paste the contract below into `contracts/InteropSendMessage.sol`.

    ```solidity
    :code-import{filePath="local-zksync-os/contracts/InteropSendMessage.sol"}
    ```

1. Create a script in `scripts/interop-send-message.ts`.

    ```bash
    touch scripts/interop-send-message.ts
    ```

1. Copy and paste the script below into `scripts/interop-send-message.ts`.

    ```ts
    :code-import{filePath="local-zksync-os/scripts/interop-send-message.ts"}
    ```

1. Run the script and save the transaction hash from the output. <!-- markdownlint-disable-line -->

    ::code-group

    ```bash [npm]
    npx hardhat run scripts/interop-send-message.ts
    ```

    ```bash [yarn]
    yarn hardhat run scripts/interop-send-message.ts
    ```

    ```bash [pnpm]
    pnpm hardhat run scripts/interop-send-message.ts
    ```

    ```bash [bun]
    bun hardhat run scripts/interop-send-message.ts
    ```

    ::

1. Export the transaction hash once so the rest of the scripts can read it from `process.env.MESSAGE_TX_HASH`.

    ```bash
    export MESSAGE_TX_HASH="0x..."
    ```

## Checking that the proof is ready

1. Create a script in `scripts/interop-check-status.ts`.

    ```bash
    touch scripts/interop-check-status.ts
    ```

1. Copy and paste the script below into `scripts/interop-check-status.ts`.

    ```ts
    :code-import{filePath="local-zksync-os/scripts/interop-check-status.ts"}
    ```

1. Run the script to wait for the proof. <!-- markdownlint-disable-line -->

    ::code-group

    ```bash [npm]
    npx hardhat run scripts/interop-check-status.ts
    ```

    ```bash [yarn]
    yarn hardhat run scripts/interop-check-status.ts
    ```

    ```bash [pnpm]
    pnpm hardhat run scripts/interop-check-status.ts
    ```

    ```bash [bun]
    bun hardhat run scripts/interop-check-status.ts
    ```

    ::

## Checking if the interop root is updated

1. Create a script in `scripts/interop-check-interop-root.ts`.

    ```bash
    touch scripts/interop-check-interop-root.ts
    ```

1. Copy and paste the script below into `scripts/interop-check-interop-root.ts`.

    ```ts
    :code-import{filePath="local-zksync-os/scripts/interop-check-interop-root.ts"}
    ```

1. Run the script to wait for the interop root on chain `6566`. <!-- markdownlint-disable-line -->

    ::code-group

    ```bash [npm]
    npx hardhat run scripts/interop-check-interop-root.ts
    ```

    ```bash [yarn]
    yarn hardhat run scripts/interop-check-interop-root.ts
    ```

    ```bash [pnpm]
    pnpm hardhat run scripts/interop-check-interop-root.ts
    ```

    ```bash [bun]
    bun hardhat run scripts/interop-check-interop-root.ts
    ```

    ::

## Verifying a message

1. Create a script in `scripts/interop-verify-message.ts`.

    ```bash
    touch scripts/interop-verify-message.ts
    ```

1. Copy and paste the script below into `scripts/interop-verify-message.ts`.

    ```ts
    :code-import{filePath="local-zksync-os/scripts/interop-verify-message.ts"}
    ```

1. Run the script to verify the message directly on chain `6566`. <!-- markdownlint-disable-line -->

    ::code-group

    ```bash [npm]
    npx hardhat run scripts/interop-verify-message.ts
    ```

    ```bash [yarn]
    yarn hardhat run scripts/interop-verify-message.ts
    ```

    ```bash [pnpm]
    pnpm hardhat run scripts/interop-verify-message.ts
    ```

    ```bash [bun]
    bun hardhat run scripts/interop-verify-message.ts
    ```

    ::

## Verifying onchain

1. Create a wrapper contract in `contracts/InteropVerification.sol`.

    ```bash
    touch contracts/InteropVerification.sol
    ```

1. Copy and paste the contract below into `contracts/InteropVerification.sol`.

    ```solidity
    :code-import{filePath="local-zksync-os/contracts/InteropVerification.sol"}
    ```

1. Create a script in `scripts/interop-get-verification-args-local.ts`.

    ```bash
    touch scripts/interop-get-verification-args-local.ts
    ```

1. Copy and paste the script below into `scripts/interop-get-verification-args-local.ts`.

    ```ts
    :code-import{filePath="local-zksync-os/scripts/interop-get-verification-args-local.ts"}
    ```

1. Run the script to inspect the verification arguments. <!-- markdownlint-disable-line -->

    ::code-group

    ```bash [npm]
    npx hardhat run scripts/interop-get-verification-args-local.ts
    ```

    ```bash [yarn]
    yarn hardhat run scripts/interop-get-verification-args-local.ts
    ```

    ```bash [pnpm]
    pnpm hardhat run scripts/interop-get-verification-args-local.ts
    ```

    ```bash [bun]
    bun hardhat run scripts/interop-get-verification-args-local.ts
    ```

    ::

1. Create a script in `scripts/interop-test-onchain-verification.ts`.

    ```bash
    touch scripts/interop-test-onchain-verification.ts
    ```

1. Copy and paste the script below into `scripts/interop-test-onchain-verification.ts`.

    ```ts
    :code-import{filePath="local-zksync-os/scripts/interop-test-onchain-verification.ts"}
    ```

1. Run the script to verify the message through your wrapper contract. <!-- markdownlint-disable-line -->

    ::code-group

    ```bash [npm]
    npx hardhat run scripts/interop-test-onchain-verification.ts
    ```

    ```bash [yarn]
    yarn hardhat run scripts/interop-test-onchain-verification.ts
    ```

    ```bash [pnpm]
    pnpm hardhat run scripts/interop-test-onchain-verification.ts
    ```

    ```bash [bun]
    bun hardhat run scripts/interop-test-onchain-verification.ts
    ```

    ::
