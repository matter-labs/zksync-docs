---
title: Hardhat | Contract Upgrading
---

Run the following command in your terminal to initialize the project.

```sh
zksync-cli create --template qs-upgrade contract-upgrade-quickstart
cd contract-upgrade-quickstart
```

::callout{icon="i-heroicons-exclamation-triangle" color="amber"}
If you encounter an error while installing project dependencies using NPM as your package manager, try running `npm install --force`.
::

## Update the hardhat.config.ts

Since we are using the "In memory node" with ZKsync CLI, we need to set the default network Hardhat uses
for deploying.

Open up the `hardhat.config.ts` file and set the `defaultNetwork` to `inMemoryNode`.

```ts
// ...
const config: HardhatUserConfig = {
  defaultNetwork: "inMemoryNode",
// ...
```

---

## Adapt `CrowdfundingCampaign.sol` contract for upgradability

To adapt our `CrowdfundingCampaign.sol` contract for upgradability, we are
transitioning to a proxy pattern. This approach separates the
contract's logic (which can be upgraded) from its persistent state
(stored in the proxy).

In the `contracts/` directory you'll observe the refactored [`CrowdfundingCampaign` contract](https://github.com/matter-labs/zksync-contract-templates/blob/main/templates/quickstart/hardhat/upgradability/contracts/CrowdfundingCampaign.sol)
which initializes state variables through an
`initialize` function instead of the constructor, in line with the proxy pattern.

**Updated Contract Structure:**

```solidity [contracts/CrowdfundingCampaign.sol]
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/proxy/utils/Initializable.sol";

contract CrowdfundingCampaign is Initializable {
    address public owner;
    uint256 public fundingGoal;
    mapping(address => uint256) public contributions;

    event ContributionReceived(address contributor, uint256 amount);
    event GoalReached(uint256 totalFundsRaised);

    // Remove constructor in favour of initialize method
    function initialize(uint256 _fundingGoal) public initializer {
        owner = msg.sender;
        fundingGoal = _fundingGoal;
    }

    function contribute() public payable {
        // contribution logic remains the same
    }

    function withdrawFunds() public {
        // withdrawFunds logic remains the same
    }

    function getTotalFundsRaised() public view returns (uint256) {
        // getTotalFundsRaised remains the same
    }

    function getFundingGoal() public view returns (uint256) {
        // getFundingGoal remains the same
    }
}
```

**Key Modifications:**

- **Initializable**: Inherits from OpenZeppelin's `Initializable` to ensure the `initialize` function
can only be called once, similar to a constructor.
- **Initialize Function**: Replaces the constructor for setting initial state, facilitating upgrades
through new logic contracts.
- **Proxy Pattern**: Utilizes a proxy contract to delegate calls to this logic contract,
allowing for future upgrades without losing the contract's state.

This restructuring prepares the `CrowdfundingCampaign` contract for upgradeability.

---

## Compile the updated `CrowdfundingCampaign` contract

Now that the `CrowdfundingCampaign` contract is adapted for contract upgradability, let's proceed to deploy
the contract so we may upgrade it in later steps. Since we've made changes to our contract we will
need to re-compile.

To compile the contracts in the project, run the following command:

```bash [npm]
npm run compile
```

Upon successful compilation, you'll receive output detailing the
`zksolc` and `solc` versions used during compiling and the number
of Solidity files compiled.

```bash
Compiling contracts for ZKsync Era with zksolc v1.4.0 and solc v0.8.17
Compiling 29 Solidity file
Successfully compiled 29 Solidity file
```

The compiled artifacts will be located in the `/artifacts-zk` folder.

## Deploy the beacon and contract

You'll find the necessary deployment script at [`deploy/deployBeaconProxy.ts`](https://github.com/matter-labs/zksync-contract-templates/blob/main/templates/quickstart/hardhat/upgradability/deploy/deployBeaconProxy.ts).

```typescript [deploy/deployBeaconProxy.ts]
import { getWallet } from "./utils";
import { Deployer } from '@matterlabs/hardhat-zksync';
import { ethers } from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";

export default async function (hre: HardhatRuntimeEnvironment) {
    const wallet = getWallet();
    const deployer = new Deployer(hre, wallet);

    const contractArtifact = await deployer.loadArtifact("CrowdfundingCampaign");
    const fundingGoalInWei = ethers.parseEther('0.1').toString();

    const beacon = await hre.zkUpgrades.deployBeacon(
        getWallet(),
        contractArtifact
    );
    await beacon.waitForDeployment();

    const crowdfunding = await hre.zkUpgrades.deployBeaconProxy(deployer.zkWallet,
        await beacon.getAddress(), contractArtifact, [fundingGoalInWei]);

    await crowdfunding.waitForDeployment();
}
```

**Key Components:**

- **`deployBeacon` Method:** Initiates the deployment of a beacon contract,
which acts as a central point for managing future upgrades of the `CrowdfundingCampaign`
contract. The beacon's address is a critical component as it links the deployed proxy
to the actual contract logic.

- **`deployBeaconProxy` Method:** This step involves deploying the beacon proxy,
which serves as the user-facing contract instance. It references the beacon for its logic,
allowing for seamless upgrades without altering the proxy's address.
The `fundingGoalInWei parameter`, converted from ether to wei, is passed during
this step to initialize the contract with a funding goal.

Run the following command to deploy our contract with a beacon proxy:

```bash [npm]
npx hardhat deploy-zksync --script deployBeaconProxy.ts
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

## Compile the `CrowdfundingCampaignV2` Contract

With our initial setup deployed, we're ready to upgrade our `CrowdfundingCampaign.sol`
contract by incorporating a deadline for contributions. This addition not only brings
a new layer of functionality but also introduces the concept of time-based conditions
through a [`modifier`](https://docs.soliditylang.org/en/latest/contracts.html#function-modifiers).

**Current Contract Overview:**

The existing version of our contract allows for open-ended contributions towards a
funding goal, without any time constraints.

**Proposed Upgrade:**

We're introducing a `deadline` variable, initialized at contract deployment, to establish a
clear timeframe for accepting contributions. The `withinDeadline` modifier will then enforce
this constraint, ensuring contributions are made within the allowed period.

**Enhanced Contract:**

The upgraded contract, [`CrowdfundingCampaignV2.sol`](https://github.com/matter-labs/zksync-contract-templates/blob/main/templates/quickstart/hardhat/upgradability/contracts/CrowdfundingCampaignV2.sol),
located in the `/contracts` directory,
incorporates these changes:

- **Deadline Variable:** A new state variable deadline defines the campaign's end time,
enhancing the contract with time-based logic.

- **Initialization Logic:** An additional initialization method, `initializeV2`, sets the deadline
based on a duration provided during the upgrade. This function ensures that the upgrade is
backward-compatible and maintains the contract's integrity.

- **Contribution Logic with Deadline:** The `contribute` method now includes a `withinDeadline` modifier,
ensuring all contributions are made within the set timeframe.

- **Deadline Enforcement:** The `withinDeadline` modifier checks the current time against the deadline,
safeguarding the contract from late contributions.

**Deadline Extension Capability:**

To provide flexibility, a new function allows the owner to extend the deadline,
offering adaptability to changing campaign needs.

```solidity [CrowdfundingCampaignV2.sol]
function extendDeadline(uint256 _newDuration) public {
    require(msg.sender == owner, "Only the owner can extend the deadline");
    deadline = block.timestamp + _newDuration;
}
```

This upgrade not only introduces the element of time to the campaign but also
exemplifies the use of `modifiers` for enforcing contract conditions.

:display-partial{path = "/_partials/_compile-solidity-contracts"}

Upon successful compilation, you'll receive output detailing the
`zksolc` and `solc` versions used during compiling and the number
of Solidity files compiled.

```bash
Compiling contracts for ZKsync Era with zksolc v1.4.0 and solc v0.8.17
Compiling 4 Solidity file
Successfully compiled 4 Solidity file
```

The compiled artifacts will be located in the `/artifacts-zk` folder.

## Upgrade to `CrowdfundingCampaignV2`

This section describes the upgrade process to `CrowdfundingCampaignV2.sol` contract. Let's
start by reviewing the [`upgradeBeaconCrowdfundingCampaign.ts`](https://github.com/matter-labs/zksync-contract-templates/blob/main/templates/quickstart/hardhat/upgradability/deploy/upgrade-scripts/upgradeBeaconCrowdfundingCampaign.ts)
script in the `deploy/upgrade-scripts` directory:

Make sure to replace `YOUR_BEACON_ADDRESS_HERE` with the address of your deployed beacon and
`YOUR_PROXY_ADDRESS_HERE` with the actual address of your
deployed Beacon Proxy from the previous deployment step.

```typescript [upgradeBeaconCrowdfundingCampaign.ts]
import { getWallet } from "../utils";
import { Deployer } from '@matterlabs/hardhat-zksync';
import { HardhatRuntimeEnvironment } from "hardhat/types";
import * as zk from 'zksync-ethers';
import { Contract } from 'ethers';

export default async function (hre: HardhatRuntimeEnvironment) {
    const wallet = getWallet();
    const deployer = new Deployer(hre, wallet);

    // Placeholder for the deployed beacon address
    const beaconAddress = 'YOUR_BEACON_ADDRESS_HERE';

    const contractV2Artifact = await deployer.loadArtifact('CrowdfundingCampaignV2');

    // Upgrade the proxy to V2
    await hre.zkUpgrades.upgradeBeacon(deployer.zkWallet, beaconAddress, contractV2Artifact);

    console.log('Successfully upgraded crowdfundingCampaign to crowdfundingCampaignV2');

    const attachTo = new zk.ContractFactory<any[], Contract>(
        crowdfundingCampaignV2.abi,
        crowdfundingCampaignV2.bytecode,
        deployer.zkWallet,
        deployer.deploymentType,
    );

    // Placeholder for the deployed beacon proxy address
    const proxyAddress = 'YOUR_PROXY_ADDRESS_HERE';

    const upgradedContract  = attachTo.attach(proxyAddress);

    upgradedContract.connect(deployer.zkWallet);
    // wait some time before the next call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Initialize V2 with a new campaign duration
    const durationInSeconds = 30 * 24 * 60 * 60; // For example, setting a 30-day duration
    const initTx = await upgradedContract.initializeV2(durationInSeconds);
    const receipt = await initTx.wait();

   console.log(`CrowdfundingCampaignV2 initialized. Transaction Hash: ${receipt.hash}`);
}
```

**Key Components:**

- **`upgradeBeacon`**: This method from the `hre.zkUpgrades` module is used to update the beacon contract
with the new version of the contract logic, `CrowdfundingCampaignV2`.
It ensures that all proxies pointing to this beacon will now execute the updated contract code.
- **`initializeV2`:** This method is specifically called post-upgrade to initialize or reconfigure any new state
variables or logic introduced in the `CrowdfundingCampaignV2`.
Here, it's used to set a new campaign duration, seamlessly
integrating new functionalities while retaining the existing contract state and funds.

Execute the test command corresponding to your package manager:

::code-group

```bash [npm]
npx hardhat deploy-zksync --script upgrade-scripts/upgradeBeaconCrowdfundingCampaign.ts
```

```bash [yarn]
yarn hardhat deploy-zksync --script upgrade-scripts/upgradeBeaconCrowdfundingCampaign.ts
```

```bash [pnpm]
pnpm exec hardhat deploy-zksync --script upgrade-scripts/upgradeBeaconCrowdfundingCampaign.ts
```

```bash [bun]
bun run hardhat deploy-zksync --script upgrade-scripts/upgradeBeaconCrowdfundingCampaign.ts
```

::

Upon successful deployment, you'll receive output detailing the upgrade process,
including the new beacon address, and transaction hash:

```bash
New beacon impl deployed at 0x58BD5adb462CF087E5838d53aE38A3Fe0EAf7A31
Successfully upgraded crowdfundingCampaign to crowdfundingCampaignV2 0x26410Bebf5Df7398DCBC5f00e9EBBa0Ddf471C72
CrowdfundingCampaignV2 initialized! 0x5f3131c77fcac19390f5f644a3ad1f0e7719dee4b4b5b4746c992de00db743f7
Fundraising goal: 100000000000000000
```

---

## Verify upgradable contracts

::callout{icon="i-heroicons-exclamation-triangle" color="amber"}
Since we are using inMemoryNode for our smart contracts, we do not have the feature
available to verify the smart contract.

The following explains how you will need to verify an upgraded smart contract on testnet or mainnet.
::

For the verification of our upgradable contracts, it's essential to utilize the proxy address that was specified in our
upgrade script.

To proceed with verification, execute the following command:

```bash [npm]
npx hardhat verify <BEACON-PROXY-ADDRESS>
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

🎉 Congratulations! The `CrowdfundingCampaignV2` contract has been upgraded and verified!
