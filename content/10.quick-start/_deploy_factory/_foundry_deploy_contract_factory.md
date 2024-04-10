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

## Step 3: Deploying contract with factory

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

Let's start by deploying the `CrowdfundingFactory` contract. Execute the following
command:

```bash
forge create src/CrowdfundFactory.sol:CrowdfundingFactory --factory-deps src/CrowdfundingCampaign.sol:CrowdfundingCampaign --rpc-url zkSyncSepoliaTestnet --chain 300 --private-key <YOUR-PRIVATE-KEY> --zksync
# To deploy the contract on local in-memory node:
# forge script script/DeployFactory.s.sol:DeployFactoryAndCreateCampaign --rpc-url inMemoryNode --broadcast --zksync
```

#### Expected output

Upon a successfull deployment you'll receive details of the deploying address, the contract address,
and the transaction hash, like so:

```bash
Deployer: 0x89E0Ff69Cc520b55C9F7Bcd3EAC17e81d9bB8dc2
Deployed to: 0x607545Fd35ef49d7445555ddFa22938fD4Efb219
Transaction hash: 0x94e7a97bb64c2bacffbd2a47f3c10021a80156d11082c079046a426c99518d28
```

Using the `CrowdfundingFactory` contract address let's deploy our `CrowdfundingCampaign`:

```bash
cast send 0x607545Fd35ef49d7445555ddFa22938fD4Efb219 "createCampaign(uint256)" "1" --rpc-url zkSyncSepoliaTestnet --chain 300 --private-key <YOUR-PRIVATE-KEY>
# To use the contract factory on local in-memory node:
# cast send 0x607545Fd35ef49d7445555ddFa22938fD4Efb219 "createCampaign(uint256)" "1" --rpc-url inMemoryNode --chain 260 --private-key <YOUR-PRIVATE-KEY>
```

#### Expected output

Upon a successfull deployment you'll receive details of the transaction, including the
contract address of our crowdfunding campaign:

```bash
blockHash               0x7f8dfcd365b4ba5ac690e94aedb5fdb2bdb5ef12b2ff68672ab58c7a89738161
blockNumber             1576375
contractAddress         0x95f83473b88B5599cdB273F976fB3DC66DEA1c1D
...
...
```

Key Components:

**Deployment Workflow:**

- Initiates by deploying the `CrowdfundingFactory` through `forge create --zksync`.
- Using the factory's deployed address to form a `factoryContract` instance,
facilitating access to the factory's functionalities.

**Initiating Campaigns:**

- Executes the `factoryContract`'s `createCampaign` function to create and deploy a new
crowdfunding campaign, with the specified funding target.

🌟 Brilliant! Your contract factory and its first crowdfunding campaign are now operational.
