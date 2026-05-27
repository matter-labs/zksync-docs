---
title: Foundry
---

1. Create a new Foundry project.

    ```bash
    forge init InteropAssetTransfer
    ```

1. Change into the project directory.

    ```bash
    cd InteropAssetTransfer
    ```

1. Install OpenZeppelin Contracts.

    :display_partial{path="/zksync-network/quick-start/_partials/foundry/_foundry-install-openzeppelin"}

1. Create the contract and scripts used in this guide.

    ```bash
    touch src/InteropToken.sol
    touch script/InteropAssetTransferSendBundle.s.sol
    touch script/InteropAssetTransferFinalizeBundle.s.sol
    touch script/get-proof-encoded.sh
    ```

1. Copy the token contract below into `src/InteropToken.sol`.

    This is a standard ERC20 token contract
    that mints an initial supply to the deployer and exposes an owner-only `mint` function for local testing.

    ```solidity
    :code-import{filePath="zksync-os-foundry/src/InteropToken.sol"}
    ```

1. Copy the bundle sender below into `script/InteropAssetTransferSendBundle.s.sol`.

    It registers the token as an interoperable asset,
    and sends an interop bundle transferring the token from chain `6565` to chain `6566`.

    ::drop-panel

    ::panel{label="InteropAssetTransferSendBundle.s.sol"}

    ```solidity
    :code-import{filePath="zksync-os-foundry/script/InteropAssetTransferSendBundle.s.sol"}
    ```

    ::

    ::

1. Copy the bundle finalizer below into `script/InteropAssetTransferFinalizeBundle.s.sol`.

    This script runs on chain `6566`.
    It decodes the inclusion proof, executes the bundle through the `InteropHandler`,
    resolves the mapped token on the destination chain,
    and prints the source and destination balances after finalization.

    ::drop-panel

    ::panel{label="InteropAssetTransferFinalizeBundle.s.sol"}

    ```solidity
    :code-import{filePath="zksync-os-foundry/script/InteropAssetTransferFinalizeBundle.s.sol"}
    ```

    ::

    ::

1. Copy the proof helper below into `script/get-proof-encoded.sh`.

    This helper script fetches the L2-to-L1 proof data for the asset transfer bundle
    and ABI-encodes it into the format expected by the Foundry finalizer script.

    ::drop-panel

    ::panel{label="get-proof-encoded.sh"}

    ```bash
    :code-import{filePath="zksync-os-foundry/script/get-proof-encoded.sh"}
    ```

    ::

    ::

1. Make the proof helper executable.

    ```bash
    chmod +x script/get-proof-encoded.sh
    ```

1. Build the project.

    ```bash
    forge build
    ```

1. Set the local private key used by the scripts.

    ```bash
    export LOCAL_PRIVATE_KEY="0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110"
    ```

## Path 1: Deploy the token on L1

1. Create the L1 deployment and bridge script.

    ```bash
    touch script/InteropAssetTransferFromL1.s.sol
    ```

1. Copy the script below into `script/InteropAssetTransferFromL1.s.sol`.

    This script deploys the ERC20 on L1
    and deposits the token into chain `6565`.

    ::drop-panel

    ::panel{label="InteropAssetTransferFromL1.s.sol"}

    ```solidity
    :code-import{filePath="zksync-os-foundry/script/InteropAssetTransferFromL1.s.sol"}
    ```

    ::

    ::

1. Deploy the ERC20 on the L1 and deposit the tokens to chain `6565`.

    ```bash
    forge script script/InteropAssetTransferFromL1.s.sol:InteropAssetTransferFromL1 \
      --rpc-url http://localhost:8545 \
      --broadcast \
      --skip-simulation \
      --private-key "$LOCAL_PRIVATE_KEY"
    ```

1. After the deposit finalizes on chain `6565`, check the balance of the bridged token.

    Replace `<L2_TOKEN_ADDRESS>` with the predicted bridged token address output from the script.

    ```bash
    cast call <L2_TOKEN_ADDRESS> "balanceOf(address)(uint256)" 0x36615Cf349d7F6344891B1e7CA7C72883F5dc049 \
      --rpc-url http://localhost:3050
    ```

1. After the deposit finalizes on chain `6565`, send the bridged token from chain `6565` to chain `6566`.

    ```bash
    forge script script/InteropAssetTransferSendBundle.s.sol:InteropAssetTransferSendBundle \
      --sig "run(address)" <L2_TOKEN_ADDRESS> \
      --rpc-url http://localhost:3050 \
      --broadcast \
      --skip-simulation \
      --private-key "$LOCAL_PRIVATE_KEY"
    ```

1. Generate the inclusion proof from the send transaction hash.

    Replace `<SEND_TX_HASH>` with the last L2 transaction hash output from the script.
    This is the `sendBundle(...)` transaction hash, not the earlier `approve(...)`
    or `ensureTokenIsRegistered(...)` transaction hashes.

    ```bash
    PROOF_ENCODED_HEX=$(./script/get-proof-encoded.sh <SEND_TX_HASH> http://localhost:3050)
    ```

1. Finalize the bundle on chain `6566`.

    ```bash
    forge script script/InteropAssetTransferFinalizeBundle.s.sol:InteropAssetTransferFinalizeBundle \
      --sig "run(address,bytes)" <L2_TOKEN_ADDRESS> $PROOF_ENCODED_HEX \
      --rpc-url http://localhost:3051 \
      --broadcast \
      --skip-simulation \
      --private-key "$LOCAL_PRIVATE_KEY"
    ```

## Path 2: Deploy the token on L2

1. Create the L2 deployment helper.

    ```bash
    touch script/InteropAssetTransferDeployToken.s.sol
    ```

1. Copy the deployment helper below into `script/InteropAssetTransferDeployToken.s.sol`.

    This script deploys the ERC20 on chain `6565`
    and prints the deployed token address for the later migration and interop steps.

    ```solidity
    :code-import{filePath="zksync-os-foundry/script/InteropAssetTransferDeployToken.s.sol"}
    ```

1. Create the Gateway migration helpers.

    ```bash
    touch script/InteropAssetMigration.s.sol
    touch script/get-migration-finalize-params.sh
    ```

1. Copy the Gateway migration script below into `InteropAssetMigration.s.sol`.

    This single script handles the full Gateway migration flow through different entrypoints:
    `run(address)` starts the migration on chain `6565`,
    `run(bytes)` finalizes the migration on L1,
    and `status(address)` checks whether the token is marked as migrated on chain `6565`.

    ::drop-panel

    ::panel{label="InteropAssetMigration.s.sol"}

    ```solidity
    :code-import{filePath="zksync-os-foundry/script/InteropAssetMigration.s.sol"}
    ```

1. Copy the migration proof helper below into `get-migration-finalize-params.sh`.

    This helper fetches the L2-to-L1 proof for the migration initiation transaction
    and ABI-encodes the finalize params expected by the L1 migration script.

    ::drop-panel

    ::panel{label="get-migration-finalize-params.sh"}

    ```bash
    :code-import{filePath="zksync-os-foundry/script/get-migration-finalize-params.sh"}
    ```

    ::

    ::

1. Make the migration proof helper executable.

    ```bash
    chmod +x script/get-migration-finalize-params.sh
    ```

1. Deploy the ERC20 on chain `6565`.

    ```bash
    forge script script/InteropAssetTransferDeployToken.s.sol:InteropAssetTransferDeployToken \
      --rpc-url http://localhost:3050 \
      --broadcast \
      --skip-simulation \
      --private-key "$LOCAL_PRIVATE_KEY"
    ```

1. Save the deployed token address as an environment variable.

    ```bash
    export INTEROP_TOKEN_ADDRESS=0x...
    ```

1. Start the Gateway migration on chain `6565`.

    ```bash
    forge script script/InteropAssetMigration.s.sol \
      --target-contract InteropAssetMigration \
      --sig "run(address)" $INTEROP_TOKEN_ADDRESS \
      --rpc-url http://localhost:3050 \
      --broadcast \
      --skip-simulation \
      --private-key "$LOCAL_PRIVATE_KEY"
    ```

1. Generate the encoded finalize params from the migration initiation transaction hash.

    Replace `<MIGRATION_TX_HASH>` with the last chain `6565` transaction hash from the migration initiation script output.

    ```bash
    MIGRATION_FINALIZE_PARAMS=$(./script/get-migration-finalize-params.sh <MIGRATION_TX_HASH> http://localhost:3050)
    ```

1. Finalize the migration on L1.

    ```bash
    forge script script/InteropAssetMigration.s.sol \
      --target-contract InteropAssetMigration \
      --sig "run(bytes)" $MIGRATION_FINALIZE_PARAMS \
      --rpc-url http://localhost:8545 \
      --broadcast \
      --skip-simulation \
      --private-key "$LOCAL_PRIVATE_KEY"
    ```

1. Check the migration status on chain `6565`.
    It may take a minute for the `migrated` status to update to `true`.

    ```bash
    forge script script/InteropAssetMigration.s.sol \
      --target-contract InteropAssetMigration \
      --sig "status(address)" $INTEROP_TOKEN_ADDRESS \
      --rpc-url http://localhost:3050
    ```

1. After the status script reports `Migrated: true`, send part of that balance from chain `6565` to chain `6566`.

    ```bash
    forge script script/InteropAssetTransferSendBundle.s.sol:InteropAssetTransferSendBundle \
      --sig "run(address)" $INTEROP_TOKEN_ADDRESS \
      --rpc-url http://localhost:3050 \
      --broadcast \
      --skip-simulation \
      --private-key "$LOCAL_PRIVATE_KEY"
    ```

1. Generate the inclusion proof from the send transaction hash.

    Use the last L2 transaction hash from the `forge script` broadcast on chain `6565`.
    This is the `sendBundle(...)` transaction hash, not the earlier `approve(...)`
    or `ensureTokenIsRegistered(...)` transaction hashes.
    Do not use the printed `bundleHash` or `assetId`.
    You can find the transaction hash in the `broadcast/InteropAssetTransferSendBundle.s.sol/6565/run-latest.json` file.

    ```bash
    PROOF_ENCODED_HEX=$(./script/get-proof-encoded.sh <SEND_TX_HASH> http://localhost:3050)
    ```

1. Finalize the bundle on chain `6566`.

    ```bash
    forge script script/InteropAssetTransferFinalizeBundle.s.sol:InteropAssetTransferFinalizeBundle \
      --sig "run(address,bytes)" $INTEROP_TOKEN_ADDRESS $PROOF_ENCODED_HEX \
      --rpc-url http://localhost:3051 \
      --broadcast \
      --skip-simulation \
      --private-key "$LOCAL_PRIVATE_KEY"
    ```
