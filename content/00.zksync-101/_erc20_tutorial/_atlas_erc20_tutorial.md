---
title: ERC20 token with Atlas
---
## Custom ERC20 token code
    
ERC20 tokens are a standard for fungible tokens, which can be traded and represent a fixed value. You’ve used ERC20 tokens if you’ve transacted with USDC, DAI, USDT, LINK or UNI.

The ERC20 token we’re going to deploy will allow users to mint and burn tokens. The entire smart contract code is as follows:

```solidity
// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract TestToken is ERC20, Ownable, ERC20Burnable {
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        _mint(msg.sender, 100 * 10 ** decimals());
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
```

::callout{icon="i-heroicons-light-bulb"}
zkSync is EVM compatible, so you can use existing popular libraries like OpenZeppelin.
::

The most important features are:

- `Ownable` : this extension sets the deployer account as owner of the smart contract. It also introduces the `onlyOwner` modifier that restricts the execution of certain functions to the owner of the contract.
- `ERC20Burnable`: this extension adds the `burn` and `burnFrom` functions to the smart contract. These functions destroy tokens from a given account.
- `constructor`: called on deployment, the constructor will assign the given name and symbol to the token and mint 100 units of it to the account that deployed the contract.
- `mint` : this function creates new token units to a given account. It uses the `onlyOwner` modifier so it can only be called from the owner account.

## Deploy the smart contract

Atlas is a browser-based IDE with an integrated AI assistant that allows you to write, test and deploy smart contracts directly from your browser. Click the button below to open the project in Atlas.

<UButton
    icon="i-heroicons-code-bracket"
    size="xl"
    color="primary"
    variant="solid"
    :trailing="false"
    to="https://app.atlaszk.com/projects?template=https://github.com/uF4No/zksync-erc20&open=/contracts/TestToken.sol&chainId=300"
    target="_blank"
    >Open smart contract in Atlas</UButton>

You can see the contract in the Atlas code editor. On the right side, make sure the selected network is “zkSync Sepolia tesnet“ and click on **"Deploy"** to trigger the smart contract compilation and deployment. 

::callout{icon="i-heroicons-light-bulb"}
Behind the scenes, Atlas is using the zkSync Era custom solidity compiler (named `zksolc` ) to generate ZKEVM compatible bytecode. [Learn more about zkSync custom compilers]().
::

Once compiled sign the transaction with your wallet and wait until its processed. You’ll see the contract in the **“Deployed contracts”** section. 

## Interact with the ERC20 contract

In the `scripts` folder you can find the `interact.ts`  script containing the following code:

```ts
import { AtlasEnvironment } from "atlas-ide";
import TokenArtifact from "../artifacts/TestToken";
import * as ethers from "ethers";

// Address of the ERC20 token contract
const TOKEN_CONTRACT_ADDRESS = ""
// Wallet that will receive tokens
const RECEIVER_WALLET    = "";
// Amount of tokens to mint in ETH format, e.g. 1.23
const TOKEN_AMOUNT    = "";

export async function main (atlas: AtlasEnvironment) {
  const provider = new ethers.providers.Web3Provider(atlas.provider);
  const wallet = provider.getSigner();

  // initialise token contract with address, abi and signer
  const tokenContract= new ethers.Contract(TOKEN_CONTRACT_ADDRESS, TokenArtifact.TestToken.abi, wallet);

  console.log("Minting tokens...");
  const tx = await tokenContract.mint(RECEIVER_WALLET, ethers.utils.parseEther(TOKEN_AMOUNT));
  await tx.wait();
  

  console.log("Success!");
  console.log(`The account ${RECEIVER_WALLET} now has ${await tokenContract.balanceOf(RECEIVER_WALLET)} tokens`)

}
```

This scripts uses `ethers` to interact with the contract we’ve just deployed. 

::callout{icon="i-heroicons-light-bulb"}
Existing libraries like `ethers` , `viem` and `web3.js` can be used to interact with smart contracts deployed on zkSync.
::

Fill the following variables:

- `TOKEN_CONTRACT_ADDRESS`: the contract address of the ERC20 token we just deployed.
- `RECEIVER_WALLET`: address of a different account that will receive new tokens.
- `TOKEN_AMOUNT`: the amount of tokens we’ll send to the account.

With the `interact.ts` file open in the Atlas editor, click on the “Deploy” button to run the script and see the output in the terminal.

![ERC20 interact script in Atlas](/images/101-erc20/atlas-erc20-interact.png)

To confirm the account has received the tokens, visit the zkSync Sepolia explorer and search the receiver wallet address. You’ll see the new token balance in the assets table:

![ERC20 tokens in account balance](/images/101-erc20/erc20-tokens-minted.png)
