---
title: Hardhat | Deploy Contract Factory
---

Hardhat is an Ethereum development environment, designed for easy smart contract
development in Solidity. zkSync provides its own plugins which makes working with
contracts on zkSync simple and efficient.

## Step 1: Setting up environment
:display-partial{path = "/_partials/_environment-setup-with-zksync-cli"}
<!-- TODO: @dutterbutter determine best approach to leverate zksync cli for project
bootstrapping for this guide series. -->
::drop-panel
  ::panel{label="Initialize project"}
    Run the following command in your terminal to initialize the project.

    ```sh
    git clone https://github.com/dutterbutter/zksync-quickstart-guide.git
    cd zksync-quickstart-guide
    git checkout db/contract-factories
    ```
    Install the dependencies:

    ::code-group

    ```bash [yarn]
    yarn install
    ```

    ```bash [pnpm]
    pnpm run install
    ```

    ```bash [npm]
    npm run install
    ```

    ```bash [bun]
    bun run install
    ```

    ::
  ::
::

## Step 2: Set up wallet

Deploying contracts on the zkSync Sepolia testnet requires having testnet ETH.
If you're working within the local development environment,
you can utilize pre-configured rich wallets and skip this step.
For testnet deployments, follow these steps to secure your funds:

:display-partial{path = "/_partials/_setting-up-your-wallet"}

## Step 3: Deploying contract with factory

With our environment and wallet configured, we're set to review the `CrowdfundingFactory.sol`
contract that is provided during the initialization step in the `/contracts` directory.
The `CrowdfundingFactory.sol`contract will be used to deploy multiple instances of
the `CrowdfundingCampaign.sol` contract from the previous guide.

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

The `CrowdfundingFactory` contract automates the creation and oversight of
`CrowdfundingCampaign` contracts, each with its distinct funding goals, it features:

- **Campaign Creation**: Utilizes the `createCampaign` method to initiate a new
`CrowdfundingCampaign` contract. This function takes a `fundingGoal` as an argument,
deploys a new campaign contract with this goal, and tracks the created campaign in the
`campaigns` array.
- **Campaign Tracking**: The `getCampaigns` method offers a view into all the campaigns
created by the factory, allowing for easy access and management of multiple crowdfunding
initiatives.

This contract factory approach streamlines the deployment of crowdfunding campaigns,
making it efficient to launch and manage multiple campaigns concurrently.

### Compile contract

Smart contracts deployed to zkSync must be compiled using our custom compiler.
For this particular guide we are making use of `zksolc`.

To compile the contracts in the project, run the following command:

::code-group

```bash [yarn]
yarn compile
```

```bash [pnpm]
pnpm run compile
```

```bash [npm]
npm run compile
```

```bash [bun]
bun run compile
```

::

#### Expected Output

Upon successful compilation, you'll receive output detailing the
`zksolc` and `solc` versions used during compiling and the number
of Solidity files compiled.

```bash
Compiling contracts for zkSync Era with zksolc v1.4.0 and solc v0.8.17
Compiling 2 Solidity file
Successfully compiled 2 Solidity file
```

The compiled artifacts will be located in the `/artifacts-zk` folder.

### Deploy

This section outlines the steps to deploy the `CrowdfundingCampaign` contract
using our new `CrowdfundingFactory`.

The deployment script is located at `/deploy/deployUsingFactory.ts`.

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

**Key Components:**

**Deployment Workflow:**

- Initiates by deploying the `CrowdfundingFactory` through `deployContract`.
- Using the factory's deployed address to form a `factoryContract` instance,
facilitating access to the factory's functionalities.

**Initiating Campaigns:**

- Executes the `factoryContract`'s `createCampaign` function to create and deploy a new
crowdfunding campaign, with the specified funding target.

#### Deploy factory

Execute the deployment command corresponding to your package manager. The default command
deploys to the configured network in your Hardhat setup. For local deployment, append
`--network inMemoryNode` to deploy to the local in-memory node running.

::code-group

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

```bash [npm]
npm run hardhat deploy-zksync --script deployUsingFactory.ts
# To deploy the contract on local in-memory node:
# npm run hardhat deploy-zksync --script deployUsingFactory.ts --network inMemoryNode
```

```bash [bun]
bun run hardhat deploy-zksync --script deployUsingFactory.ts
# To deploy the contract on local in-memory node:
# bun run hardhat deploy-zksync --script deployUsingFactory.ts --network inMemoryNode
```

::

#### Expected Output

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
