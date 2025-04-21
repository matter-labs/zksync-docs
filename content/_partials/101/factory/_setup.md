---
title: Setup the project
---

## Setup the project

Make sure to go through the setup provided in the previous sections.
You will have downloaded the 101 project through ZKsync CLI `create` and started up a local in-memory node for development.

## Compile the contracts

This section will focus on compiling and deploying the `CrowdfundingFactory.sol`
contract that is provided under the [`/contracts/2-contract-factory` directory](https://github.com/matter-labs/zksync-contract-templates/blob/main/templates/101).

The `CrowdfundingFactory.sol`contract will be used to deploy multiple instances of
the `CrowdfundingCampaign.sol` contract from the previous guide.
This contract factory approach streamlines the deployment of crowdfunding campaigns,
making it efficient to launch and manage multiple campaigns.

The `CrowdfundingFactory` contract automates the creation and oversight of
`CrowdfundingCampaign` contracts, each with their own distinct funding goals.
The factory contract features:

- **Campaign Creation**: Utilizes the `createCampaign` method to initiate a new
`CrowdfundingCampaign` contract. This function takes a `fundingGoal` as an argument,
deploys a new campaign contract with this goal, and tracks the created campaign in the
`campaigns` array.
- **Campaign Tracking**: The `getCampaigns` method offers a view into all the campaigns
created by the factory, allowing for easy access and management of multiple crowdfunding
initiatives.

Run the compile script from your project in the terminal:

:display_partial{path="/_partials/commands/_compile"}

### Deploy CrowdfundingCampaigns via the CrowdfundingFactory

This section outlines the steps to deploy the `CrowdfundingCampaign` contract
using our new `CrowdfundingFactory`.

The deployment script is located at [`/deploy/2-contract-factory/deploy.ts`](https://github.com/matter-labs/zksync-contract-templates/blob/main/templates/101).

The deploy script:

- deploys a single `CrowdfundingFactory`.
- saves an instance of the deployed factory to `factoryContract`.
  This gives us access to the factory's functionalities.
- The `createCampaign` method is called on this instance to create
  and deploy a new crowdfunding campaign contract.

Run the deployment command.

::code-group

```bash [npm]
npm run deploy:crowdfunding-factory
```

```bash [yarn]
yarn deploy:crowdfunding-factory
```

```bash [pnpm]
pnpm deploy:crowdfunding-factory
```

```bash [bun]
bun deploy:crowdfunding-factory
```

::
