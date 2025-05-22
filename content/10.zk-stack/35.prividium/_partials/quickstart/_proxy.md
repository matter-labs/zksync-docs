---
title: Quickstart - Proxy
description: Proxy RPC API
---

To initialize the Proxy API service, open a new terminal in your ecosystem folder and run:

```bash
zkstack private-rpc init
```

You can select the default options for the prompts.

::callout{icon="i-heroicons-light-bulb"}
If you get an error at this step, you may need to allow Docker to use more resources on your system.
::

This command will generate two files:

- A private proxy `docker-compose` file at
  `/chains/prividium_chain/configs/private-proxy-docker-compose.yml`
- An example permissions config file at
  `/chains/prividium_chain/configs/private-rpc-permissions.yaml`.

Next, you can start the Proxy API service with:

```bash
zkstack private-rpc run
```

The Proxy API should now be running at port `4041`.
