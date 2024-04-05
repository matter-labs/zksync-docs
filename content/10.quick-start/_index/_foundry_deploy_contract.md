---
title: Foundry | Deploy Contract
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
:display-partial{path = "/_partials/_environment-setup-with-foundry"}

## Step 2: Set up wallet

Deploying contracts on the zkSync Sepolia testnet requires having testnet ETH.
If you're working within the local development environment,
you can utilize pre-configured rich wallets and skip this step.
For testnet deployments, follow these steps to secure your funds:

:display-partial{path = "/_partials/_setting-up-your-wallet"}

## Step 3: Deploying your first contract

With our environment and wallet configured, we're set to deploy our first contract. This guide
introduces a crowdfunding campaign contract aimed at supporting Zeek's inventive ventures
Let's start by reviewing the starter contract in the `src/` directory.

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

```bash
forge build --zksync
```

#### Expected Output

Upon successful compilation, you'll receive output detailing the
`zksolc` and `solc` versions used during compiling and the number
of Solidity files compiled.

```bash
[⠒] Compiling...
[⠃] Compiling 2 files with 0.8.20
[⠊] Solc 0.8.20 finished in 736.48ms
Compiler run successful!
Compiling contracts for zkSync Era with zksolc v1.4.0
```

The compiled zkEVM artifacts will be located in the `/zkout` folder, and the solc artifacts will be
located in the `/out` folder.

### Deploy

This section outlines the steps to deploy the `CrowdfundingCampaign` contract.
The deployment script is located at `/script/Deploy.s.sol`.

```solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "../src/Crowdfund.sol";

contract DeployCrowdfundContract is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("WALLET_PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        uint256 fundingGoalInWei = 0.02 ether;
        new CrowdfundingCampaign(fundingGoalInWei);

        vm.stopBroadcast();
    }
}
```

**Key Components:**

- **contractArtifactName:** Identifies the `CrowdfundingCampaign` contract for deployment.
- **constructorArguments:** Sets initialization parameters for the contract.

#### Deploy contract

Execute the deployment command.

```bash
forge script script/Deploy.s.sol:DeployCrowdfundContract --rpc-url zkSyncSepoliaTestnet --broadcast --zksync
# To deploy the contract on local in-memory node:
# forge script script/Deploy.s.sol:DeployCrowdfundContract --rpc-url inMemoryNode --broadcast --zksync
```

#### Expected Output

Upon successful deployment, you'll receive output detailing the deployment process,
including the contract address, transaction hash, and block number deployed to:

```bash
...
✅  [Success]Hash: 0x69f5f1f0f5b3fa12ed2fbab4d6bb6edc02bbfff2f8c414d8171cc8295250296c
Contract Address: 0xB0C0d3d02c270b6ABe4862EA90bBa1Af192314a8
Block: 1491370
Paid: 0.0001168854 ETH (1168854 gas * 0.1 gwei)
```

🥳 Congratulations! Your smart contract is now deployed. 🚀
