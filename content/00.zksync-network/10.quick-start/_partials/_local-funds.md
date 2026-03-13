---
title: Quickstart - Local Funds
---

8. Add your local node to your browser wallet.  <!-- markdownlint-disable-line -->
    Depending on what browser wallet you are using, the steps for this may be different.

    For Metamask, click on the top right menu bars, select "Networks", and then click on "Add a Custom Network".
    Enter the name "Anvil", `http://localhost:8545` as the RPC URL, `31337` for the chain ID, and ETH as the currency symbol.

9.  Next, either import one of the rich wallets from `anvil` to your browser wallet using one of the private keys logged when starting the node, or use the command below to send some test funds to your wallet.<!-- markdownlint-disable-line -->
  The `cast` CLI should already be installed through `foundryup`.

    ```bash
    cast send <0x_YOUR_WALLET_ADDRESS> --value 1ether --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --rpc-url http://localhost:8545
    ```
