---
title: Quickstart - Proxy
description: Proxy RPC API
---

To initialize the proxy API service, open a new terminal in the `my_elastic_network` folder and run:

```bash
zkstack private-rpc init
```

Select the default options for the prompts.

::callout{icon="i-heroicons-light-bulb"}
If you get an error at this step, you may need to allow Docker to use more resources on your system.
::

This command will:

- Generate a private proxy `docker-compose` file at
  `my_elastic_network/chains/prividium_chain/configs/private-proxy-docker-compose.yml`
- Create an example permissions config file at
  `my_elastic_network/chains/prividium_chain/configs/private-rpc-permissions.yaml`.

Next, you can start the proxy API service with:

```bash
zkstack private-rpc run
```

The proxy API should now be running at port `4041`.
