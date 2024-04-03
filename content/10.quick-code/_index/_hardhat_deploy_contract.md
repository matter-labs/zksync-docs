---
title: Hardhat | Deploy Contract
---

Hardhat is an Ethereum development environment, designed for easy smart contract development in Solidity.
zkSync provides its own plugins which makes working with contracts on zkSync simple and efficient.

## Step 1: Setting up environment
:display-partial{partial = "Environment Setup with zkSync CLI"}

## Step 2: Set up wallet

Deploying contracts on the zkSync Sepolia testnet requires having testnet ETH.
If you're working within the local development environment,
you can utilize pre-configured rich wallets and skip this step.
For testnet deployments, follow these steps to secure your funds:

:display-partial{partial = "Setting up your wallet"}

## Step 3: Deploying your first contract
:display-partial{partial = "Deploy Contract"}

Now that we have setup our environment and our wallet, we are ready to deploy our first contract!
For this tutorial we'll focus on the `/contracts/ZeekAdventures.sol` contract:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title ZeekAdventures
 * @dev Embark on adventures with Zeek, the playful cat mascot. This contract allows
 * setting and retrieving Zeek's current adventure.
 */
contract ZeekAdventures {
    // Zeek's current adventure
    string private adventure;

    // Event to announce when Zeek's adventure is set
    event AdventureSet(string newAdventure);

    /**
     * @dev Constructor to set the initial adventure upon deployment.
     * @param _initialAdventure The initial adventure Zeek will embark on.
     */
    constructor(string memory _initialAdventure) {
        adventure = _initialAdventure;
        emit AdventureSet(_initialAdventure);
    }

    /**
     * @dev Sets a new adventure for Zeek.
     * @param _newAdventure The new adventure Zeek will embark on.
     */
    function setAdventure(string memory _newAdventure) public {
        adventure = _newAdventure;
        emit AdventureSet(_newAdventure);
    }

    /**
     * @dev Returns the current adventure Zeek is on.
     * @return The current adventure of Zeek.
     */
    function currentAdventure() public view returns (string memory) {
        return adventure;
    }
}
```

### Compile contract

Smart contracts deployed to zkSync must be compiled using our custom compilers.
For this particular guide we are making use of `zksolc`.

To compile the contracts in the project, run the following command:

::code-group

```bash [yarn]
yarn compile:contracts
```

```bash [pnpm]
pnpm run compile:contracts
```

```bash [npm]
npm run compile:contracts
```

```bash [bun]
bun run compile:contracts
```

::

**You'll get the following output:**

```bash
Compiling contracts for zkSync Era with zksolc v1.4.1 and solc v0.8.23
Compiling 1 Solidity files
Successfully compiled 1 Solidity files
✨  Done in 1.55s.
```

The compiled artifacts will be located in the `/artifacts-zk` folder.

### Deploy

In this section, we’ll get to deploy the ZeekAdventure contract
onto {network}.
The script to deploy contracts is found at `/deploy/deploy.ts`.

The `contractArtifactName` defines the contract we want to deploy.Here we have it set to our contract, ZeekAdventure.
Similarly, `constructorArguments` are the arguments we need to provide to the constructor to initialize the contract.

To deploy the contract, run the following command:

::code-group

```bash [yarn]
yarn deploy
```

```bash [pnpm]
pnpm run deploy
```

```bash [npm]
npm run deploy
```

```bash [bun]
bun run deploy
```

::

**You'll get the following output:**

```bash
Starting deployment process of "ZeekAdventures"...
Estimated deployment cost: 0.0000648863 ETH

"ZeekAdventures" was successfully deployed:
 - Contract address: 0x0BaF96A7f137B05d0D35b76d59B16c86C1791D8D
 - Contract source: contracts/ZeekAdventures.sol:ZeekAdventures
 - Encoded constructor arguments: 0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000094869207468657265210000000000000000000000000000000000000000000000
```

🥳 Congratulations! You just deployed a smart contract to {network}!
