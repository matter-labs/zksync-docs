---
title: Hardhat | Contract Testing
---
<!-- TODO: @dutterbutter determine best approach to leverate ZKsync cli for project
bootstrapping for this guide series. -->
Run the following command in your terminal to initialize the project.

```sh
npx zksync-cli create --template qs-testing contract-testing-quickstart
cd contract-testing-quickstart
```

---

## Local Era Node

While setting up a local development environment was previously optional, testing contracts requires
a more structured setup. We'll use `hardhat-zksync` to run tests against an In-memory node,
which operates seamlessly within a separate process for an optimized testing workflow.

If you have not set up your local era node yet, follow the instructions in the [Getting Started](/build/quick-start#setup-era-local-node-optional) section.

Within the `hardhat.config.ts`, you'll observe the `zksync` flag set to `true` under the
`hardhat` network, indicating the integration with ZKsync's testing environment.

```ts
hardhat: {
  zksync: true,
},
```

To use the In-memory node for testing, ensure the `hardhat` network is selected with
the `zksync` flag enabled. This setup initiates the node alongside your tests and ensures
it terminates once testing is complete. The node's port allocation starts at the default
`8011`, facilitating smooth and isolated test execution.

Secondly within the `hardhat.config.ts`, you'll observe the importing of
`@nomicfoundation/hardhat-chai-matchers`. This plugin provides Hardhat with an extended
suite of assertion methods tailored for contract testing, significantly improving the testing
toolkit available for your project.

```typescript
import "@nomicfoundation/hardhat-chai-matchers";
```

### Test Wallet Configuration

For testing purposes, we use pre-configured, well-funded wallets. During this testing guide, we will use the following pre-configured wallet,
which eliminates the need for manual funding or setup:

- **Account Address:** `0x36615Cf349d7F6344891B1e7CA7C72883F5dc049`
- **Private Key:** `0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110`

This streamlined approach allows us to focus on writing and running effective tests.

---

## Compile the `CrowdfundingCampaign` contract

Now that our setup is complete, it's time to focus on the core of this
guide - testing our `CrowdfundingCampaign.sol` contract. Here's a quick
refresher on its structure:

::drop-panel
  ::panel{label="CrowdfundingCampaign.sol"}
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
  ::
::

Thorough testing involves scrutinizing every function and aspect of our contract,
including potential failure scenarios. In this guide, we'll focus in on the `contribute`
method to ensure it's tested.

As a challenge to hone your testing skills further,
consider writing additional tests for the `withdrawFunds`, `getTotalFundsRaised`,
and `getFundingGoal` methods, expanding your test coverage and reinforcing the
reliability of the contract.

:display-partial{path = "/_partials/_compile-solidity-contracts"}

Upon successful compilation, you'll receive output detailing the
`zksolc` and `solc` versions used during compiling and the number
of Solidity files compiled.

```bash
Compiling contracts for ZKsync Era with zksolc v1.4.0 and solc v0.8.17
Compiling 2 Solidity file
Successfully compiled 2 Solidity file
```

The compiled artifacts will be located in the `/artifacts-zk` folder.

---

## Test `CrowdfundingCampaign`

This section describes testing the `CrowdfundingCampaign.sol` contract. Let's
start by reviewing the tests for `CrowdfundingCampaign.sol` contract provided
during the initialization step in the `/tests` directory, specifically the
[`crowdFunding.test.ts` file](https://github.com/dutterbutter/zksync-quickstart-guide/blob/db/contract-testing/test/crowdFunding.test.ts).

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

Execute the test command corresponding to your package manager:

::code-group

```bash [npm]
npm run hardhat test --network hardhat
```

```bash [yarn]
yarn hardhat test --network hardhat
```

```bash [pnpm]
pnpm run hardhat test --network hardhat
```

```bash [bun]
bun run hardhat test --network hardhat
```

::

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
