---
title: Hardhat | Contract Upgrading
---

Hardhat is an Ethereum development environment, designed for easy smart contract development in Solidity.
zkSync provides its own plugins which makes working with contracts on zkSync simple and efficient.

## Step 1: Setting up environment
:display-partial{path = "/_partials/_environment-setup-with-zksync-cli"}
<!-- TODO: @dutterbutter determine best approach to leverate zksync cli for project
bootstrapping for this guide series. -->
::drop-panel
  ::panel{label="Initialize project"}
    Run the following command in your terminal to initialize the project.

    ```sh
    git clone https://github.com/dutterbutter/zksync-quickstart-guide.git
    cd zksync-quickstart-guide
    git checkout db/contract-upgrade
    ```
    Install the dependencies:

    ::code-group

    ```bash [yarn]
    yarn install
    ```

    ```bash [pnpm]
    pnpm run install
    ```

    ```bash [npm]
    npm run install
    ```

    ```bash [bun]
    bun run install
    ```

    ::
  ::
::

## Step 2: Set up wallet

Deploying contracts on the zkSync Sepolia testnet requires having testnet ETH.
If you're working within the local development environment,
you can utilize pre-configured rich wallets and skip this step.
For testnet deployments, follow these steps to secure your funds:

:display-partial{path = "/_partials/_environment-setup-with-zksync-cli"}

## Step 3: Adapting `CrowdfundingCampaign.sol` contract for upgradability

To adapt our `CrowdfundingCampaign.sol` contract for upgradability, we're
transitioning to a proxy pattern. This approach separates the
contract's logic (which can be upgraded) from its persistent state
(stored in the proxy).

### Refactoring for Proxy Compatibility

In the `contracts/` directory you'll observe the refactored the contract
which initializes state variables through an
`initialize` function instead of the constructor, in line with the
Transparent Proxy pattern.

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

This restructuring prepares the `CrowdfundingCampaign` contract for upgradability.

## Step 4: Deploy the `CrowdfundingCampaign` contract

Now that the `CrowdfundingCampaign` contract is adapted for contract upgradability, let's proceed to deploy
the contract so we may upgrade it in later steps. Since we've made changes to our contract we will
need to re-compile.

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

This section outlines the steps to deploy the `CrowdfundingCampaign` contract that we recently updated for upgradability.
The deployment script is located at `/deploy/deployTransparentProxy.ts`.

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
    // Deploy the contract using a transparent proxy
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

- **`hre.zkUpgrades.deployProxy`**: The method call to deploy the `CrowdfundingCampaign`
contract via a transparent proxy, leveraging Hardhat's runtime environment for zkSync upgrades.
This ensures the deployed contract can be upgraded in the future without losing its state or funds.
- **`initializer`**: Specifies the initialization method of the contract, `initialize` in this case,
which is required for setting up the proxy's state upon deployment.

#### Deploy contract
Execute the deployment command corresponding to your package manager. The default command
deploys to the configured network in your Hardhat setup. For local deployment, append
`--network inMemoryNode` to deploy to the local in-memory node running.

::code-group

```bash [yarn]
yarn hardhat deploy-zksync --script deployTransparentProxy.ts
# To deploy the contract on local in-memory node:
# yarn hardhat deploy-zksync --script deployTransparentProxy.ts --network inMemoryNode
```

```bash [pnpm]
pnpm run hardhat deploy-zksync --script deployTransparentProxy.ts
# To deploy the contract on local in-memory node:
# pnpm run hardhat deploy-zksync --script deployTransparentProxy.ts --network inMemoryNode
```

```bash [npm]
npm run hardhat deploy-zksync --script deployTransparentProxy.ts
# To deploy the contract on local in-memory node:
# npm run hardhat deploy-zksync --script deployTransparentProxy.ts --network inMemoryNode
```

```bash [bun]
bun run hardhat deploy-zksync --script deployTransparentProxy.ts
# To deploy the contract on local in-memory node:
# bun run hardhat deploy-zksync --script deployTransparentProxy.ts --network inMemoryNode
```

::

#### Expected Output

Upon successful deployment, you'll receive output detailing the deployment process,
including the contract addresses of the implementation
contract, the admin contract, and the transparent
proxy contract.

```bash
Implementation contract was deployed to 0xE3F814fa915A75bA47230537726C99f6517Da58e
Admin was deployed to 0x05198D9f93cBDfa3e332776019115512d8e0c809
Transparent proxy was deployed to 0x68E8533acE01019CB8D07Eca822369D5De71b74D
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

This section guides you through upgrading the `CrowdfundingCampaign` contract
to its second version, `CrowdfundingCampaignV2`. Review the `upgradeCrowdfundingCampaign.ts`
script located within the `deploy/upgrade-scripts` directory to begin.

```typescript
import { getWallet } from "../utils";
import { Deployer } from '@matterlabs/hardhat-zksync';
import { HardhatRuntimeEnvironment } from "hardhat/types";

export default async function (hre: HardhatRuntimeEnvironment) {
    const wallet = getWallet();
    const deployer = new Deployer(hre, wallet);
    
    // Placeholder for the deployed proxy address
    const proxyAddress = 'YOUR_PROXY_ADDRESS_HERE';
    
    const contractV2Artifact = await deployer.loadArtifact('CrowdfundingCampaignV2');

    // Upgrade the proxy to V2
    const upgradedContract = await hre.zkUpgrades.upgradeProxy(deployer.zkWallet, proxyAddress, contractV2Artifact);

    console.log('Successfully upgraded crowdfundingCampaign to crowdfundingCampaignV2');

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

Ensure to replace `YOUR_PROXY_ADDRESS_HERE` with the actual address of your
deployed Transparent Proxy from the previous deployment step.

**Key Components:**

- **`upgradeProxy`:** A critical method from the `hre.zkUpgrades` module that
performs the contract upgrade. It takes the wallet, the proxy address, and the
new contract artifact as arguments to transition the proxy to use the `CrowdfundingCampaignV2` logic.

- **`initializeV2`:** Post-upgrade, this function is invoked to initialize the new
variables or logic introduced in `CrowdfundingCampaignV2`. In this example,
it sets a new campaign duration, illustrating how contract upgrades can add
functionalities without losing the existing state or funds.

#### Upgrade contract
Execute the command corresponding to your package manager:

::code-group

```bash [yarn]
yarn hardhat deploy-zksync --script upgrade-scripts/upgradeCrowdfundingCampaign.ts
```

```bash [pnpm]
pnpm run hardhat deploy-zksync --script upgrade-scripts/upgradeCrowdfundingCampaign.ts
```

```bash [npm]
npm run hardhat deploy-zksync --script upgrade-scripts/upgradeCrowdfundingCampaign.ts
```

```bash [bun]
bun run hardhat deploy-zksync --script upgrade-scripts/upgradeCrowdfundingCampaign.ts
```

::

#### Expected Output

Upon successful deployment, you'll receive output detailing the upgrade process,
including the contract address, and transaction hash:

```bash
Contract successfully upgraded to 0x58BD5adb462CF087E5838d53aE38A3Fe0EAf7A31 with tx 0xe30c017c52376507ab55bb51bc27eb300832dc46b8b9ac14549d2f9014cee97e
Successfully upgraded crowdfundingCampaign to crowdfundingCampaignV2
CrowdfundingCampaignV2 initialized! 0x5adfe360187195d98d3603a82a20ffe7304cd4dec030d1bdf456fa1690879668
Fundraising goal: 100000000000000000
```

## Step 6: Verify upgradable contracts

For the verification of our upgradable contracts, it's essential to utilize the proxy address that was specified in our
upgrade script.

To proceed with verification, execute the following command:

::code-group

```bash [yarn]
yarn hardhat verify <PROXY-ADDRESS>
```

```bash [pnpm]
pnpm run hardhat verify <PROXY-ADDRESS>
```

```bash [npm]
npm run hardhat verify <PROXY-ADDRESS>
```

```bash [bun]
bun run hardhat verify <PROXY-ADDRESS>
```

::

Ensure to replace <PROXY_ADDRESS> with the actual proxy address from your deployment.

#### Expected Output

Upon successful verification, you'll receive output detailing the verification process:

```bash
Verifying implementation: 0x58BD5adb462CF087E5838d53aE38A3Fe0EAf7A31
Your verification ID is: 10543
Contract successfully verified on zkSync block explorer!
Verifying proxy: 0x68E8533acE01019CB8D07Eca822369D5De71b74D
Your verification ID is: 10544
Contract successfully verified on zkSync block explorer!
Verifying proxy admin: 0x05198D9f93cBDfa3e332776019115512d8e0c809
Your verification ID is: 10545
Contract successfully verified on zkSync block explorer!
```

🎉 Congratulations! The `CrowdfundingCampaignV2` contract has been upgraded and verified!
