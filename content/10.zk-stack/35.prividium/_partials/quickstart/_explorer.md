---
title: Quickstart - Block Explorer
description: Setup block explorer
---

### Setting up a block explorer

In a new terminal run:

```bash
zkstack explorer init --prividium
```

You can select the default options in the prompts.

This command creates a database to store explorer data and generates a docker compose file with explorer services
at `prividium_chain/configs/explorer-docker-compose.yml`.

Next, you need to start the explorer backend services:

```bash
zkstack explorer backend
```

This command uses the previously created docker compose file to start the services required for
the explorer.

Finally, in a new terminal you can run the explorer app:

```bash
zkstack explorer run
```

This command will start the dockerized explorer app using configuration from `apps/explorer.config.json` file inside
your ecosystem directory. You can edit this file to configure the app if needed.

You can now navigate to the explorer web-app. By default, the explorer frontend starts on
`http://127.0.0.1:3010`, you can configure the port in `apps.yaml` file.

#### Switching to an internal explorer

To switch between the public-facing Prividium™ block explorer and a standard full-access block explorer for internal use:

1. Stop the explorer frontend.
1. Stop the explorer backend.
1. Run `zkstack explorer init` and select `No` when prompted to use the Prividium™ explorer.
1. Restart the explorer backend and frontend services.

Right now both versions of the explorer can't be run at the same time with `zkstack`,
but it's possible to configure this manually.

To switch back to a Prividium™ block explorer,
re-run the steps from ["Setting up a block explorer"](#setting-up-a-block-explorer).

### Using the Block Explorer

To use the public-facing Prividium™ block explorer,
users must first sign in with their wallet.
The block explorer then provides the configured level of access
based on their account.
