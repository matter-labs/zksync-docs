---
title: Quickstart - Wallet
description: Funding a wallet
---

Because you chose to use a local reth node for your L1 and selected ETH as the base asset,
you have access to several rich wallets on the L1 that you can use to bridge ETH to `prividium_chain`.

You can find a full list of rich wallet addresses and their private keys in the [ZKsync docs](https://docs.zksync.io/build/test-and-debug/in-memory-node#pre-configured-rich-wallets).

::callout{icon="i-heroicons-exclamation-triangle" color="amber"}
Never use these wallets in production or send real funds to them.
::

Open a new terminal and run the command below to bridge some ETH to `prividium_chain` using ZKsync CLI:

:test-action{actionId="deposit-eth"}

```bash
npx zksync-cli bridge deposit --rpc=http://localhost:3050 --l1-rpc=http://localhost:8545
```

For testing purposes, we'll use one of the rich wallets as both the sender and recipient:

```shell
? Amount to deposit 10
? Private key of the sender 0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110
? Recipient address on L2 0x36615Cf349d7F6344891B1e7CA7C72883F5dc049
```

To see that it worked, let's check the balance of that address on `prividium_chain`:

:test-action{actionId="check-balance"}

```bash
npx zksync-cli wallet balance \
--address 0x36615Cf349d7F6344891B1e7CA7C72883F5dc049 \
--rpc http://localhost:3050
```

Now this address has ETH available on `prividium_chain` to use for testing.
