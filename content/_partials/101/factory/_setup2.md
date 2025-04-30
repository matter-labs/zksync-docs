---
title: Setup the project - 2
---

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
