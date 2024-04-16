---
title: Hardhat | Deploy Contract Factory
---
<!-- TODO: @dutterbutter determine best approach to leverage zksync cli for project
bootstrapping for this guide series. -->
Run the following command in your terminal to initialize the project.

```sh
git clone https://github.com/dutterbutter/zksync-quickstart-guide.git
cd zksync-quickstart-guide
git checkout db/contract-factories
```

Install the dependencies:

::code-group

```bash [npm]
npm install
```

```bash [yarn]
yarn install
```

```bash [pnpm]
pnpm install
```

```bash [bun]
bun install
```

::

## Set up your wallet

:display-partial{path="build/quick-start/_partials/_setup-wallet"}

---

## Compile the contracts

This section will focus on compiling and deploying the `CrowdfundingFactory.sol`
contract that is provided under the [`/contracts` directory](https://github.com/dutterbutter/zksync-quickstart-guide/blob/db/contract-factories/contracts/CrowdfundFactory.sol).

The `CrowdfundingFactory.sol`contract will be used to deploy multiple instances of
the `CrowdfundingCampaign.sol` contract from the previous guide.
This contract factory approach streamlines the deployment of crowdfunding campaigns,
making it efficient to launch and manage multiple campaigns.

::drop-panel
  ::panel{label="CrowdfundingFactory.sol"}
    ```solidity
    // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.0;

    // Crowdfunding campaign contract
    import "./CrowdfundingCampaign.sol";

    // Factory contract to create and manage crowdfunding campaigns
    contract CrowdfundingFactory {
        CrowdfundingCampaign[] public campaigns;

        event CampaignCreated(address campaignAddress, uint256 fundingGoal);

        function createCampaign(uint256 fundingGoal) public {
            CrowdfundingCampaign newCampaign = new CrowdfundingCampaign(fundingGoal);
            campaigns.push(newCampaign);

            emit CampaignCreated(address(newCampaign), fundingGoal);
        }

        function getCampaigns() public view returns (CrowdfundingCampaign[] memory) {
            return campaigns;
        }
    }
    ```
  ::
::

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

:display-partial{path = "/_partials/_compile-solidity-contracts"}

Upon successful compilation, you'll receive output detailing the
`zksolc` and `solc` versions used during compiling and the number
of Solidity files compiled.

```bash
Compiling contracts for zkSync Era with zksolc v1.4.0 and solc v0.8.17
Compiling 2 Solidity file
Successfully compiled 2 Solidity file
```

The compiled artifacts will be located in the `/artifacts-zk` folder.

### Deploy CrowdfundingCampaigns via the CrowdfundingFactory

This section outlines the steps to deploy the `CrowdfundingCampaign` contract
using our new `CrowdfundingFactory`.

The deployment script is located at `/deploy/deployUsingFactory.ts`.

::drop-panel
  ::panel{label="deployUsingFactory.ts"}

  ```typescript
  import { deployContract, getWallet } from "./utils";
  import { ethers } from "ethers";
  import { HardhatRuntimeEnvironment } from "hardhat/types";

  export default async function (hre: HardhatRuntimeEnvironment) {
    const contractArtifactName = "CrowdfundingFactory";
    const constructorArguments = [];
    const crowdfundingFactory = await deployContract(contractArtifactName, constructorArguments);

    console.log(`🏭 CrowdfundingFactory address: ${crowdfundingFactory.target}`);

    const contractArtifact = await hre.artifacts.readArtifact("CrowdfundingFactory");
    const factoryContract = new ethers.Contract(
      crowdfundingFactory.target,
      contractArtifact.abi,
      getWallet()
    );

    // Define funding goal for the campaign, e.g., 0.1 ether
    const fundingGoalInWei = ethers.parseEther('0.1').toString();

    // Use the factory to create a new CrowdfundingCampaign
    const createTx = await factoryContract.createCampaign(fundingGoalInWei);
    await createTx.wait();

    // Retrieve the address of the newly created CrowdfundingCampaign
    const campaigns = await factoryContract.getCampaigns();
    const newCampaignAddress = campaigns[campaigns.length - 1];

    console.log(`🚀 New CrowdfundingCampaign deployed at: ${newCampaignAddress}`);
    console.log('✅ Deployment and campaign creation complete!');
  }
  ```

  ::
::

- The `deployUsingFactory.ts` script deploys the `CrowdfundingFactory` through the `deployContract` method.
- An instance of the factory is assigned to `factoryContract`.
  This gives us access to the factory's functionalities.
- The `createCampaign` method is called on this instance to create
  and deploy a new crowdfunding campaign contract.

Run the deployment command. The default command
deploys to the configured network in your Hardhat setup. For local deployment, append
`--network inMemoryNode` to deploy to the local in-memory node running.

::code-group

```bash [npm]
npm run hardhat deploy-zksync --script deployUsingFactory.ts
# To deploy the contract on local in-memory node:
# npm run hardhat deploy-zksync --script deployUsingFactory.ts --network inMemoryNode
```

```bash [yarn]
yarn hardhat deploy-zksync --script deployUsingFactory.ts
# To deploy the contract on local in-memory node:
# yarn hardhat deploy-zksync --script deployUsingFactory.ts --network inMemoryNode
```

```bash [pnpm]
pnpm run hardhat deploy-zksync --script deployUsingFactory.ts
# To deploy the contract on local in-memory node:
# pnpm run hardhat deploy-zksync --script deployUsingFactory.ts --network inMemoryNode
```

```bash [bun]
bun run hardhat deploy-zksync --script deployUsingFactory.ts
# To deploy the contract on local in-memory node:
# bun run hardhat deploy-zksync --script deployUsingFactory.ts --network inMemoryNode
```

::

Upon successful deployment, you'll receive output detailing the deployment process,
including the contract address, source, and encoded constructor arguments:

```bash
Starting deployment process of "CrowdfundingFactory"...
Estimated deployment cost: 0.0002500236 ETH

"CrowdfundingFactory" was successfully deployed:
 - Contract address: 0xD084EF36f8F5353f70498cD84cb8D2B844C120a8
 - Contract source: contracts/CrowdfundFactory.sol:CrowdfundingFactory
 - Encoded constructor arguments: 0x

Requesting contract verification...
Your verification ID is: 10097
Contract successfully verified on zkSync block explorer!
🏭 CrowdfundingFactory address: 0xD084EF36f8F5353f70498cD84cb8D2B844C120a8
🚀 New CrowdfundingCampaign deployed at: 0x060B748eC3512795E94045c406CFd5877DD84e4D
✅ Deployment and campaign creation complete!
```

🌟 Brilliant! Your contract factory and its first crowdfunding campaign are now
operational.
