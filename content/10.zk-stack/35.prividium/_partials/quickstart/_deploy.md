---
title: Quickstart - Deploy Token
description: Deploy ERC20 Token
---

Now that your chain is deployed and your wallet is funded, let's create a template contract and deploy it to `prividium_chain`:

Move out of your ecosystem folder and initialize a new hardhat project using ZKsync CLI:

```bash
npx zksync-cli create prividium-token --template hardhat_solidity --project contracts
cd prividium-token
```

Use the same private key for the rich wallet:

```shell
? Private key of the wallet responsible for deploying contracts (optional)
0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110
```

In the `hardhat.config.ts` file, let's configure the local network as the default:

```ts
defaultNetwork: "dockerizedNode",
```

Note that this will connect hardhat to your standard full-access RPC API,
which allows you to deploy contracts.

Finally, compile the contracts and run the deploy script for the ERC20 token contract:

:display_partial{path="/_partials/commands/_compile-deploy-erc20"}

Save the deployed contract address for later.
