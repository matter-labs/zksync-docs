---
title: ERC20 with Remix
---

The Remix IDE is an open-source web and desktop application that supports Ethereum smart contract development and
deployment, offering tools for writing, testing, debugging, and deploying smart contracts written in Solidity to EVM
compatible protocols.

### Enable the Remix ZKsync plugin

:display-partial{path="/_partials/_enable-remix-zksync-plugin"}

Click the button below to open the project in Remix and see the contract in the Remix code editor.

:u-button{ icon="i-heroicons-code-bracket" size="lg" color="primary" variant="solid" :trailing="false"
to="https://remix.ethereum.org/?#activate=zkSync&call=zkSync//loadFromGithub//ZKsync-Community-Hub//zksync-quickstart-remix//"
target="_blank" label="Open project in Remix"}

Once the project is imported, open the `contracts/TestToken.sol` file. To compile the contract, click on the ZKsync
plugin on the left menu and then "Compile TestToken.sol". If you get a popup message requesting permissions to access
**`ACCESS TO "WRITEFILE" OF "FILE MANAGER"`,** click on Accept.

::callout{icon="i-heroicons-light-bulb"}
Behind the scenes, Remix is using the ZKsync Era custom Solidity compiler (named `zksolc` ) to generate ZKEVM compatible
bytecode.
[Learn more about ZKsync custom compilers](/zk-stack/components/compiler/toolchain).
::

We will use our wallet’s configured
network to deploy our smart contract. In the ZKsync Remix plugin, under the Environment Section, select “Wallet” and click on
“Connect Wallet” as shown below:

![Connect wallet in Remix](/images/remix-connect-wallet.gif)

## Deploy the contract

To deploy the contract, select the `TestToken.sol` contract on the on the “Deploy” section, check the "Verify contract" checkbox, and
click on “Deploy & Verify”.
Sign the transaction on your wallet and wait a few seconds until the transaction is confirmed.

Congratulations, your ERC20 token
contract is now deployed on %%zk_testnet_name%%!

## Interact with the ERC20 contract

In the `scripts` folder you can find the `mint-token.ts`  script containing the following code:

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
  // Make sure contract is compiled for ZKsync and artifacts are generated
  const artifactsPath = `browser/artifacts/contracts/TestToken.sol/TestToken.json`

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
Existing libraries like `ethers` , `viem` and `web3.js` can be used to interact with smart contracts deployed on ZKsync Era.
::

Fill the following variables:

- `TOKEN_CONTRACT_ADDRESS`: the contract address of the ERC20 token we just deployed.
- `RECEIVER_WALLET`: address of a different account that will receive new tokens.
- `TOKEN_AMOUNT`: the amount of tokens we’ll send to the account.

::callout{icon="i-heroicons-exclamation-triangle" color="amber"}
Open the "Deploy & run transactions" menu in Remix and select "Injected Provider - Metamask"
from the environment dropdown to target the network selected in your wallet when running scripts.
::

With the `mint-token.ts` file open in the editor, click on the “▶️” button to run the script.
Sign the transaction in your wallet and see the output in the terminal.

![ERC20 interact script in Remix](/images/101-erc20/remix-erc20-interact.png)

To confirm the account has received the tokens, visit the [%%zk_testnet_name%%
explorer](%%zk_testnet_block_explorer_url%%) and search the receiver wallet
address. You’ll see the new token balance in the assets table:

![ERC20 tokens in account balance](/images/101-erc20/erc20-tokens-minted.png)
