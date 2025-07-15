---
title: Run the test
---

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

::code-group

```bash [npm]
npm run test:crowdfunding-campaign
```

```bash [yarn]
yarn test:crowdfunding-campaign
```

```bash [pnpm]
pnpm test:crowdfunding-campaign
```

```bash [bun]
bun test:crowdfunding-campaign
```

::

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
