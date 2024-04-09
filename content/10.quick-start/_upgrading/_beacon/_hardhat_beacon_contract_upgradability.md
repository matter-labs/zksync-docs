---
title: Hardhat | Beacon
---

Hardhat is an Ethereum development environment, designed for easy smart contract development in Solidity.
zkSync provides its own plugins which makes working with contracts on zkSync simple and efficient.

## Step 1: Environment Configuration

## Step 2: Test Wallet Configuration

## Step 3: Adapting `CrowdfundingCampaign.sol` contract for upgradeability

To adapt our `CrowdfundingCampaign.sol` contract for upgradeability, we're
transitioning to a Transparent Proxy pattern. This approach separates the
contract's logic (which can be upgraded) from its persistent state
(stored in the proxy).

**Refactoring for Proxy Compatibility:**

We're refactoring the contract to initialize state variables through an
`initialize` function instead of the constructor, in line with the
Transparent Proxy pattern.

**Updated Contract Structure:**

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/proxy/utils/Initializable.sol";

contract CrowdfundingCampaign is Initializable {
    address public owner;
    uint256 public fundingGoal;
    uint256 public deadline;

    event ContributionReceived(address contributor, uint256 amount);

    function initialize(uint256 _fundingGoal, uint256 _duration) public initializer {
        owner = msg.sender;
        fundingGoal = _fundingGoal;
        deadline = block.timestamp + _duration;
    }

    function contribute() public payable {
        // contribution logic remains the same
    }

    function withdrawFunds() public {
        // withdrawFunds logic remains the same
    }

    function getTotalFundsRaised() public view returns (uint256) {
        // getTotalFundsRaised remains the same
    }

    function getFundingGoal() public view returns (uint256) {
        // getFundingGoal remains the same
    }
}
```

**Key Modifications:**

- **Initializable**: Inherits from OpenZeppelin's `Initializable` to ensure the `initialize` function
can only be called once, similar to a constructor.
- **Initialize Function**: Replaces the constructor for setting initial state, facilitating upgrades
through new logic contracts.
- **Transparent Proxy Pattern**: Utilizes a proxy contract to delegate calls to this logic contract,
allowing for future upgrades without losing the contract's state.

This restructuring not only prepares the `CrowdfundingCampaign` contract for upgradeability.

## Step 4: Upgrading the `CrowdfundingCampaign` Contract

With our initial setup in place, we're ready to enhance our `CrowdfundingCampaign.sol`
contract by incorporating a deadline for contributions. This addition not only brings
a new layer of functionality but also introduces the concept of time-based conditions
through a `modifier`.

**Current Contract Overview:**

The existing version of our contract allows for open-ended contributions towards a
funding goal, without any time constraints.

**Proposed Upgrade:**

We're introducing a `deadline` variable, initialized at contract deployment, to establish a
clear timeframe for accepting contributions. The `withinDeadline` modifier will then enforce
this constraint, ensuring contributions are made within the allowed period.

**Enhanced Contract:**

```solidity
uint256 public deadline;

function initialize(uint256 _fundingGoal, uint256 _duration) public initializer {
    owner = msg.sender;
    fundingGoal = _fundingGoal;
    deadline = block.timestamp + _duration;
}

modifier withinDeadline() {
    require(block.timestamp <= deadline, "Funding period has ended");
    _;
}

function contribute() public payable withinDeadline {
    // Existing contribution logic
}
```

**Deadline Extension Capability:**

To provide flexibility, a new function allows the owner to extend the deadline,
offering adaptability to changing campaign needs.

```solidity
function extendDeadline(uint256 _newDuration) public {
    require(msg.sender == owner, "Only the owner can extend the deadline");
    deadline = block.timestamp + _newDuration;
}
```

This upgrade not only introduces the element of time to the campaign but also
exemplifies the use of `modifiers` for enforcing contract conditions.

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

### Testing

This section describes the testing `CrowdfundingCampaign.sol` contract. Let's
start by reviewing the tests for `CrowdfundingCampaign.sol` contract provided
during the initialization step in the `/tests` directory, specifically the
`crowdFunding.test.ts` file.

```typescript
import { expect } from "chai";
import { ethers } from "hardhat";
import { getWallet, LOCAL_RICH_WALLETS, deployContract } from "../deploy/utils";

describe("CrowdfundingCampaign", function () {
  let campaign;
  let owner, addr1, addr2;

  beforeEach(async function () {
    owner = getWallet(LOCAL_RICH_WALLETS[0].privateKey);
    addr1 = getWallet(LOCAL_RICH_WALLETS[1].privateKey);
    addr2 = getWallet(LOCAL_RICH_WALLETS[2].privateKey);
    const fundingGoalInWei = ethers.parseEther('1').toString();
    campaign = await deployContract("CrowdfundingCampaign", [fundingGoalInWei], { wallet: owner, silent: true });
  });

  describe("Contribute", function () {
    it("should reject contributions of 0", async function () {
      await expect(campaign.connect(addr1).contribute({ value: ethers.parseEther("0") })).to.be.revertedWith("Contribution must be greater than 0");
    });

    it("should aggregate contributions in totalFundsRaised", async function () {
      await campaign.connect(addr1).contribute({ value: ethers.parseEther("0.5") });
      await campaign.connect(addr2).contribute({ value: ethers.parseEther("0.3") });
      expect(await campaign.getTotalFundsRaised()).to.equal(ethers.parseEther("0.8"));
    });

    it("should emit GoalReached event when funding goal is met", async function () {
      await expect(campaign.connect(addr1).contribute({ value: ethers.parseEther("1") }))
        .to.emit(campaign, "GoalReached")
        .withArgs(ethers.parseEther("1"));
    });
  });
});
```

Key Components:

**Testing Workflow:**

- **Initialization**: Each test case initializes with fresh contract instances and predefined
rich wallet accounts to simulate various contributors and the contract owner.
- **Deployment**: The `CrowdfundingCampaign` contract is deployed using the `deployContract`
utility, setting a specific funding goal for each test scenario.

**`contribute` Method Tests:**

- **Zero Contributions**: Verifies that the contract correctly rejects contribution attempts with
zero value, ensuring the integrity of the contribution process.
- **Funds Aggregation**: Tests the contract's ability to accurately aggregate contributions from
multiple addresses and update the `totalFundsRaised` accordingly.
- **Goal Achievement**: Checks for the `GoalReached` event emission upon meeting the funding goal,
confirming the contract's responsiveness to achieving its set target.

#### Execute tests
Execute the test command corresponding to your package manager:

::code-group

```bash [yarn]
yarn hardhat test --network hardhat
```

```bash [pnpm]
pnpm run hardhat test --network hardhat
```

```bash [npm]
npm run hardhat test --network hardhat
```

```bash [bun]
bun run hardhat test --network hardhat
```

::

#### Expected Output

Upon completion, the test suite will provide a summary of all executed tests,
indicating their success or failure:

```bash
  CrowdfundingCampaign
    Contribute
      ✔ should reject contributions of 0 (45ms)
      ✔ should aggregate contributions in totalFundsRaised (213ms)
      ✔ should emit GoalReached event when funding goal is met (113ms)


  3 passing (1s)
```

🎉 Congratulations! The `contribute` method of the `CrowdfundingCampaign` contract
has been thoroughly tested and is ready for action.
