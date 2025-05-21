---
title: Quickstart - Block Explorer
description: Setup block explorer
---

The next step is to set up the block explorer and contract verifier service.

### Start the contract verifier

The contract verifier is used to check contract source code against deployed bytecode.
This is going to be used in the explorer to display the source code and ABIs of contracts.

You are going to be prompted about the versions of compilers that you want to support.
Choose `0.8.24` as the minimum version for solc, `1.56` for zksolc.

In a new terminal run the following commands:

```sh
zkstack contract-verifier init

zkstack contract-verifier run
```

Once this is done you are going to have the verifier running on port `3070`.

### Setting up a block explorer

In a new terminal run:

```bash
zkstack explorer init
```

This command creates a database to store explorer data and generates a docker compose file with explorer services
(`explorer-docker-compose.yml`).

Next, for each chain you want to have an explorer, you need to start its backend services:

```bash
zkstack explorer backend
```

This command uses the previously created docker compose file to start the services (api, data fetcher, worker) required for
the explorer.

Before running the front-end you need to select a port that don’t collides with the ports already in use.
You can do that by editing `configs/apps.yaml` and change the port of the explorer to `3011`:

```yaml
portal:
  http_port: 3030
explorer:
  http_port: 3011 # this won't collide
```

Finally, you can run the explorer app:

```bash
zkstack explorer run
```

This command will start the dockerized explorer app using configuration from `apps/explorer.config.json` file inside
your ecosystem directory. You can edit this file to configure the app if needed.

You can now navigate to the explorer web-app. By default, explorer frontend starts on
`http://localhost:3010`, you can configure the port in `apps.yaml` file.

### Checking the Block Explorer

You can check for the example transactions done in the script by logging in with the deployer wallet.
To see all transactions, log in with the admin wallet.
