---
title: Deploy the contract
---

## Deploy the contract

The deployment script is located at
[`/deploy/1-hello-zksync/deploy.ts`][deploy-script].

**Key Components:**

- **contractArtifactName:** Identifies the `CrowdfundingCampaign` contract for deployment.
- **constructorArguments:** Sets initialization parameters for the contract. In this case,
the fundraising goal, converted from ether to wei to match Solidity's `uint256` type.

Execute the deployment command from `package.json`.

::code-group

```bash [npm]
npm run deploy:hello-zksync
```

```bash [yarn]
yarn deploy:hello-zksync
```

```bash [pnpm]
pnpm deploy:hello-zksync
```

```bash [bun]
bun deploy:hello-zksync
```

::

[deploy-script]: https://github.com/matter-labs/zksync-contract-templates/blob/main/templates/101/deploy/1-hello-zksync/deploy.ts
