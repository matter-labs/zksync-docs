---
title: Quickstart - Ecosystem
description: Ecosystem setup 2
---

You've just set up your ecosystem and chain, and have two Docker containers running:
a postgres database for your chain, and a reth node for the local L1 chain.
Make sure to have the following ports free:
`3050`, `3070`, `4041`, `5432`, and `8545`.

The L1 chain is already running, but your ecosystem and chain aren't deployed yet.
The next step is to deploy your ecosystem contracts to the L1 and register your chain to the ecosystem.

Move into the ecosystem folder:

```bash
cd my_elastic_network
```

Next, run the `zkstack ecosystem init` command below to deploy the ecosystem:

```bash
zkstack ecosystem init --dev
```

When prompted to select the Validium type, select `NoDA`.

::callout{icon="i-heroicons-light-bulb"}
If you have any issues at this step, try reinstalling the dependencies in the prerequisites.
::
