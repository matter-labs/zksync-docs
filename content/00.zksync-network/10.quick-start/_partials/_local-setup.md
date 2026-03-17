---
title: Quickstart - Local Node Setup
---

## Starting a local node

To start a local node, you will need to have `anvil` installed on your machine.

You can install `anvil` via `foundryup` by following the [installation instructions](https://www.getfoundry.sh/introduction/installation)
in the `foundry` docs.

::callout{icon="i-heroicons-light-bulb"}
If you've used ZKsync in the past, you may remember having to use special tooling to run a local node.
Since the Atlas upgrade, however, you can now use any standard EVM local node for testing.
The only time you may need a ZKsync-specific node is to test bridging or crosschain transactions.
For this tutorial, we won't need one.
::

Once installed, open a new terminal and run the command below to start a local node:

```bash
anvil
```

You should see some information logged about the local network running on your machine,
including the port where the node is running (`8545`),
the chain ID (`31337`),
and 10 different test wallet addresses and their private keys.
These wallets are all pre-funded with ETH so you don't need to worry about adding funds.

Keep the node running until you are done with this tutorial.

Note that this is an _in-memory_ node,
meaning that if you stop it at any time,
any contracts you deployed or transactions you sent will be lost.
