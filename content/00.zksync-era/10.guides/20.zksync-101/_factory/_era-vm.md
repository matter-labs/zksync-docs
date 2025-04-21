---
title: EraVM - Factory
---

:display_partial{path="/_partials/101/factory/_setup"}

Upon successful deployment, you'll receive output detailing the deployment process,
including the contract address, source, and encoded constructor arguments:

```bash
Starting deployment process of "CrowdfundingFactory"...
Estimated deployment cost: 0.0002500236 ETH

"CrowdfundingFactory" was successfully deployed:
 - Contract address: <0xFACTORY_CONTRACT_ADDRESS>
 - Contract source: contracts/CrowdfundFactory.sol:CrowdfundingFactory
 - Encoded constructor arguments: 0x

✅ Deployment and campaign creation complete!
```

## Create another campaign with ZKsync CLI

We've got one crowdfunding campaign created from the deployment script,
let's create another through ZKsync CLI!

Run the following command:

```bash
zksync-cli contract write \
--chain in-memory-node \
--contract <0xFACTORY_CONTRACT_ADDRESS> \
--pk 0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110
```

The CLI will prompt you with a few questions.
We want to call the method `createCampaign(uint256 fundingGoal)`
and provide a funding goal in wei:

```bash
? Enter method to call createCampaign(uint256 fundingGoal)
? Provide method arguments:
? [1/1] fundingGoal (uint256) 200000000000000000
```

Now that we've created a second crowdfunding campaign,
let's check the list of campaigns!

Run the following command from within your project directory.

```bash
zksync-cli contract read \
--chain in-memory-node \
--contract <0xFACTORY_CONTRACT_ADDRESS> \
--abi artifacts-zk/contracts/2-contract-factory/CrowdfundingFactory.sol/CrowdfundingFactory.json
```

::callout{icon="i-heroicons-information-circle" color="blue"}
We pass the ABI in to help decode the output.
Without the ABI, the CLI will return the raw response.
::

The CLI will prompt with a list of the available methods from the contract.
Navigate with the arrow keys and press **Enter** on `getCampaigns() view returns (address[])`.

The ClI returns the method's response in raw format along with the decoded format
because we passed in the ABI.

You should see two addresses in the decoded method response, the first created from
the deploy script and the second for the campaign you created with ZKsync CLI!

```bash
✔ Method response (raw): 0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000020000000000000000000000009bf2281f53847387e1d8b5645cfcfbea576c4397000000000000000000000000ca55c6bbb6b122058ed742c33859f3621bc8030c
✔ Decoded method response: 0x9bf2281F53847387e1d8b5645cFCfbea576c4397,0xca55c6BBB6B122058Ed742C33859F3621bc8030c
```
