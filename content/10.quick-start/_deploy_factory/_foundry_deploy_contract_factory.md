---
title: Foundry | Deploy Contract Factory
---

`foundry-zksync` is a specialized fork of Foundry, tailored for zkSync.
It extends Foundry's capabilities for Ethereum app development to support zkSync,
allowing for the compilation, deployment, testing, and interaction with smart contracts on zkSync.

::callout{icon="i-heroicons-information-circle-16-solid" color="amber"}
`foundry-zksync` is still in an alpha stage, so some features might not be fully supported
yet and may not work as fully intended. It is open-sourced and contributions are welcomed.
::

<!-- TODO: @dutterbutter 
Need to update to include prerequisite of Foundry installation
This should be a simple curl request but needs to be setup by devops  -->
## Step 1: Setting up environment
:display-partial{partial = "Foundry-zksync Installation"}

## Step 2: Set up wallet

Deploying contracts on the zkSync Sepolia testnet requires having testnet ETH.
If you're working within the local development environment,
you can utilize pre-configured rich wallets and skip this step.
For testnet deployments, follow these steps to secure your funds:

:display-partial{partial = "Setting up your wallet"}

## Step 3: Deploying your first contract

With our environment and wallet configured, we're set to review the `CrowdfundingFactory.sol`
contract that is provided during the initialization step in the `/src` directory.
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

```bash
forge build --zksync
```

#### Expected Output

Upon successful compilation, you'll receive output detailing the
`zksolc` and `solc` versions used during compiling and the number
of Solidity files compiled.

```bash
[⠒] Compiling...
[⠃] Compiling 22 files with 0.8.20
[⠊] Solc 0.8.20 finished in 736.48ms
Compiler run successful!
Compiling contracts for zkSync Era with zksolc v1.4.0
```

The compiled zkEVM artifacts will be located in the `/zkout` folder, and the solc
artifacts will be located in the `/out` folder.

### Deploy

This section outlines the steps to deploy the `CrowdfundingCampaign` contract using
our new `CrowdfundingFactory`.

The deployment script is located at `/script/deployUsingFactory.s.sol`.

```solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "forge-std/console.sol";
import "../src/CrowdfundFactory.sol";
import "../src/CrowdfundingCampaign.sol";

contract DeployFactoryAndCreateCampaign is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("WALLET_PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Deploy the CrowdfundingFactory contract
        CrowdfundingFactory factory = new CrowdfundingFactory();

        // Log the factory's address
        console.log("CrowdfundingFactory deployed at: %s", address(factory));

        // Define the funding goal for the new campaign
        uint256 fundingGoalInWei = 0.01 ether;

        // Use the factory to create a new CrowdfundingCampaign
        factory.createCampaign(fundingGoalInWei);

        // Not sure how to get the address of the new campaign
        // TODO: Log the address of the new campaign

        vm.stopBroadcast();
    }
}
```

Key Components:

**Deployment Workflow:**

- Initiates by deploying the `CrowdfundingFactory` through `deployContract`.
- Using the factory's deployed address to form a `factoryContract` instance,
facilitating access to the factory's functionalities.

**Initiating Campaigns:**

- Executes the `factoryContract`'s `createCampaign` function to create and deploy a new
crowdfunding campaign, with the specified funding target.

#### Deploy factory
Execute the deployment command.

```bash
forge script script/DeployFactory.s.sol:DeployFactoryAndCreateCampaign --rpc-url zkSyncSepoliaTestnet --broadcast --zksync
# To deploy the contract on local in-memory node:
# forge script script/DeployFactory.s.sol:DeployFactoryAndCreateCampaign --rpc-url inMemoryNode --broadcast --zksync
```

#### Expected Output

Upon successful deployment, you'll receive output detailing the deployment process,
including the contract address, transaction hash, and block number deployed to:

```bash
== Logs ==
  CrowdfundingFactory deployed at: 0xdE663Eccf654692A27CC706a8783D9E226ab7998
...
...
✅  [Success]Hash: 0x51b8707426039e2fb4f9464403176792dca80d94a4b7b8bf75d6fb1bddcb9144
Contract Address: 0xdE663Eccf654692A27CC706a8783D9E226ab7998
Block: 1505221
Paid: 0.000455622 ETH (4556220 gas * 0.1 gwei)
```

🌟 Brilliant! Your contract factory and its first crowdfunding campaign are now operational.
