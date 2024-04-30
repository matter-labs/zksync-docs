---
title: Hardhat | Contract Upgrading
---

<!-- TODO: @dutterbutter determine best approach to leverate ZKsync cli for project
bootstrapping for this guide series. -->
Run the following command in your terminal to initialize the project.

```sh
git clone https://github.com/dutterbutter/zksync-quickstart-guide.git
cd zksync-quickstart-guide
git checkout db/contract-upgrade
```

Install the dependencies:

::code-group

```bash [npm]
npm install
```

```bash [yarn]
yarn install
```

```bash [pnpm]
pnpm install
```

```bash [bun]
bun install
```

::

## Set up your wallet

:display-partial{path="build/quick-start/_partials/_setup-wallet"}

---

## Adapt the `CrowdfundingCampaign.sol` for UUPS Upgradability

To align the `CrowdfundingCampaign.sol` contract with UUPS (Universal Upgradeable Proxy Standard) upgradability,
we're integrating OpenZeppelin's UUPSUpgradeable contracts. This method offers a more secure and gas-efficient
approach to contract upgrades by embedding the upgrade logic within the contract itself.

### Refactoring for UUPS Compatibility

We've refactored the contract to support UUPS upgradability, ensuring the contract's logic
is upgradeable while maintaining a persistent state. This is achieved by utilizing initializer
functions and the UUPS upgrade mechanism.

**UUPS-Enabled Contract Structure:**

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Import UUPS from OpenZeppelin
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract CrowdfundingCampaign_UUPS is Initializable, UUPSUpgradeable, OwnableUpgradeable {
    uint256 public fundingGoal;
    uint256 public totalFundsRaised;
    mapping(address => uint256) public contributions;

    event ContributionReceived(address contributor, uint256 amount);
    event GoalReached(uint256 totalFundsRaised);

    // Initializer function, replaces constructor for upgradeable contracts
    function initialize(uint256 _fundingGoal) public initializer {
        __Ownable_init(); // Initialize ownership to the deployer
        __UUPSUpgradeable_init(); // Initialize UUPS upgradeability

        fundingGoal = _fundingGoal;
    }

    function contribute() public payable {
        // Contribution logic remains the same
    }

    function withdrawFunds() public onlyOwner {
        // WithdrawFunds logic remains the same
    }

    function getTotalFundsRaised() public view returns (uint256) {
        // getTotalFundsRaised remains the same
    }

    function getFundingGoal() public view returns (uint256) {
        // getFundingGoal remains the same
    }

    // Ensure only the owner can upgrade the contract
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}
```

**Key Adaptations:**

- **Initializable & UUPSUpgradeable**: The contract inherits from `Initializable` and `UUPSUpgradeable`,
ensuring initialization follows the proxy pattern and enabling the UUPS upgrade mechanism.
- **OwnableUpgradeable**: Utilizes `OwnableUpgradeable` to manage ownership through an initializer,
important for secure upgrade authorization.
- **_authorizeUpgrade**: A safeguard function ensuring only the contract owner can perform upgrades,
reinforcing the contract's security.

By adopting the UUPS pattern, the [`CrowdfundingCampaign_UUPS`](https://github.com/dutterbutter/zksync-quickstart-guide/blob/db/contract-upgrade/contracts/CrowdfundingCampaign_UUPS.sol)
contract becomes efficiently upgradeable, offering enhanced security and reduced gas costs, setting a solid foundation for future enhancements.

---

## Compile the `CrowdfundingCampaign_UUPS` contract

Now that the `CrowdfundingCampaign_UUPS` contract is adapted for contract upgradability, let's proceed to deploy
the contract so we may upgrade it in later steps. Since we've made changes to our contract we will
need to re-compile.

To compile the contracts in the project, run the following command:

::code-group

```bash [npm]
npm run compile
```

```bash [yarn]
yarn compile
```

```bash [pnpm]
pnpm run compile
```

```bash [bun]
bun run compile
```

::

Upon successful compilation, you'll receive output detailing the
`zksolc` and `solc` versions used during compiling and the number
of Solidity files compiled.

```bash
Compiling contracts for ZKsync Era with zksolc v1.4.0 and solc v0.8.17
Compiling 4 Solidity file
Successfully compiled 4 Solidity file
```

The compiled artifacts will be located in the `/artifacts-zk` folder.

## Deploy the updated contract

The script to deploy the `CrowdfundingCampaign_UUPS` contract is located at [`/deploy/deployUUPS.ts`](https://github.com/dutterbutter/zksync-quickstart-guide/blob/db/contract-upgrade/deploy/deployUUPS.ts).

```typescript
import { getWallet } from "./utils";
import { Deployer } from '@matterlabs/hardhat-zksync';
import { ethers } from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";

export default async function (hre: HardhatRuntimeEnvironment) {
    const wallet = getWallet();
    const deployer = new Deployer(hre, wallet);

    const contractArtifact = await deployer.loadArtifact("CrowdfundingCampaign_UUPS");
    const fundingGoalInWei = ethers.parseEther('0.1').toString();

    const crowdfunding = await hre.zkUpgrades.deployProxy(
        getWallet(),
        contractArtifact,
        [fundingGoalInWei],
        { initializer: 'initialize' }
    );

    await crowdfunding.waitForDeployment();
}
```

**Key Components:**

- **`deployProxy` Method:** This method is responsible for deploying the `CrowdfundingCampaign`
contract as a UUPS upgradeable contract. It initializes the contract with the specified parameters,
such as the `fundingGoalInWei`, ensuring that the contract is ready for immediate use after deployment.
The use of the UUPS pattern provides a secure and efficient mechanism for future upgrades.

- **`initializer` Option:** Specifies the initialization method of the contract, in this case, `initialize`.
This is used for setting up the initial state of the contract upon deployment, particularly important
for upgradeable contracts where constructor usage is not possible.

Execute the deployment command corresponding to your package manager. The default command
deploys to the configured network in your Hardhat setup. For local deployment, append
`--network inMemoryNode` to deploy to the local in-memory node running.

::code-group

```bash [npm]
npm run hardhat deploy-zksync --script deployUUPS.ts
# To deploy the contract on local in-memory node:
# npm run hardhat deploy-zksync --script deployUUPS.ts --network inMemoryNode
```

```bash [yarn]
yarn hardhat deploy-zksync --script deployUUPS.ts
# To deploy the contract on local in-memory node:
# yarn hardhat deploy-zksync --script deployUUPS.ts --network inMemoryNode
```

```bash [pnpm]
pnpm run hardhat deploy-zksync --script deployUUPS.ts
# To deploy the contract on local in-memory node:
# pnpm run hardhat deploy-zksync --script deployUUPS.ts --network inMemoryNode
```

```bash [bun]
bun run hardhat deploy-zksync --script deployUUPS.ts
# To deploy the contract on local in-memory node:
# bun run hardhat deploy-zksync --script deployUUPS.ts --network inMemoryNode
```

::

Upon successful deployment, you'll receive output detailing the deployment process,
including the contract addresses of the implementation
contract, the admin contract, and the transparent
proxy contract.

```bash
Implementation contract was deployed to 0xF0De77041F3cF6D9C905A10ce59858b17E57E3B9
UUPS proxy was deployed to 0x56882194aAe8E4B6d18cD84e4D7B0F807e0100Cb
```

---

## Upgrade to the `CrowdfundingCampaignV2_UUPS` Contract

With our initial setup deployed, we're ready to upgrade our `CrowdfundingCampaign_UUPS.sol`
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

The upgraded contract, [`CrowdfundingCampaignV2_UUPS.sol`](https://github.com/dutterbutter/zksync-quickstart-guide/blob/db/contract-upgrade/contracts/CrowdfundingCampaignV2_UUPS.sol),
located in the `/contracts` directory, incorporates these changes:

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

### Compile the `CrowdfundingCampaignV2_UUPS` contract

:display-partial{path = "_partials/_compile-solidity-contracts"}

Upon successful compilation, you'll receive output detailing the
`zksolc` and `solc` versions used during compiling and the number
of Solidity files compiled.

```bash
Compiling contracts for ZKsync Era with zksolc v1.4.0 and solc v0.8.17
Compiling 4 Solidity file
Successfully compiled 4 Solidity file
```

The compiled artifacts will be located in the `/artifacts-zk` folder.

### Upgrade to `CrowdfundingCampaignV2_UUPS`

This section describes the initiating the upgrade to `CrowdfundingCampaignV2_UUPS.sol` contract.
Let's start by reviewing the [`upgradeUUPSCrowdfundingCampaign.ts`](https://github.com/dutterbutter/zksync-quickstart-guide/blob/db/contract-upgrade/deploy/upgrade-scripts/upgradeUUPSCrowdfundingCampaign.ts)
script in the `deploy/upgrade-scripts` directory:

Replace `YOUR_PROXY_ADDRESS_HERE` with the actual address of your
deployed Transparent Proxy from the previous deployment step.

```typescript
import { getWallet } from "../utils";
import { Deployer } from '@matterlabs/hardhat-zksync';
import { HardhatRuntimeEnvironment } from "hardhat/types";

export default async function (hre: HardhatRuntimeEnvironment) {
    const wallet = getWallet();
    const deployer = new Deployer(hre, wallet);

    // Placeholder for the deployed proxy address
    const proxyAddress = 'YOUR_PROXY_ADDRESS_HERE';

    // Upgrade the proxy to V2
    const contractV2Artifact = await deployer.loadArtifact('CrowdfundingCampaignV2_UUPS');
    const upgradedContract = await hre.zkUpgrades.upgradeProxy(deployer.zkWallet, proxyAddress, contractV2Artifact);
    console.log('Successfully upgraded crowdfundingCampaign_UUPS to crowdfundingCampaignV2_UUPS');

    upgradedContract.connect(deployer.zkWallet);
    // wait some time before the next call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const durationInSeconds = 30 * 24 * 60 * 60; // For example, setting a 30-day duration

    const initTx = await upgradedContract.initializeV2(durationInSeconds);
    const receipt = await initTx.wait();

    console.log('CrowdfundingCampaignV2_UUPS initialized!', receipt.hash);
}
```

**Key Components:**

- **`upgradeProxy`:** A critical method from the `hre.zkUpgrades` module that
performs the contract upgrade. It takes the wallet, the proxy address, and the
new contract artifact as arguments to transition the proxy to use the `CrowdfundingCampaignV2_UUPS` logic.

- **`initializeV2`:** Post-upgrade, this function is invoked to initialize the new
variables or logic introduced in `CrowdfundingCampaignV2_UUPS`. In this example,
it sets a new campaign duration, illustrating how contract upgrades can add
functionalities without losing the existing state or funds.

Execute the test command corresponding to your package manager:

::code-group

```bash [npm]
npm run hardhat deploy-zksync --script upgrade-scripts/upgradeUUPSCrowdfundingCampaign.ts
```

```bash [yarn]
yarn hardhat deploy-zksync --script upgrade-scripts/upgradeUUPSCrowdfundingCampaign.ts
```

```bash [pnpm]
pnpm run hardhat deploy-zksync --script upgrade-scripts/upgradeUUPSCrowdfundingCampaign.ts
```

```bash [bun]
bun run hardhat deploy-zksync --script upgrade-scripts/upgradeUUPSCrowdfundingCampaign.ts
```

::

Upon successful deployment, you'll receive output detailing the upgrade process,
including the new beacon address, and transaction hash:

```bash
Contract successfully upgraded to 0x9BE22706966D717d7b0C8aEC99A1a9d1b3bFeC50 with tx 0x24ad582828b23b98d207ec7c057cd6a9c911bea22dbe85e0affd7479b00d90e9
Successfully upgraded crowdfundingCampaign_UUPS to crowdfundingCampaignV2_UUPS
CrowdfundingCampaignV2_UUPS initialized! 0xab959f588b64dc6dee1e94d5fa0da2ae205c7438cf097d26d3ba73690e2b09e8
```

---

## Verify upgradable contracts

To verify our upgradable contracts we need to the proxy address we previously used in our upgrade script.
With that execute the following command:

::code-group

```bash [npm]
npm run hardhat verify <PROXY-ADDRESS>
```

```bash [yarn]
yarn hardhat verify <PROXY-ADDRESS>
```

```bash [pnpm]
pnpm run hardhat verify <PROXY-ADDRESS>
```

```bash [bun]
bun run hardhat verify <PROXY-ADDRESS>
```

::

Upon successful verification, you'll receive output detailing the verification process:

```bash
Verifying implementation: 0x9BE22706966D717d7b0C8aEC99A1a9d1b3bFeC50
Your verification ID is: 10618
Contract successfully verified on ZKsync block explorer!
Verifying proxy: 0x91921fDb0F8942c18eCeE4E3896b369ca0650483
Your verification ID is: 10619
Contract successfully verified on ZKsync block explorer!
```

🎉 Congratulations! The `CrowdfundingCampaignV2_UUPS` contract has been upgraded and verified!
