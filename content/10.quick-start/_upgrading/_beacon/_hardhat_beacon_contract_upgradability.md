---
title: Hardhat | Contract Upgrading
---

Hardhat is an Ethereum development environment, designed for easy smart contract development in Solidity.
zkSync provides its own plugins which makes working with contracts on zkSync simple and efficient.

## Step 1: Setting up environment
:display-partial{path = "/_partials/_environment-setup-with-zksync-cli"}

## Step 2: Set up wallet

Deploying contracts on the zkSync Sepolia testnet requires having testnet ETH.
If you're working within the local development environment,
you can utilize pre-configured rich wallets and skip this step.
For testnet deployments, follow these steps to secure your funds:

:display-partial{path = "/_partials/_setting-up-your-wallet"}

## Step 3: Adapting `CrowdfundingCampaign.sol` contract for upgradability

To adapt our `CrowdfundingCampaign.sol` contract for upgradability, we are
transitioning to a proxy pattern. This approach separates the
contract's logic (which can be upgraded) from its persistent state
(stored in the proxy).

### Refactoring for Proxy Compatibility

We're refactoring the contract to initialize state variables through an
`initialize` function instead of the constructor, in line with the
proxy pattern.

**Updated Contract Structure:**

```solidity
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
- **Transparent Proxy Pattern**: Utilizes a proxy contract to delegate calls to this logic contract,
allowing for future upgrades without losing the contract's state.

This restructuring prepares the `CrowdfundingCampaign` contract for upgradeability.

## Step 4: Deploy the `CrowdfundingCampaign` contract

This initial deployment sets the stage for future upgrades, enabling us
to iterate on the contract's functionality without starting from scratch.
As modifications have been made to the contract to support upgradability,
a fresh compilation is necessary to reflect these changes in the deployment artifact.

To compile the contracts in the project, run the following command:

::code-group

```bash [yarn]
yarn compile
```

```bash [pnpm]
pnpm run compile
```

```bash [npm]
npm run compile
```

```bash [bun]
bun run compile
```

::

#### Expected Output

Upon successful compilation, you'll receive output detailing the
`zksolc` and `solc` versions used during compiling and the number
of Solidity files compiled.

```bash
Compiling contracts for zkSync Era with zksolc v1.4.0 and solc v0.8.17
Compiling 1 Solidity file
Successfully compiled 1 Solidity file
```

The compiled artifacts will be located in the `/artifacts-zk` folder.

### Deploy

This guide details the process for deploying the upgraded `CrowdfundingCampaign`
contract, now enhanced with upgradability features.
You'll find the necessary deployment script at `/deploy/deployBeaconProxy.ts`.

```typescript
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

#### Deploy contract
Execute the deployment command corresponding to your package manager. The default command
deploys to the configured network in your Hardhat setup. For local deployment, append
`--network inMemoryNode` to deploy to the local in-memory node running.

::code-group

```bash [yarn]
yarn hardhat deploy-zksync --script deployBeaconProxy.ts
# To deploy the contract on local in-memory node:
# yarn hardhat deploy-zksync --script deployBeaconProxy.ts --network inMemoryNode
```

```bash [pnpm]
pnpm run hardhat deploy-zksync --script deployBeaconProxy.ts
# To deploy the contract on local in-memory node:
# pnpm run hardhat deploy-zksync --script deployBeaconProxy.ts --network inMemoryNode
```

```bash [npm]
npm run hardhat deploy-zksync --script deployBeaconProxy.ts
# To deploy the contract on local in-memory node:
# npm run hardhat deploy-zksync --script deployBeaconProxy.ts --network inMemoryNode
```

```bash [bun]
bun run hardhat deploy-zksync --script deployBeaconProxy.ts
# To deploy the contract on local in-memory node:
# bun run hardhat deploy-zksync --script deployBeaconProxy.ts --network inMemoryNode
```

::

#### Expected Output

Upon successful deployment, you'll receive output detailing the deployment process,
including the contract addresses of the implementation
contract, the admin contract, and the beacon
proxy contract.

```bash
Beacon impl deployed at 0xE3F814fa915A75bA47230537726C99f6517Da58e
Beacon deployed at:  0x26410Bebf5Df7398DCBC5f00e9EBBa0Ddf471C72
Beacon proxy deployed at:  0xD58FA9Fb362Abf69cFc68A3545fD227165DAc167
```

## Step 5: Upgrading the `CrowdfundingCampaign` Contract

With our initial setup deployed, we're ready to upgrade our `CrowdfundingCampaign.sol`
contract by incorporating a deadline for contributions. This addition not only brings
a new layer of functionality but also introduces the concept of time-based conditions
through a `modifier`.

**Current Contract Overview:**

The existing version of our contract allows for open-ended contributions towards a
funding goal, without any time constraints.

**Proposed Upgrade:**

We're introducing a `deadline` variable, initialized at contract deployment, to establish a
clear timeframe for accepting contributions. The `withinDeadline` modifier will then enforce
this constraint, ensuring contributions are made within the allowed period.

**Enhanced Contract:**

The upgraded contract, `CrowdfundingCampaignV2.sol`, located in the `/contracts` directory,
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

```solidity
function extendDeadline(uint256 _newDuration) public {
    require(msg.sender == owner, "Only the owner can extend the deadline");
    deadline = block.timestamp + _newDuration;
}
```

This upgrade not only introduces the element of time to the campaign but also
exemplifies the use of `modifiers` for enforcing contract conditions.

### Compile contract

:display-partial{path = "/_partials/_compile-solidity-contracts"}

#### Expected Output

Upon successful compilation, you'll receive output detailing the
`zksolc` and `solc` versions used during compiling and the number
of Solidity files compiled.

```bash
Compiling contracts for zkSync Era with zksolc v1.4.0 and solc v0.8.17
Compiling 2 Solidity file
Successfully compiled 2 Solidity file
```

The compiled artifacts will be located in the `/artifacts-zk` folder.

### Upgrading to `CrowdfundingCampaignV2`

This section describes the initiating the upgrade to `CrowdfundingCampaignV2.sol` contract. Let's
start by reviewing the `upgradeBeaconCrowdfundingCampaign.ts` script in the `deploy/upgrade-scripts` directory:

```typescript
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

Ensure to replace `YOUR_BEACON_ADDRESS_HERE` with the address of your deployed beacon and
`YOUR_PROXY_ADDRESS_HERE` with the actual address of your
deployed Beacon Proxy from the previous deployment step.

**Key Components:**

- **`upgradeBeacon`**: This method from the `hre.zkUpgrades` module is used to update the beacon contract
with the new version of the contract logic, `CrowdfundingCampaignV2`.
It ensures that all proxies pointing to this beacon will now execute the updated contract code.
- **`initializeV2`:** This method is specifically called post-upgrade to initialize or reconfigure any new state
variables or logic introduced in the `CrowdfundingCampaignV2`.
Here, it's used to set a new campaign duration, seamlessly
integrating new functionalities while retaining the existing contract state and funds.

#### Upgrade contract
Execute the test command corresponding to your package manager:

::code-group

```bash [yarn]
yarn hardhat deploy-zksync --script upgrade-scripts/upgradeBeaconCrowdfundingCampaign.ts
```

```bash [pnpm]
pnpm run hardhat deploy-zksync --script upgrade-scripts/upgradeBeaconCrowdfundingCampaign.ts
```

```bash [npm]
npm run hardhat deploy-zksync --script upgrade-scripts/upgradeBeaconCrowdfundingCampaign.ts
```

```bash [bun]
bun run hardhat deploy-zksync --script upgrade-scripts/upgradeBeaconCrowdfundingCampaign.ts
```

::

#### Expected Output

Upon successful deployment, you'll receive output detailing the upgrade process,
including the new beacon address, and transaction hash:

```bash
New beacon impl deployed at 0x58BD5adb462CF087E5838d53aE38A3Fe0EAf7A31
Successfully upgraded crowdfundingCampaign to crowdfundingCampaignV2 0x26410Bebf5Df7398DCBC5f00e9EBBa0Ddf471C72
CrowdfundingCampaignV2 initialized! 0x5f3131c77fcac19390f5f644a3ad1f0e7719dee4b4b5b4746c992de00db743f7
Fundraising goal: 100000000000000000
```

## Step 6: Verify upgradable contracts

For the verification of our upgradable contracts, it's essential to utilize the proxy address that was specified in our
upgrade script.

To proceed with verification, execute the following command:

::code-group

```bash [yarn]
yarn hardhat verify <BEACON-PROXY-ADDRESS>
```

```bash [pnpm]
pnpm run hardhat verify <BEACON-PROXY-ADDRESS>
```

```bash [npm]
npm run hardhat verify <BEACON-PROXY-ADDRESS>
```

```bash [bun]
bun run hardhat verify <BEACON-PROXY-ADDRESS>
```

::

#### Expected Output

Upon successful verification, you'll receive output detailing the verification process:

```bash
Verifying implementation: 0x58BD5adb462CF087E5838d53aE38A3Fe0EAf7A31
Your verification ID is: 10547
Contract successfully verified on zkSync block explorer!
Verifying beacon: 0x26410Bebf5Df7398DCBC5f00e9EBBa0Ddf471C72
Your verification ID is: 10548
Contract successfully verified on zkSync block explorer!
Verifying beacon proxy: 0xD58FA9Fb362Abf69cFc68A3545fD227165DAc167
Your verification ID is: 10549
Contract successfully verified on zkSync block explorer!
```

🎉 Congratulations! The `CrowdfundingCampaignV2` contract has been upgraded and verified!
