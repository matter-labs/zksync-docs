---
title: Quickstart - Deploy Token
description: Deploy ERC20 Token
---

Now that your chain is deployed and your wallet is funded, let's create a template contract and deploy it to `prividium_chain`:

Move out of your ecosystem folder and initialize a new hardhat project using ZKsync CLI:

```bash
npx zksync-cli create prividium-quickstart --template hardhat_solidity --project contracts
cd prividium-quickstart
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

Note that this will connect hardhat to your private RPC API,
which allows you to deploy contracts.

Finally, compile the contract and run the deploy script:

:display_partial{path="/_partials/commands/_compile-deploy-erc20"}

Save the deployed contract address for later.
