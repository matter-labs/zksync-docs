---
title: Foundry | Deploy Contract
---

`foundry-zksync` is a specialized fork of Foundry, tailored for zkSync.
It extends Foundry's capabilities for Ethereum app development to support zkSync,
allowing for the compilation, deployment, testing, and interaction with smart contracts on zkSync.

## Step 1: Setting up environment (todo - update)

## Step 2: Set up wallet

## Step 3: Deploying your first contract

Now that we have setup our environment and our wallet,
we are ready to deploy our first contract!
For this tutorial we'll focus on the `/src/ZeekAdventures.sol` contract:

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

To compile the contracts in the project, run the following command:

```bash
forge build --zksync
```

**You'll get the following output:**

```bash
TODO
```

The compiled artifacts will be located in the `/zkout` folder.

### Deploy

In this section, we’ll get to deploy the ZeekAdventure contract
onto {network}.
The script to deploy contracts is found at `/scripts/deploy.s.sol`.

// TODO:
@Dustin
Write foundry script for deployment. Add and explain here.

To deploy the contract, run the following command:

```bash
forge script command --zksync
```

**You'll get the following output:**

```bash
TODO
```

🥳 Congratulations! You just deployed a smart contract to {network}!
