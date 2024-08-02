---
title: Foundry | Deploy Contract
---

:display-partial{path = "/_partials/_foundry_alpha_warning"}

Run the following command in your terminal to initialize the Foundry project.

```sh
zksync-cli create --template qs-fs-hello-zksync hello-zksync-foundry-quickstart
cd hello-zksync-foundry-quickstart
```

## Set up your wallet

:display-partial{path = "/build/start-coding/zksync-101/_partials/_setup-wallet"}

## Compile your first contract

This guide
introduces a crowdfunding campaign contract aimed at supporting Zeek's inventive ventures.

Let's start by reviewing the starter contract in the [`src/` directory](https://github.com/matter-labs/zksync-contract-templates/blob/main/templates/quickstart/foundry/hello-zksync/src/Crowdfund.sol).

::drop-panel
  ::panel{label="CrowdfundingCampaign.sol"}
    ```solidity [CrowdfundingCampaign.sol]
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
  ::
::

The `CrowdfundingCampaign` contract is designed for project crowdfunding.
Owned and deployed with a set funding goal, it features:

- A constructor to initialize the campaign's funding target.
- The `contribute` method to log funds, triggering `ContributionReceived` and `GoalReached` events.
- The `withdrawFunds` method, allowing the owner to collect accumulated funds post-goal achievement.

Smart contracts deployed to ZKsync must be compiled using our custom compiler.
For this particular guide we are making use of `zksolc`.

To compile the contracts in the project, run the following command:

```bash
forge build --zksync
```

Upon successful compilation, you'll receive output detailing the
`zksolc` and `solc` versions used during compiling and the number
of Solidity files compiled.

```bash
[⠒] Compiling...
[⠃] Compiling 2 files with 0.8.20
[⠊] Solc 0.8.20 finished in 736.48ms
Compiler run successful!
Compiling contracts for ZKsync Era with zksolc v1.4.0
```

The compiled zkEVM artifacts will be located in the `/zkout` folder, and the solc artifacts will be
located in the `/out` folder.

### Deploy the CrowdfundingCampaign contract

The deployment script is located at [`/script/Deploy.s.sol`](https://github.com/matter-labs/zksync-contract-templates/blob/main/templates/quickstart/foundry/hello-zksync/script/Deploy.s.sol).

```solidity [Deploy.s.sol]
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

- **Constructor Argument:** The `CrowdfundingCampaign` contract is initialized with
a single constructor argument, `fundingGoalInWei`.
- **Broadcast Method:** The deployment uses `vm.startBroadcast(deployerPrivateKey)` to begin
the transaction broadcast and `vm.stopBroadcast()` to end it, facilitating the actual deployment of the contract on the blockchain.

Execute the deployment command.

```bash
forge script script/Deploy.s.sol:DeployCrowdfundContract --account myKeystore --sender <KEYSTORE_ADDRESS> --rpc-url inMemoryNode --broadcast --zksync
```

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
