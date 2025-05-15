---
title: Testing Part 2
---

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
