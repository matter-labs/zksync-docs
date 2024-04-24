---
title: ERC20 with Remix
---
## Custom ERC20 token code

ERC20 tokens are a standard for fungible tokens, which can be traded and represent a fixed value. You’ve used ERC20
tokens if you’ve transacted with USDC, DAI, USDT, LINK or UNI.

The ERC20 token we’re going to deploy will allow users to mint and burn tokens. The entire smart contract code is as
follows:

```solidity
// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract TestToken is ERC20, Ownable, ERC20Burnable {
    constructor(string memory name, string memory symbol) 
      ERC20(name, symbol) Ownable(msg.sender) {
        _mint(msg.sender, 100 * 10 ** decimals());
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
```

::callout{icon="i-heroicons-light-bulb"}
zkSync is [EVM compatible](/build/resources/glossary#evm-compatible), so you can use existing popular libraries like OpenZeppelin.
::

The most important features are:

- `Ownable` : this extension sets the deployer account as owner of the smart contract. It also introduces the
  `onlyOwner` modifier that restricts the execution of certain functions to the owner of the contract.
- `ERC20Burnable`: this extension adds the `burn` and `burnFrom` functions to the smart contract. These functions
  destroy tokens from a given account.
- `constructor`: called on deployment, the constructor will assign the given name and symbol to the token and mint 100
  units of it to the account that deployed the contract.
- `mint` : this function creates new token units to a given account. It uses the `onlyOwner` modifier so it can only be
  called from the owner account.

## Deploy the smart contract

The Remix IDE is an open-source web and desktop application that supports Ethereum smart contract development and
deployment, offering tools for writing, testing, debugging, and deploying smart contracts written in Solidity to EVM
compatible protocols.

:display-partial{path="/_partials/_enable-remix-zksync-plugin"}

Click the button below to open the project in Remix and see the contract in the Remix code editor.

<UButton
    icon="i-heroicons-code-bracket"
    size="xl"
    color="primary"
    variant="solid"
    :trailing="false"
    to="https://remix.ethereum.org/#url=https://github.com/uF4No/zksync-101-remix/blob/main/contracts/TestToken.sol"
    target="_blank"
    >Open smart contract in Remix</UButton>

To compile the contract, click on  Compile TestToken.sol. If you get a popup message requesting permissions to access
**`ACCESS TO "WRITEFILE" OF "FILE MANAGER"`,** click on Accept.

::callout{icon="i-heroicons-light-bulb"}
Behind the scenes, Remix is using the zkSync Era custom solidity compiler (named `zksolc` ) to generate ZKEVM compatible
bytecode. [Learn more about zkSync custom compilers](/zk-stack/components/compiler/toolchain/overview).
::

We will use our wallet’s configured network to connect and deploy our smart contract so make sure your wallet is
currently connected to the zkSync Sepolia testnet. In Remix, under the Environment Section, select “Wallet” and click on
“Connect Wallet”.

To deploy the contract, click on “Deploy” and sign the transaction on your wallet. Congratulations, your ERC20 token
contract is now deployed on zkSync Sepolia testnet!

## Interact with the ERC20 contract

In the `scripts` folder you can find the `interact.ts`  script containing the following code:

```typescript
import {ethers} from "ethers";

// Address of the ERC20 token contract
const TOKEN_CONTRACT_ADDRESS = ""
// Wallet that will receive tokens
const RECEIVER_WALLET    = "";
// Amount of tokens to mint in ETH format, e.g. 1.23
const TOKEN_AMOUNT    = "123.55";

(async () => {
  try {
    
  // Note that the script needs the ABI which is generated from the compilation artifact.
  // Make sure contract is compiled for zkSync and artifacts are generated
  const artifactsPath = `browser/contracts/artifacts/TestToken.json` // Change this for different path

  const metadata = JSON.parse(await remix.call('fileManager', 'getFile', artifactsPath))
  
  // 'web3Provider' is a remix global variable object
  const signer = (new ethers.providers.Web3Provider(web3Provider)).getSigner(0)

  // initialise token contract with address, abi and signer
  const tokenContract= new ethers.Contract(TOKEN_CONTRACT_ADDRESS, metadata.abi, signer);

  console.log("Minting tokens...");
  const tx = await tokenContract.mint(
    RECEIVER_WALLET,
    ethers.utils.parseEther(TOKEN_AMOUNT)
  );
  console.log(`Mint transaction is ${tx.hash}`)
  await tx.wait();
  console.log("Success!");

  const balance = await tokenContract.balanceOf(RECEIVER_WALLET)
  
  console.log(`The account ${RECEIVER_WALLET} now has ${balance} tokens`)

  } catch (e) {
    console.log(e.message)
  }
})()

```

This scripts uses `ethers` to interact with the contract we’ve just deployed.

::callout{icon="i-heroicons-light-bulb"}
Existing libraries like `ethers` , `viem` and `web3.js` can be used to interact with smart contracts deployed on zkSync.
::

Fill the following variables:

- `TOKEN_CONTRACT_ADDRESS`: the contract address of the ERC20 token we just deployed.
- `RECEIVER_WALLET`: address of a different account that will receive new tokens.
- `TOKEN_AMOUNT`: the amount of tokens we’ll send to the account.

With the `interact.ts` file open in the editor, click on the “▶️” button to run the script and see the output in the
terminal.

![ERC20 interact script in Remix](/images/101-erc20/remix-erc20-interact.png)

To confirm the account has received the tokens, visit the zkSync Sepolia explorer and search the receiver wallet
address. You’ll see the new token balance in the assets table:

![ERC20 tokens in account balance](/images/101-erc20/erc20-tokens-minted.png)
