---
title: Transparent Upgradeable Proxy Contract
---

### What is a transparent upgradeable proxy contract?

Transparent upgradeable contracts utilize the proxy pattern to facilitate post-deployment
logic updates while preventing accidental function collisions. They consist of:

1. **Proxy Contract**: Manages storage, balance, and delegates calls to the logic contract,
except for those by the admin, ensuring clear separation between user and administrative interactions.
1. **Logic Contract**: Houses the actual business logic, upgradeable by swapping out for new versions.
1. **Admin Address**: Holds the rights to upgrade the logic contract, with its commands executed
exclusively by the proxy to prevent unintended logic execution.

This setup ensures only non-administrative calls reach the logic contract, allowing
for safe and seamless upgrades. By switching the logic contract to a newer version
while keeping the original proxy intact, the contract's state and balance are preserved.
This facilitates improvements or bug fixes without changing the proxy, maintaining a
consistent user interface.

---

## Adapt `CrowdfundingCampaign.sol` contract for upgradeability

To adapt our `CrowdfundingCampaign.sol` contract for upgradeability, we're
transitioning to a proxy pattern. This approach separates the
contract's logic (which can be upgraded) from its persistent state
(stored in the proxy).

### Refactoring for Proxy Compatibility

In the `contracts/3-proxy-contracts/transparent` directory you'll observe the refactored
[`ProxyableCrowdfundingCampaign.sol` contract][proxyable-crowdfunding-campaign-sol]
which initializes state variables through an
`initialize` function instead of the constructor, in line with the
Transparent Proxy pattern.

**Key Modifications:**

- **Initializable**: Inherits from OpenZeppelin's `Initializable` to ensure the `initialize` function
can only be called once, similar to a constructor.
- **Initialize Function**: Replaces the constructor for setting initial state, facilitating upgrades
through new logic contracts.
- **Proxy Pattern**: Utilizes a proxy contract to delegate calls to this logic contract,
allowing for future upgrades without losing the contract's state.

This restructuring makes the `ProxyableCrowdfundingCampaign` contract upgradeable.

---

## Deploy the `ProxyableCrowdfundingCampaign` contract

Now that the `ProxyableCrowdfundingCampaign` contract is adapted for contract upgradeability, let's proceed to deploy
the contract so we may upgrade it in later steps.

To compile the contracts in the project, run the following command:

```bash [npm]
npm run compile
```

The deployment script is located at
[`/deploy/3-proxy-contracts/transparent/deploy.ts`][deploy-script].

**Key Components:**

- **`hre.zkUpgrades.deployProxy`**: This method call deploys the `ProxyableCrowdfundingCampaign`
contract via a transparent proxy, leveraging Hardhat's runtime environment for ZKsync upgrades.
This ensures the deployed contract can be upgraded in the future without losing its state or funds.
- **`initializer`**: Specifies the initialization method of the contract, `initialize` in this case,
which is required for setting up the proxy's state upon deployment.

```bash [npm]
npm run deploy:transparent-proxy
```

Upon successful deployment, you'll receive output detailing the deployment process,
including the contract addresses of the implementation
contract, the admin contract, and the transparent
proxy contract.

```bash
Implementation contract was deployed to 0xE3F814fa915A75bA47230537726C99f6517Da58e
Admin was deployed to 0x05198D9f93cBDfa3e332776019115512d8e0c809
Transparent proxy was deployed to 0x68E8533acE01019CB8D07Eca822369D5De71b74D
```

---

## Upgrade the `ProxyableCrowdfundingCampaign` Contract

With our initial setup deployed, we're ready to update our `ProxyableCrowdfundingCampaign.sol`
contract by incorporating a deadline for contributions. This addition not only brings
a new layer of functionality but also introduces the concept of time-based conditions
through a `modifier`.

**Current Contract Overview:**

The existing version of our contract allows for open-ended contributions towards a
funding goal, without any time constraints.

**Proposed Upgrade:**

We're introducing a dealine on creation of a crowdfunding campaign.
Contributions can only be made within the allowed time period.

**Enhanced Contract:**

The upgraded contract,
[`/contracts/3-proxy-contracts/transparent/V2_ProxyableCrowdfundingCampaign.sol`][v2-proxyable-crowdfunding-campaign-sol],
incorporates these changes:

- **Deadline Variable:** A new state variable deadline defines the campaign's end time,
enhancing the contract with time-based logic.

- **Initialization Logic:** An additional initialization method, `initializeV2`, sets the deadline
based on a duration provided during the upgrade. This function ensures that the upgrade is
backward-compatible and maintains the contract's integrity.
Campaigns that were made before the upgrade can still continue to fund without the deadline logic affecting them.

- **Contribution Logic with Deadline:** The `contribute` method now includes a `withinDeadline` modifier,
ensuring all contributions are made within the set timeframe.

- **Deadline Enforcement:** The `withinDeadline` modifier checks that the campaign is a V2 version and checks the current time against the deadline,
safeguarding the contract from late contributions.

**Deadline Extension Capability:**

To provide flexibility, a new function allows the owner to extend the deadline,
offering adaptability to changing campaign needs.

This upgrade not only introduces the element of time to the campaign but also
demonstrates the use of [`modifiers`](https://docs.soliditylang.org/en/latest/contracts.html#function-modifiers) for enforcing contract conditions.

### Compile contract

Run the npm script `compile` to compile the contracts:

```bash [npm]
npm run compile
```

### Update to `V2_ProxyableCrowdfundingCampaign`

This section guides you through upgrading the `ProxyableCrowdfundingCampaign` contract
to its second version, `V2_ProxyableCrowdfundingCampaign`.
Review the [`deploy/3-proxy-contracts/upgrade-transparent.ts`][upgrade-script]
script to begin.

Replace `YOUR_PROXY_ADDRESS_HERE` with the actual address of your
deployed Transparent Proxy from the previous deployment step.

**Key Components:**

- **`upgradeProxy`:** A critical method from the `hre.zkUpgrades` module that
performs the contract upgrade. It takes the wallet, the proxy address, and the
new contract artifact as arguments to transition the proxy to use the `V2CrowdfundingCampaign` logic.

- **`initializeV2`:** Post-upgrade, this function is invoked to initialize the new
variables or logic introduced in `V2_ProxyableCrowdfundingCampaign`. In this example,
it sets a new campaign duration, illustrating how contract upgrades can add
functionalities without losing the existing state or funds.

Run the following command to upgrade to the `V2_ProxyableCrowdfundingCampaign`:

```bash [npm]
npm run upgrade:transparent-proxy
```

Upon successful deployment, you'll receive output detailing the upgrade process,
including the contract address, and transaction hash:

```bash
Contract successfully upgraded to 0x094499Df5ee555fFc33aF07862e43c90E6FEe501 with tx 0xe281c711b08cab3177b3a542af2e7e3def6602e8d34284127a4343b8e95dcf82
Successfully upgraded ProxyableCrowdfundingCampaign to V2_ProxyableCrowdfundingCampaign
V2CrowdfundingCampaign initialized. Transaction Hash: 0x3a7cbf9d584457bc6b452964f41e1971f22393724f103e41984e0282bd8cb5cc
```

---

## Verify upgradable contracts

::callout{icon="i-heroicons-exclamation-triangle" color="amber"}
Since we are using in memory node for our smart contracts, we do not have the feature
available to verify the smart contract.

The following explains how you can verify an upgraded smart contract on testnet or mainnet.
::

For the verification of our upgradable contracts, it's essential to utilize the proxy address that was specified in our
upgrade script.

To proceed with verification, execute the following command:

Replace <PROXY_ADDRESS> with the actual proxy address from your deployment.
This is the address from the earlier deployment message: `Contract successfully upgraded to <PROXY_ADDRESS>`.

```bash [npm]
npx hardhat verify <PROXY_ADDRESS>
```

Upon successful verification, you'll receive output detailing the verification process:

```bash
Verifying implementation: 0x58BD5adb462CF087E5838d53aE38A3Fe0EAf7A31
Your verification ID is: 10543
Contract successfully verified on ZKsync block explorer!
Verifying proxy: 0x68E8533acE01019CB8D07Eca822369D5De71b74D
Your verification ID is: 10544
Contract successfully verified on ZKsync block explorer!
Verifying proxy admin: 0x05198D9f93cBDfa3e332776019115512d8e0c809
Your verification ID is: 10545
Contract successfully verified on ZKsync block explorer!
```

[proxyable-crowdfunding-campaign-sol]: https://github.com/matter-labs/zksync-contract-templates/blob/main/templates/101/contracts/3-proxy-contracts/transparent/ProxyableCrowdfundingCampaign.sol
[deploy-script]: https://github.com/matter-labs/zksync-contract-templates/blob/main/templates/101/deploy/3-proxy-contracts/transparent/deploy.ts
[v2-proxyable-crowdfunding-campaign-sol]: https://github.com/matter-labs/zksync-contract-templates/blob/main/templates/101/contracts/3-proxy-contracts/transparent/V2_ProxyableCrowdfundingCampaign.sol
[upgrade-script]: https://github.com/matter-labs/zksync-contract-templates/blob/main/templates/101/deploy/3-proxy-contracts/transparent/upgrade.ts
