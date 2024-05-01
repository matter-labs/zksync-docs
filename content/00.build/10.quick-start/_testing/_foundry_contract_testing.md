---
title: Hardhat | Contract Testing
---

<!-- TODO: @dutterbutter update to simplify the project init step -->
Run the following command in your terminal to initialize the Foundry project.

```sh
git clone https://github.com/dutterbutter/zksync-foundry-quickstart-guide
cd zksync-foundry-quickstart-guide
git checkout db/contract-testing
```

---

## Test the `CrowdfundingCampaign` contract

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
consider devising additional tests for the `withdrawFunds`, `getTotalFundsRaised`,
and `getFundingGoal` methods, expanding your test coverage and reinforcing the
reliability of the contract.

### Compile contract

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
[⠃] Compiling 22 files with 0.8.20
[⠊] Solc 0.8.20 finished in 736.48ms
Compiler run successful!
Compiling contracts for ZKsync Era with zksolc v1.4.0
```

The compiled zkEVM artifacts will be located in the `/zkout` folder, and the solc artifacts will be
located in the `/out` folder.

### Run the test command

This section describes the testing `CrowdfundingCampaign.sol` contract. Let's
start by reviewing the tests for `CrowdfundingCampaign.sol` contract provided
during the initialization step in the `/test` directory, specifically the
[`CrowdfundingCampaign.t.sol` file](https://github.com/dutterbutter/zksync-foundry-quickstart-guide/blob/db/contract-testing/test/CrowdfundingCampaign.t.sol).

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import "../src/CrowdfundingCampaign.sol";

contract CrowdfundingCampaignTest is Test {
    CrowdfundingCampaign campaign;
    event GoalReached(uint256 totalFundsRaised);
    address owner;
    address addr1;
    address addr2;

    function setUp() public {
        owner = address(this);

        addr1 = vm.addr(1);
        addr2 = vm.addr(2);

        campaign = new CrowdfundingCampaign(1 ether);
        console.log("CrowdfundingCampaign deployed at: %s", address(campaign));
    }

    function test_RejectZeroContributions() public {
        vm.expectRevert("Contribution must be greater than 0");
        campaign.contribute{value: 0}();
    }

    function test_AggregateContributions() public {
        uint256 initialTotal = campaign.getTotalFundsRaised();

        vm.prank(addr1);
        vm.deal(addr1, 2 ether);
        campaign.contribute{value: 0.5 ether}();

        vm.prank(addr2);
        vm.deal(addr2, 2 ether);
        campaign.contribute{value: 0.3 ether}();

        assertEq(campaign.getTotalFundsRaised(), initialTotal + 0.8 ether);
    }

    function test_EmitGoalReachedWhenFundingGoalMet() public {
        vm.prank(addr1);
        vm.deal(addr1, 2 ether);
        vm.expectEmit(true, true, false, true);
        emit GoalReached(1 ether);
        campaign.contribute{value: 1 ether}();
    }
}
```

- **Environment Setup**: Leverages Foundry's `Test` contract and setup functions
to prepare the test environment, ensuring a fresh state for each test case.
- **Deployment and Address Simulation**: Deploys the `CrowdfundingCampaign` contract
within the test setup and simulates addresses using Foundry's `vm.addr()` function for
various test actors.

**`contribute` Method Tests:**

- **Zero Contribution Validation**: Asserts that the contract rejects contribution
attempts with zero value, testing the contract's input validation logic.
- **Contribution Aggregation**: Confirms the contract's ability to correctly tally
contributions from various addresses, ensuring accurate tracking of the total funds raised.
- **Event Emission Upon Goal Achievement**: Utilizes Foundry's `vm.expectEmit` to
anticipate the `GoalReached` event when the funding goal is met, validating the
contract's event logic and state transitions.

Execute the test command:

```bash
forge test --zksync
```

Upon completion, the test suite will provide a summary of all executed tests,
indicating their success or failure:

```bash
Ran 3 tests for test/CrowdfundingCampaign.t.sol:CrowdfundingCampaignTest
[PASS] test_AggregateContributions() (gas: 29204)
[PASS] test_EmitGoalReachedWhenFundingGoalMet() (gas: 18862)
[PASS] test_RejectZeroContributions() (gas: 8148)
Suite result: ok. 3 passed; 0 failed; 0 skipped; finished in 44.03ms (43.94ms CPU time)

Ran 1 test suite in 48.11ms (44.03ms CPU time): 3 tests passed, 0 failed, 0 skipped (3 total tests)
```

🎉 Congratulations! The `contribute` method of the `CrowdfundingCampaign` contract
has been thoroughly tested and is ready for action.
