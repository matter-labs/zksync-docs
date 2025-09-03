---
title: EraVM - Testing
---

:display_partial{path="/_partials/101/testing/_setup"}

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
  defaultNetwork: "anvilZKsync"
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

:display_partial{path="/_partials/101/testing/_part2"}

## Test `CrowdfundingCampaign`

This section describes testing the `CrowdfundingCampaign.sol` contract.
Let's review the contract at [`test/1-hello-zksync/CrowdfundingCampaign.test.ts`](https://github.com/matter-labs/zksync-contract-templates/blob/main/templates/101/eravm/test/1-hello-zksync/CrowdfundingCampaign.test.ts)

:display_partial{path="/_partials/101/testing/_run_test"}
