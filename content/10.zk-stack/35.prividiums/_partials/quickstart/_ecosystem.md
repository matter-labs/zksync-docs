---
title: Quickstart - Ecosystem
description: Ecosystem setup
---

The first step is to create a new ecosystem with the `zkstack ecosystem create` command.

::callout{icon="i-heroicons-light-bulb"}
Make sure Docker is running on your machine.
::

Move to a directory where you want your ecosystem folder to be, and run the command below to generate an ecosystem folder.

```bash
zkstack ecosystem create
```

You will be prompted with a series of options to customize your ecosystem and generate a new chain within the ecosystem.
For this tutorial, use the options shown below.
If you choose different names for your ecosystem or chain, remember to update the names in the commands later on.

::drop-panel
  ::panel{label="Prompt Options"}
    ```bash
    ❯ zkstack ecosystem create

    ┌   ZK Stack CLI
    │
    ◇  What do you want to name the ecosystem?
    │  my_elastic_network
    │
    ◇  Select the origin of zksync-era repository
    │  Clone for me (recommended)
    │
    ◇  Select the L1 network
    │  Localhost
    │
    ◇  What do you want to name the chain?
    │  prividium_chain
    │
    ◇  What's the chain id?
    │  548394
    │
    ◇  Select how do you want to create the wallet
    │  Localhost
    │
    ◇  Select the prover mode
    │  NoProofs
    │
    ◇  Select the commit data generator mode
    │  Validium
    │
    ◇  Select the base token to use
    │  Eth
    │
    ◇  Enable EVM emulator?
    │  No
    │
    ◇  Enable EVM emulator?
    │  No
    │
    ◇  Do you want to start containers after creating the ecosystem?
    │  Yes
    ```
  ::
::
