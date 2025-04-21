---
title: UUPS Proxy Contract Upgradeability
---

### What is a UUPS upgradeable contract?

UUPS (Universal Upgradeable Proxy Standard) Upgradeable Contracts embed the upgrade logic
within the contract itself, simplifying upgrades and enhancing security. The components are:

1. **Proxy Contract**: Contains minimal logic, primarily delegating calls to the implementation
contract. Unlike other proxies, it doesn't require a separate upgrade function.
1. **Implementation Contract**: Houses the business logic and the upgrade functionality,
enabling the contract to upgrade itself from within.
1. **Admin Role**: Assigned to an entity with the authority to initiate upgrades, ensuring
controlled access to the upgrade function.

In UUPS contracts, upgrades are performed by invoking the upgrade function within the
implementation contract, which updates the proxy's reference to point to a new implementation.
This self-contained approach minimizes the proxy's complexity and gas costs, while the
implementation contract's built-in upgrade mechanism ensures only authorized upgrades.
The contract's state remains intact across upgrades, facilitating continuous improvement
with a stable user experience.

---

## Adapt the crowdfunding campaign code for UUPS Upgradability

To align the Crowdfunding Campaign contract with UUPS (Universal Upgradeable Proxy Standard) upgradeability,
we're integrating OpenZeppelin's UUPSUpgradeable contracts. This method offers a more secure and gas-efficient
approach to contract upgrades by embedding the upgrade logic within the contract itself.

### Refactoring for UUPS Compatibility

We've refactored the contract to support UUPS upgradeability, ensuring the contract's logic
is upgradeable while maintaining a persistent state. This is achieved by utilizing initializer
functions and the UUPS upgrade mechanism.

**UUPS-Enabled Contract Structure:**

In the `contracts/3-proxy-contracts/uups` directory you'll find the refactored
[`UUPSCrowdfundingCampaign.sol` contract][uups-crowdfunding-campaign-sol].

**Key Adaptations:**

- **Initializable & UUPSUpgradeable**: The contract inherits from `Initializable` and `UUPSUpgradeable`,
ensuring initialization follows the proxy pattern and enabling the UUPS upgrade mechanism.
- **OwnableUpgradeable**: Utilizes `OwnableUpgradeable` to manage ownership through an initializer,
important for secure upgrade authorization.
- **_authorizeUpgrade**: A safeguard function ensuring only the contract owner can perform upgrades,
reinforcing the contract's security.

---

## Compile the `UUPSCrowdfundingCampaign` contract

Now that the `UUPSCrowdfundingCampaign` contract is adapted for contract upgradeability, let's proceed to deploy
the contract so we may upgrade it in later steps.

To compile the contracts in the project, run the following command:

:display_partial{path="/_partials/commands/_compile"}

## Deploy the updated contract

The script to deploy the `UUPSCrowdfundingCampaign` contract is located at [`/deploy/3-proxy-contracts/uups/deployUUPS.ts`][deploy-script].

**Key Components:**

- **`deployProxy` Method:** This method is responsible for deploying the `UUPSCrowdfundingCampaign`
contract as a UUPS upgradeable contract. It initializes the contract with the specified parameters,
such as the `fundingGoalInWei`, ensuring that the contract is ready for immediate use after deployment.
The use of the UUPS pattern provides a secure and efficient mechanism for future upgrades.

- **`initializer` Option:** Specifies the initialization method of the contract, in this case, `initialize`.
This is used for setting up the initial state of the contract upon deployment, particularly important
for upgradeable contracts where constructor usage is not possible.

```bash [npm]
npm run deploy:uups-proxy
```

Upon successful deployment, you'll receive output detailing the deployment process,
including the contract addresses of the implementation
contract, the admin contract, and the transparent
proxy contract.

```bash
Implementation contract was deployed to 0xF0De77041F3cF6D9C905A10ce59858b17E57E3B9
UUPS proxy was deployed to 0x56882194aAe8E4B6d18cD84e4D7B0F807e0100Cb
```

---

## Upgrade to the `V2_UUPSCrowdfundingCampaign` Contract

With our initial setup deployed, we're ready to upgrade our `UUPSCrowdfundingCampaign.sol`
contract by incorporating a deadline for contributions. This addition not only brings
a new layer of functionality but also introduces the concept of time-based conditions
through a `modifier`.

**Current Contract Overview:**

The existing version of our contract allows for open-ended contributions towards a
funding goal, without any time constraints.

**Proposed Upgrade:**

We're introducing a `deadline` variable, initialized at contract deployment, to establish a
clear timeframe for accepting contributions.
The `withinDeadline` modifier will then enforce this constraint,
ensuring contributions are made within the allowed period.

**Enhanced Contract:**

The upgraded contract, [`V2_UUPSCrowdfundingCampaign.sol`][v2-uups-crowdfunding-campaign-sol],
located in the `/contracts/3-proxy-contracts/uups` directory, incorporates these changes:

- **Deadline Variable:** A new state variable deadline defines the campaign's end time,
enhancing the contract with time-based logic.

- **Initialization Logic:** An additional initialization method, `initializeV2`, sets the deadline
based on a duration provided during the upgrade. This function ensures that the upgrade is
backward-compatible and maintains the contract's integrity.

- **Contribution Logic with Deadline:** The `contribute` method now includes a `withinDeadline` modifier,
ensuring all contributions are made within the set timeframe.

- **Deadline Enforcement:** The `withinDeadline` modifier checks that the campaign is a V2 version and checks the current time against the deadline,
safeguarding the contract from late contributions.

**Deadline Extension Capability:**

To provide flexibility, a new method `extendDeadline` allows the owner to extend the deadline,
offering adaptability to changing campaign needs.

This upgrade not only introduces the element of time to the campaign but also
demonstrates the use of [`modifiers`](https://docs.soliditylang.org/en/latest/contracts.html#function-modifiers) for enforcing contract conditions.

### Compile the `V2_UUPSCrowdfundingCampaign` contract

Run the npm script `compile` to compile the contracts:

:display_partial{path="/_partials/commands/_compile"}

### Deploy the upgrade to `V2_UUPSCrowdfundingCampaign`

This section describes upgrading from the original
crowdfunding campaign contract to the updated `V2_UUPSCrowdfundingCampaign.sol` contract.
Let's start by reviewing the [`deploy/3-proxy-contracts/uups/upgrade.ts`][upgrade-script]
script.

Replace `YOUR_PROXY_ADDRESS_HERE` with the actual address of your
deployed UUPS Proxy from the previous deployment step.

**Key Components:**

- **`upgradeProxy`:** A critical method from the `hre.zkUpgrades` module that
performs the contract upgrade. It takes the wallet, the proxy address, and the
new contract artifact as arguments to transition the proxy to use the `V2_UUPSCrowdfundingCampaign` logic.

- **`initializeV2`:** Post-upgrade, this function is invoked to initialize the new
variables or logic introduced in `V2_UUPSCrowdfundingCampaign`. In this example,
it sets a new campaign duration, illustrating how contract upgrades can add
functionalities without losing the existing state or funds.

Execute the upgrade npm script command to upgrade:

```bash [npm]
npm run upgrade:uups-proxy
```

Upon successful deployment, you'll receive output detailing the upgrade process,
including the new uups address, and transaction hash:

```bash
Contract successfully upgraded to 0x9BE22706966D717d7b0C8aEC99A1a9d1b3bFeC50 with tx 0x24ad582828b23b98d207ec7c057cd6a9c911bea22dbe85e0affd7479b00d90e9
Successfully upgraded UUPSCrowdfundingCampaign to V2_UUPSCrowdfundingCampaign
V2_UUPSCrowdfundingCampaign initialized! Transaction Hash: 0xab959f588b64dc6dee1e94d5fa0da2ae205c7438cf097d26d3ba73690e2b09e8
```

---

## Verify upgradable contracts

::callout{icon="i-heroicons-exclamation-triangle" color="amber"}
Since we are using the in-memory anvil-zksync node for our smart contracts, we do not have the feature
available to verify the smart contract.

The following explains how you can verify an upgraded smart contract on testnet or mainnet.
::

To verify our upgradable contracts we need to the proxy address we previously used in our upgrade script.
With that execute the following command:

```bash [npm]
npx hardhat verify <PROXY-ADDRESS>
```

Upon successful verification, you'll receive output detailing the verification process:

```bash
Verifying implementation: 0x9BE22706966D717d7b0C8aEC99A1a9d1b3bFeC50
Your verification ID is: 10618
Contract successfully verified on ZKsync block explorer!
Verifying proxy: 0x91921fDb0F8942c18eCeE4E3896b369ca0650483
Your verification ID is: 10619
Contract successfully verified on ZKsync block explorer!
```

[uups-crowdfunding-campaign-sol]: https://github.com/matter-labs/zksync-contract-templates/blob/main/templates/101/eravm/contracts/3-proxy-contracts/uups/UUPSCrowdfundingCampaign.sol
[deploy-script]: https://github.com/matter-labs/zksync-contract-templates/blob/main/templates/101/eravm/deploy/3-proxy-contracts/uups/deploy.ts
[v2-uups-crowdfunding-campaign-sol]: https://github.com/matter-labs/zksync-contract-templates/blob/main/templates/101/eravm/contracts/3-proxy-contracts/uups/V2_UUPSCrowdfundingCampaign.sol
[upgrade-script]: https://github.com/matter-labs/zksync-contract-templates/blob/main/templates/101/eravm/deploy/3-proxy-contracts/uups/upgrade.ts
