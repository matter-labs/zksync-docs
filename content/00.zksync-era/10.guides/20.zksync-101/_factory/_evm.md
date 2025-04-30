---
title: EVM - Factory
---

:display_partial{path="/_partials/101/factory/_setup"}

## Compile the contracts

This section will focus on compiling and deploying the `CrowdfundingFactory.sol`
contract that is provided under the [`/contracts/2-contract-factory` directory](https://github.com/matter-labs/zksync-contract-templates/blob/main/templates/101/evm/contracts/2-contract-factory).

:display_partial{path="/_partials/101/factory/_setup2"}

The deployment script is located at [`/deploy/2-contract-factory/deploy.ts`](https://github.com/matter-labs/zksync-contract-templates/blob/main/templates/101/evm/deploy/2-contract-factory/deploy.ts).

:display_partial{path="/_partials/101/factory/_deploy"}

Upon successful deployment, you'll receive the deployed factory and campaign addresses:

```bash
🏭 CrowdfundingFactory address: <0xFACTORY_CONTRACT_ADDRESS>
🚀 New CrowdfundingCampaign deployed at: <0xCAMPAIGN_ADDRESS>
✅ Deployment and campaign creation complete!
```
