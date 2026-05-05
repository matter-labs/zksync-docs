---
title: Foundry
---

1. Create a new Foundry project.

    ```bash
    forge init interop-messages
    cd interop-messages
    ```

## Sending a message

1. Create `contracts/InteropSendMessage.sol`.

    ```bash
    touch contracts/InteropSendMessage.sol
    ```

1. Copy and paste the contract below into `contracts/InteropSendMessage.sol`.

    ```solidity
    :code-import{filePath="local-interop-foundry/contracts/InteropSendMessage.sol"}
    ```

1. Build the project.

    ```bash
    forge build
    ```

1. Set a funded local private key.

    ```bash
    export LOCAL_PRIVATE_KEY="0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110"
    ```

1. Deploy the sender contract on chain `6565`.
    Save the deployed contract address from the command output.

    ```bash
    forge create contracts/InteropSendMessage.sol:InteropSendMessage \
      --rpc-url http://localhost:3050 \
      --private-key $LOCAL_PRIVATE_KEY
    ```

1. Send a message through the deployed sender contract.
    Save the transaction hash from the output.

    ```bash
    cast send <SENDER_CONTRACT_ADDRESS> \
      "sendMessage(bytes)" \
      "$(cast --from-utf8 'Hello from chain 6565')" \
      --rpc-url http://localhost:3050 \
      --private-key $LOCAL_PRIVATE_KEY
    ```

## Checking that the proof is ready

1. Create a helper script to fetch the message proof and verification arguments.

    ```bash
    mkdir -p script
    touch script/get-message-verification-args.sh
    ```

1. Copy and paste the script below into `script/get-message-verification-args.sh`.

    ```bash
    :code-import{filePath="local-interop-foundry/script/get-message-verification-args.sh"}
    ```

1. Make the helper script executable.

    ```bash
    chmod +x script/get-message-verification-args.sh
    ```

1. Load the verification arguments into your shell.

    ```bash
    eval "$(./script/get-message-verification-args.sh <MESSAGE_TX_HASH>)"
    ```

## Checking if the interop root is updated

1. Create a helper script that waits for the destination chain to import the interop root.

    ```bash
    touch script/wait-for-message-root.sh
    ```

1. Copy and paste the script below into `script/wait-for-message-root.sh`.

    ```bash
    :code-import{filePath="local-interop-foundry/script/wait-for-message-root.sh"}
    ```

1. Make the helper script executable.

    ```bash
    chmod +x script/wait-for-message-root.sh
    ```

1. Wait for the root on chain `6566`.

    ```bash
    eval "$(./script/wait-for-message-root.sh $GATEWAY_BLOCK_NUMBER)"
    ```

## Verifying a message

1. Verify the message directly against the system contract on chain `6566`.

    ```bash
    cast call 0x0000000000000000000000000000000000010009 \
      "proveL2MessageInclusionShared(uint256,uint256,uint256,(uint16,address,bytes),bytes32[])(bool)" \
      $SRC_CHAIN_ID \
      $L1_BATCH_NUMBER \
      $L2_MESSAGE_INDEX \
      "($TX_NUMBER_IN_BATCH,$MESSAGE_SENDER,$MESSAGE_DATA)" \
      "$MESSAGE_PROOF_ARRAY" \
      --rpc-url http://localhost:3051
    ```

## Verifying onchain

1. Create `contracts/InteropVerification.sol`.

    ```bash
    touch contracts/InteropVerification.sol
    ```

1. Copy and paste the contract below into `contracts/InteropVerification.sol`.

    ```solidity
    :code-import{filePath="local-interop-foundry/contracts/InteropVerification.sol"}
    ```

1. Deploy the wrapper contract on chain `6566`.
    Save the deployed contract address from the command output.

    ```bash
    forge create contracts/InteropVerification.sol:InteropVerification \
      --rpc-url http://localhost:3051 \
      --private-key $LOCAL_PRIVATE_KEY
    ```

1. Call the wrapper contract with the same verification arguments.

    ```bash
    cast call <VERIFIER_CONTRACT_ADDRESS> \
      "checkVerification(uint256,uint256,uint256,(uint16,address,bytes),bytes32[])(bool)" \
      $SRC_CHAIN_ID \
      $L1_BATCH_NUMBER \
      $L2_MESSAGE_INDEX \
      "($TX_NUMBER_IN_BATCH,$MESSAGE_SENDER,$MESSAGE_DATA)" \
      "$MESSAGE_PROOF_ARRAY" \
      --rpc-url http://localhost:3051
    ```
