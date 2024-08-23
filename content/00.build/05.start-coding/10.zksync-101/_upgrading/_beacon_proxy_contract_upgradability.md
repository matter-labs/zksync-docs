---
title: Beacon Proxy Contract Upgradeability
---

### What is a beacon proxy upgradeable contract?
Beacon Proxy Upgradeable Contracts allows
for centralized logic updates across multiple proxies.
The structure includes:

1. **Beacon Contract**: Acts as the central point holding the address of the current logic contract.
It enables updating the logic for all associated proxies through a single transaction.
1. **Proxy Contracts**: These lightweight contracts delegate calls to the logic contract address
provided by the beacon, maintaining their own state and balance.
1. **Logic Contract**: Contains the executable business logic, which can be updated by changing
the beacon's reference without altering individual proxies.
1. **Admin Address**: Authorized to update the logic contract address in the beacon, ensuring controlled and secure upgrades.

This arrangement allows multiple proxy contracts to be upgraded simultaneously by updating
the logic contract address in the beacon, streamlining the upgrade process. It preserves
the state and balance of each proxy contract, offering an efficient way to roll out new
features or fixes while maintaining a uniform interface for users.

---

## Adapt the Crowdfunding Campaign contract for upgradeability

To adapt our Crowdfunding Campaign contract for upgradeability, we are
transitioning to a proxy pattern. This approach separates the
contract's logic (which can be upgraded) from its persistent state
(stored in the proxy).

In the `contracts/3-proxy-contracts/beacon` directory you'll observe the refactored
[`BeaconCrowdfundingCampaign` contract][beacon-crowdfunding-campaign-sol]
which initializes state variables through an
`initialize` function instead of the constructor, in line with the proxy pattern.

**Key Modifications:**

- **Initializable**: Inherits from OpenZeppelin's `Initializable` to ensure the `initialize` function
can only be called once, similar to a constructor.
- **Initialize Function**: Replaces the constructor for setting initial state, facilitating upgrades
through new logic contracts.
- **Proxy Pattern**: Utilizes a proxy contract to delegate calls to this logic contract,
allowing for future upgrades without losing the contract's state.

This restructuring prepares the `BeaconCrowdfundingCampaign` contract for upgradeability.

---

## Compile the `BeaconCrowdfundingCampaign` contract

Now that the `BeaconCrowdfundingCampaign` contract is adapted for contract upgradeability, let's proceed to deploy
the contract so we may upgrade it in later steps.

To compile the contracts in the project, run the following command:

```bash [npm]
npm run compile
```

## Deploy the beacon and contract

You'll find the necessary deployment script at [`deploy/3-proxy-contracts/beacon/deploy.ts`][deploy-script].

**Key Components:**

- **`deployBeacon` Method:** Initiates the deployment of a beacon contract,
which acts as a central point for managing future upgrades of the `BeaconCrowdfundingCampaign`
contract. The beacon's address is a critical component as it links the deployed proxy
to the actual contract logic.

- **`deployBeaconProxy` Method:** This step involves deploying the beacon proxy,
which serves as the user-facing contract instance. It references the beacon for its logic,
allowing for seamless upgrades without altering the proxy's address.

Run the following command to deploy our contract with a beacon proxy:

```bash [npm]
npm run deploy:beacon-proxy
```

Upon successful deployment, you'll receive output detailing the deployment process,
including the contract addresses of the implementation
contract, the admin contract, and the beacon
proxy contract.

```bash
Beacon impl deployed at 0xE3F814fa915A75bA47230537726C99f6517Da58e
Beacon deployed at:  0x26410Bebf5Df7398DCBC5f00e9EBBa0Ddf471C72
Beacon proxy deployed at:  0xD58FA9Fb362Abf69cFc68A3545fD227165DAc167
```

---

## Compile the `V2_BeaconCrowdfundingCampaign` Contract

With our initial setup deployed, we're ready to upgrade our `BeaconCrowdfundingCampaign.sol`
contract by incorporating a deadline for contributions. This addition not only brings
a new layer of functionality but also introduces the concept of time-based conditions
through a [`modifier`](https://docs.soliditylang.org/en/latest/contracts.html#function-modifiers).

**Current Contract Overview:**

The existing version of our contract allows for open-ended contributions towards a
funding goal, without any time constraints.

**Proposed Upgrade:**

We're introducing a `deadline` variable, initialized at contract deployment, to establish a
clear timeframe for accepting contributions.
The `withinDeadline` modifier will then enforce this constraint,
ensuring contributions are made within the allowed period.

**Enhanced Contract:**

The upgraded contract, [`V2_BeaconCrowdfundingCampaign.sol`][v2-beacon-crowdfunding-campaign-sol],
located in the `/contracts/3-proxy-contracts/beacon` directory,
incorporates these changes:

- **Deadline Variable:** A new state variable deadline defines the campaign's end time,
enhancing the contract with time-based logic.

- **Initialization Logic:** An additional initialization method, `initializeV2`, sets the deadline
based on a duration provided during the upgrade. This function ensures that the upgrade is
backward-compatible and maintains the contract's integrity.

- **Contribution Logic with Deadline:** The `contribute` method now includes a `withinDeadline` modifier,
ensuring all contributions are made within the set timeframe.

- **Deadline Enforcement:** The `withinDeadline` modifier checks the current time against the deadline in the `contribute` method,
safeguarding the contract from late contributions.

**Deadline Extension Capability:**

To provide flexibility, a new method `extendDeadline` allows the owner to extend the deadline,
offering adaptability to changing campaign needs.

### Compile the `V2_UUPSCrowdfundingCampaign` contract

Run the npm script `compile` to compile the contracts:

```bash [npm]
npm run compile
```

## Deploy the upgrade to `V2_BeaconCrowdfundingCampaign`

This section describes the upgrade process to the `V2_BeaconCrowdfundingCampaign.sol` contract. Let's
start by reviewing the [`deploy/3-proxy-contracts/beacon/upgrade.ts`][upgrade-script]
script.

Make sure to replace `YOUR_BEACON_ADDRESS_HERE` with the address of your deployed beacon and
`YOUR_PROXY_ADDRESS_HERE` with the actual address of your
deployed Beacon Proxy from the previous deployment step.

**Key Components:**

- **`upgradeBeacon`**: This method from the `hre.zkUpgrades` module is used to update the beacon contract
with the new version of the contract logic, `V2_BeaconCrowdfundingCampaign`.
It ensures that all proxies pointing to this beacon will now execute the updated contract code.
- **`initializeV2`:** This method is specifically called post-upgrade to initialize or reconfigure any new state
variables or logic introduced in the `V2_BeaconCrowdfundingCampaign`.
Here, it's used to set a new campaign duration, seamlessly
integrating new functionalities while retaining the existing contract state and funds.

Run the upgrade npm script:

```bash [npm]
npm run upgrade:beacon-proxy
```

Upon successful deployment, you'll receive output detailing the upgrade process,
including the new beacon address, and transaction hash:

```bash
New beacon impl deployed at 0x58BD5adb462CF087E5838d53aE38A3Fe0EAf7A31
Successfully upgraded crowdfundingCampaign to crowdfundingCampaignV2 0x26410Bebf5Df7398DCBC5f00e9EBBa0Ddf471C72
CrowdfundingCampaignV2 initialized! 0x5f3131c77fcac19390f5f644a3ad1f0e7719dee4b4b5b4746c992de00db743f7
Fundraising goal: 100000000000000000
```

---

## Verify upgradeable contracts

::callout{icon="i-heroicons-exclamation-triangle" color="amber"}
Since we are using the in memory node for our smart contracts, we do not have the feature
available to verify the smart contract.

The following explains how you can verify an upgraded smart contract on testnet or mainnet.
::

For the verification of our upgradeable contracts, it's essential to utilize the proxy address that was specified in our
upgrade script.

To proceed with verification, execute the following command:

```bash [npm]
npx hardhat verify <YOUR_BEACON_PROXY_HERE>
```

Upon successful verification, you'll receive output detailing the verification process:

```bash
Verifying implementation: 0x58BD5adb462CF087E5838d53aE38A3Fe0EAf7A31
Your verification ID is: 10547
Contract successfully verified on ZKsync block explorer!
Verifying beacon: 0x26410Bebf5Df7398DCBC5f00e9EBBa0Ddf471C72
Your verification ID is: 10548
Contract successfully verified on ZKsync block explorer!
Verifying beacon proxy: 0xD58FA9Fb362Abf69cFc68A3545fD227165DAc167
Your verification ID is: 10549
Contract successfully verified on ZKsync block explorer!
```

[beacon-crowdfunding-campaign-sol]: https://github.com/matter-labs/zksync-contract-templates/blob/main/templates/101/contracts/3-proxy-contracts/beacon/BeaconCrowdfundingCampaign.sol
[deploy-script]: https://github.com/matter-labs/zksync-contract-templates/blob/main/templates/101/deploy/3-proxy-contracts/beacon/deploy.ts
[v2-beacon-crowdfunding-campaign-sol]: https://github.com/matter-labs/zksync-contract-templates/blob/main/templates/101/contracts/3-proxy-contracts/beacon/V2_BeaconCrowdfundingCampaign.sol
[upgrade-script]: https://github.com/matter-labs/zksync-contract-templates/blob/main/templates/101/deploy/3-proxy-contracts/beacon/upgrade.ts
