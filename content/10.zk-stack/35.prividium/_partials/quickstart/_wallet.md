---
title: Quickstart - Wallet
description: Funding a wallet
---

Because you chose to use a local reth node for your L1 and selected ETH as the base asset,
you have access to several rich wallets on the L1 that you can use to bridge ETH to `prividium_chain`.

You can find a full list of rich wallet addresses and their private keys in the [ZKsync docs](../../../../zksync-network/tooling/local-setup/anvil-zksync-node.md#pre-configured-rich-wallets).

::callout{icon="i-heroicons-exclamation-triangle" color="amber"}
Never use these wallets in production or send real funds to them.
::

Open a new terminal and run the command below to bridge some ETH to `prividium_chain`.
This command will bridge 1 ETH to `0x36615cf349d7f6344891b1e7ca7c72883f5dc049`.

:test-action{actionId="deposit-eth"}

```bash
zkstack dev rich-account --chain prividium_chain
```
