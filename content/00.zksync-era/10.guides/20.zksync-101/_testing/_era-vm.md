---
title: EraVM - Testing
---

:display_partial{path="/_partials/101/testing/setup"}

If your local `anvil-zksync` node is running, stop it with the following command:

```bash
zksync-cli dev stop
```

## `hardhat-zksync-node`

Testing contracts requires a more structured setup.
We'll use `hardhat-zksync-node` which is a part of the `hardhat-zksync` package to run tests against its own implementation
of the in-memory node.

Within the `hardhat.config.ts`, you'll observe the `zksync` flag set to `true` under the
`hardhat` network, indicating the integration with ZKsync's testing environment.

```typescript [hardhat.config.ts]
const config: HardhatUserConfig = {
  defaultNetwork: "inMemoryNode"
  networks: {
    ...
    hardhat: {
      zksync: true,
    },
    ...
  }
  ...
}
```

Your project has npm scripts for testing that set the `--network` to `"hardhat"`.

Secondly within the `hardhat.config.ts`, you'll observe the importing of
`@nomicfoundation/hardhat-chai-matchers`. This plugin provides Hardhat with an extended
suite of assertion methods tailored for contract testing, significantly improving the testing
toolkit available for your project.

```typescript
import "@nomicfoundation/hardhat-chai-matchers";
```

---

## Compile the `CrowdfundingCampaign` contract

Now that our setup is complete, it's time to focus on the core of this
guide - testing our `CrowdfundingCampaign.sol` contract.

Thorough testing involves scrutinizing every function and aspect of our contract,
including potential failure scenarios. In this guide, we'll focus in on the `contribute`
method to ensure it's tested.

To compile the contracts in your project, run the following command:

:display_partial{path="/_partials/commands/_compile"}

---

## Test `CrowdfundingCampaign`

This section describes testing the `CrowdfundingCampaign.sol` contract.
Let's review the contract at [`test/1-hello-zksync/CrowdfundingCampaign.test.ts`](https://github.com/matter-labs/zksync-contract-templates/blob/main/templates/101)

- **Initialization**: Each test case initializes with fresh contract instances in the `beforeEach`
  and predefined rich wallet accounts to simulate various contributors and the contract owner.
- **Deployment**: The `CrowdfundingCampaign` contract is deployed using
  the `deployContract` utility, setting a specific funding goal for each test scenario.

**`contribute` Method Tests:**

- **Zero Contributions**: Verifies that the contract correctly rejects contribution attempts
  with zero value, ensuring the integrity of the contribution process.
- **Funds Aggregation**: Tests the contract's ability to accurately aggregate contributions
  from multiple addresses and update the `totalFundsRaised` accordingly.
- **Goal Achievement**: Checks for the `GoalReached` event emission upon meeting the funding goal,
  confirming the contract's responsiveness to achieving its set target.

Run the tests with the following command:

```bash [npm]
npm run test:crowdfunding-campaign
```

Upon completion, the test suite will provide a summary of all executed tests,
indicating their success or failure:

```bash
  CrowdfundingCampaign
    contribute
      ✔ should reject contributions of 0
      ✔ should aggregate contributions in totalFundsRaised (150ms)
      ✔ should emit GoalReached event when funding goal is met (81ms)
    withdrawFunds
      ✔ should revert if called by a non-owner
      ✔ should revert if funding goal hasn't been reached
      ✔ should transfer the funds to the owner when funds have been raised (229ms)
    getFundingGoal
      ✔ should return the correct funding goal
    getTotalFundsRaised
      ✔ should return 0 when no contributions have been made


  8 passing (2s)
```
