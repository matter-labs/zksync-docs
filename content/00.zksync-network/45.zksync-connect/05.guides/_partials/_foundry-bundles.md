---
title: Foundry
---

1. Create a new Foundry project.

    ```bash
    forge init Interop
    ```

    ```bash
    cd Interop
    ```

1. Create a new file in the `src` folder called `InteropCounter.sol`.

    ```bash
    touch src/InteropCounter.sol
    ```

1. Copy and paste the contract below into `InteropCounter.sol`.

    ```solidity
    :code-import{filePath="zksync-os-foundry/src/InteropCounter.sol"}
    ```

1. Build the project.

    ```bash
    forge build
    ```

1. Create a new script in the `script` folder called `InteropCounterDeployAndSendBundle.s.sol`.
    We will use this script to deploy the contract and send a transaction bundle to increment the counter.

    ```bash
    touch script/InteropCounterDeployAndSendBundle.s.sol
    ```

1. Copy and paste the script below into `InteropCounterDeployAndSendBundle.s.sol`.

    ```solidity
    :code-import{filePath="zksync-os-foundry/script/InteropCounterDeployAndSendBundle.s.sol"}
    ```

1. Create a new script in the `script` folder called `InteropCounterFinalizeBundle.s.sol`.
    We will use this script to finalize the bundle on the destination chain.

    ```bash
    touch script/InteropCounterFinalizeBundle.s.sol
    ```

1. Copy and paste the script below into `InteropCounterFinalizeBundle.s.sol`.

    ```solidity
    :code-import{filePath="zksync-os-foundry/script/InteropCounterFinalizeBundle.s.sol"}
    ```

1. Create a helper script called `get-proof-encoded.sh`.
    This script will be used to fetch the proof for the bundle, which is needed for finalization.

    ```bash
    touch script/get-proof-encoded.sh
    ```

1. Copy and paste the script below into `script/get-proof-encoded.sh`.

    ```bash
    :code-import{filePath="zksync-os-foundry/script/get-proof-encoded.sh"}
    ```

1. Make the helper script executable.

    ```bash
    chmod +x script/get-proof-encoded.sh
    ```

1. Set your private key for deploying.
    The private key used below should already be pre-funded if you followed the full [local setup guide](/zksync-network/zksync-connect/guides/local-setup).

    ```bash
    export LOCAL_PRIVATE_KEY="0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110"
    ```

1. Run the deploy and send bundle script to deploy the contract on chain `6566` and send the bundle from chain `6565`.
  Save the deployed contract address from the output.

    ```bash
    forge script script/InteropCounterDeployAndSendBundle.s.sol:InteropCounterDeployAndSendBundle \
      --rpc-url http://localhost:3050 \
      --broadcast \
      --skip-simulation \
      --gas-estimate-multiplier 1000 \
      --private-key $LOCAL_PRIVATE_KEY
    ```

1. Generate the encoded proof.
  By default, the helper script reads the latest `sendBundle` transaction hash
  from Foundry's
  `broadcast/multi/InteropCounterDeployAndSendBundle.s.sol-latest/run.json` file.

    ```bash
    PROOF_ENCODED_HEX="$(./script/get-proof-encoded.sh)"
    ```

    If needed, you can pass the bundle send transaction hash explicitly.
    This hash is the last hash output from the deploy and send script, under `### 6565`

    ```bash
    PROOF_ENCODED_HEX="$(./script/get-proof-encoded.sh <BUNDLE_SEND_TX_HASH> http://localhost:3050)"
    ```

1. Finalize the bundle on chain `6566`. Replace `<DEPLOYED_CONTRACT_ADDRESS>` with your deployed contract address.

    ```bash
    forge script script/InteropCounterFinalizeBundle.s.sol:InteropCounterFinalizeBundle \
      --sig "run(address,bytes)" <DEPLOYED_CONTRACT_ADDRESS> $PROOF_ENCODED_HEX \
      --rpc-url http://localhost:3051 \
      --broadcast \
      --skip-simulation \
      --gas-estimate-multiplier 1000 \
      --private-key $LOCAL_PRIVATE_KEY
    ```

You should see `finalCounterValue: uint256 2` is output, confirming that the counter contract was incremented from the transaction bundle.
