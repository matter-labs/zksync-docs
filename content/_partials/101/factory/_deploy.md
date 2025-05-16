---
title: Deploy the project
---

The deploy script:

- deploys a single `CrowdfundingFactory`.
- saves an instance of the deployed factory to `factoryContract`.
  This gives us access to the factory's functionalities.
- The `createCampaign` method is called on this instance to create
  and deploy a new crowdfunding campaign contract.

Run the deployment command.

::code-group

```bash [npm]
npm run deploy:crowdfunding-factory
```

```bash [yarn]
yarn deploy:crowdfunding-factory
```

```bash [pnpm]
pnpm deploy:crowdfunding-factory
```

```bash [bun]
bun deploy:crowdfunding-factory
```

::
