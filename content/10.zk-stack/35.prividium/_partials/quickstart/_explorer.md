---
title: Quickstart - Block Explorer
description: Setup block explorer
---

The next step is to set up the block explorer and contract verifier service.

### Start the contract verifier

The contract verifier is used to check contract source code against deployed bytecode.
This is going to be used in the explorer to display the source code and ABIs of contracts.

In a new terminal run:

```bash
zkstack contract-verifier init \
--zksolc-version v1.5.6 \
--zkvyper-version v1.5.10  \
--solc-version 0.8.24 \
--era-vm-solc-version 0.8.28-1.0.2 \
--vyper-version v0.4.1
```

This will download the needed binaries for verifying contracts on the block explorer.

Next, run:

```bash
zkstack contract-verifier run
```

Once this is done you are going to have the verifier running on port `3070`.

### Setting up a block explorer

In a new terminal run:

```bash
zkstack explorer init
```

You can select the default options in the prompts.

This command creates a database to store explorer data and generates a docker compose file with explorer services
(`prividium_chain/configs/explorer-docker-compose.yml`).

Next, for each chain you want to have an explorer, you need to start its backend services:

```bash
zkstack explorer backend
```

This command uses the previously created docker compose file to start the services (api, data fetcher, worker) required for
the explorer.

Finally, you can run the explorer app:

```bash
zkstack explorer run
```

This command will start the dockerized explorer app using configuration from `apps/explorer.config.json` file inside
your ecosystem directory. You can edit this file to configure the app if needed.

You can now navigate to the explorer web-app. By default, explorer frontend starts on
`http://localhost:3010`, you can configure the port in `apps.yaml` file.

### Checking the Block Explorer

You can check for the example transactions done in the script by logging in with the deployer wallet...
