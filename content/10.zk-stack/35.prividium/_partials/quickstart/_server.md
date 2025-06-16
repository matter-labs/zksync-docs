---
title: Quickstart - Server
description: Start the chain server
---

The last step here is to start a server for `prividium_chain`:

```bash
zkstack server
```

With this, your L1 chain should be running at port `8545`,
the `prividium_chain` database running at port `5432`,
and the `prividium_chain` node running at port `3050`.

Note that the node running at port `3050` provides full access to your chain.
This URL should be kept private.
