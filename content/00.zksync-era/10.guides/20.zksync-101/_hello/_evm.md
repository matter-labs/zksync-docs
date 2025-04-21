---
title: EVM - Hello ZKsync
---

:display_partial{path="/_partials/101/hello/_campaign"}

:display_partial{path="/_partials/commands/_compile"}

Upon successful compilation, you'll receive output detailing the typings and Solidity files compiled.

```bash
Generating typings for: 20 artifacts in dir: typechain-types for target: ethers-v6
Successfully generated 78 typings!
Compiled 20 Solidity files successfully
```

The compiled artifacts will be located in the `/artifacts` folder.

### Run a local node

For this section, we will deploy to a local Hardhat node.
Run the command below to start a persistent in-memory node:

```bash
npx hardhat node
```

### Configuring a Hardhat Wallet

Since we are using a local Hardhat in-memory node for development, we can use one of the
rich wallets for transactions and deployments.

Copy one of the private keys logged after starting the node to the `.env` file, using the `.env.example` file as an example.

## Deploy the contract

The deployment script is located at
[`/deploy/1-hello-zksync/deploy.ts`](https://github.com/matter-labs/zksync-contract-templates/blob/main/templates/101/evm/deploy/1-hello-zksync/deploy.ts).

:display_partial{path="/_partials/101/hello/_deploy"}

Upon successful deployment, you'll receive output showing the contract name and address.

```bash
Deploying CrowdfundingCampaign contract to localhost
CrowdfundingCampaign deployed to 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

:display_partial{path="/_partials/101/hello/_interact"}

### Interact with contract

Let's try interacting with the deployed contract.

In the `deploy/1-hello-zksync/interact.ts` script, use your deployed contract address for the `CONTRACT_ADDRESS` variable.

Then, run the script:

::code-group

```bash [npm]
npm run interact:hello-zksync
```

```bash [yarn]
yarn interact:hello-zksync
```

```bash [pnpm]
pnpm interact:hello-zksync
```

```bash [bun]
bun interact:hello-zksync
```

::

Congratulations! You've deployed a crowdfunding contract and learned how
to interact with the deployed contract using Hardhat!
