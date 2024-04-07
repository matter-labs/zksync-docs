---
title: Hardhat | Deploy Contract
---

Hardhat is an Ethereum development environment, designed for easy smart contract development in Solidity.
zkSync provides its own plugins which makes working with contracts on zkSync simple and efficient.

## Step 1: Setting up environment
:display-partial{partial = "Environment Setup with zkSync CLI"}

## Step 2: Set up wallet

Deploying contracts on the zkSync Sepolia testnet requires having testnet ETH.
If you're working within the local development environment,
you can utilize pre-configured rich wallets and skip this step.
For testnet deployments, follow these steps to secure your funds:

:display-partial{partial = "Setting up your wallet"}

## Step 3: Deploying your first contract

With our environment and wallet configured, we're set to deploy our first contract. This guide
introduces a crowdfunding campaign contract aimed at supporting Zeek's inventive ventures
Let's start by reviewing the starter contract in the `contracts/` directory.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CrowdfundingCampaign {
    address public owner;
    uint256 public fundingGoal;
    uint256 public totalFundsRaised;
    mapping(address => uint256) public contributions;

    event ContributionReceived(address contributor, uint256 amount);
    event GoalReached(uint256 totalFundsRaised);

    constructor(uint256 _fundingGoal) {
        owner = msg.sender;
        fundingGoal = _fundingGoal;
    }

    function contribute() public payable {
        require(msg.value > 0, "Contribution must be greater than 0");
        contributions[msg.sender] += msg.value;
        totalFundsRaised += msg.value;

        emit ContributionReceived(msg.sender, msg.value);

        if (totalFundsRaised >= fundingGoal) {
            emit GoalReached(totalFundsRaised);
        }
    }

    function withdrawFunds() public {
        require(msg.sender == owner, "Only the owner can withdraw funds");
        require(totalFundsRaised >= fundingGoal, "Funding goal not reached");

        uint256 amount = address(this).balance;
        totalFundsRaised = 0;

        (bool success, ) = payable(owner).call{value: amount}("");
        require(success, "Transfer failed.");
    }

    function getTotalFundsRaised() public view returns (uint256) {
        return totalFundsRaised;
    }

    function getFundingGoal() public view returns (uint256) {
        return fundingGoal;
    }
}
```

The `CrowdfundingCampaign` contract is designed for project crowdfunding.
Owned and deployed with a set funding goal, it features:

- A constructor to initialize the campaign's funding target.
- The `contribute` method to log funds, triggering `ContributionReceived` and `GoalReached` events.
- The `withdrawFunds` method, allowing the owner to collect accumulated funds post-goal achievement.

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
Compiling 1 Solidity file
Successfully compiled 1 Solidity file
```

The compiled artifacts will be located in the `/artifacts-zk` folder.

### Deploy

This section outlines the steps to deploy the `CrowdfundingCampaign` contract.
The deployment script is located at `/deploy/deploy.ts`.

```typescript
import { deployContract } from "./utils";
import { ethers } from "ethers";

// An example of a basic deploy script
// It will deploy a CrowdfundingCampaign contract to selected network
// `parseEther` converts ether to wei, and `.toString()` ensures serialization compatibility.
export default async function () {
  const contractArtifactName = "CrowdfundingCampaign";
  const constructorArguments = [ethers.parseEther('.02').toString()];
  await deployContract(contractArtifactName, constructorArguments);
}
```

Key Components:

- **contractArtifactName:** Identifies the `CrowdfundingCampaign` contract for deployment.
- **constructorArguments:** Sets initialization parameters for the contract. In this case,
the fundraising goal, converted from ether to `wei` to match Solidity's `uint256` type.

#### Deploy contract
Execute the deployment command corresponding to your package manager. The default command
deploys to the configured network in your Hardhat setup. For local deployment, append
`--network inMemoryNode` to deploy to the local in-memory node running.

::code-group

```bash [yarn]
yarn hardhat deploy-zksync --script deploy.ts
# To deploy the contract on local in-memory node:
# yarn hardhat deploy-zksync --script deploy.ts --network inMemoryNode
```

```bash [pnpm]
pnpm run hardhat deploy-zksync --script deploy.ts
# To deploy the contract on local in-memory node:
# pnpm run hardhat deploy-zksync --script deploy.ts --network inMemoryNode
```

```bash [npm]
npm run hardhat deploy-zksync --script deploy.ts
# To deploy the contract on local in-memory node:
# npm run hardhat deploy-zksync --script deploy.ts --network inMemoryNode
```

```bash [bun]
bun run hardhat deploy-zksync --script deploy.ts
# To deploy the contract on local in-memory node:
# bun run hardhat deploy-zksync --script deploy.ts --network inMemoryNode
```

::

#### Expected Output

Upon successful deployment, you'll receive output detailing the deployment process,
including the contract address, source, and encoded constructor arguments:

```bash
Starting deployment process of "CrowdfundingCampaign"...
Estimated deployment cost: 0.000501 ETH

"CrowdfundingCampaign" was successfully deployed:
 - Contract address: 0x4E3404F21b29d069539e15f8f9E712CeAE39d90C
 - Contract source: contracts/Crowdfund.sol:CrowdfundingCampaign
 - Encoded constructor arguments: 0x00000000000000000000000000000000000000000000000000470de4df820000

Requesting contract verification...
Your verification ID is: 10067
Contract successfully verified on zkSync block explorer!
```

🥳 Congratulations! Your smart contract is now deployed. 🚀
