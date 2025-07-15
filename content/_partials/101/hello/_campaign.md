---
title: EraVM - Hello ZKsync
---

## Compile the CrowdfundingCampaign.sol contract

This guide introduces a crowdfunding campaign contract aimed at supporting Zeek's creative ventures.
Let's start by reviewing the starter contract `CrowdfundingCampaign.sol` in the
[`contracts/1-hello-zksync/CrowdfundingCampaign.sol` directory][crowdfunding-campaign-sol].

The `CrowdfundingCampaign` contract is designed for a simple crowdfunding campaign.
This contract features:

- A constructor to initialize the campaign's funding target.
- The `contribute` method to log funds, triggering `ContributionReceived` and `GoalReached` events.
- The `withdrawFunds` method, allowing the owner to collect accumulated funds post-goal achievement.
- The `getTotalFundsRaised` method to return the total amount of funds that's been raised.
- The `getFundingGoal` method to return the goal for the campaign to reach.

[crowdfunding-campaign-sol]: https://github.com/matter-labs/zksync-contract-templates/blob/main/templates/101/eravm/contracts/1-hello-zksync/CrowdfundingCampaign.sol
