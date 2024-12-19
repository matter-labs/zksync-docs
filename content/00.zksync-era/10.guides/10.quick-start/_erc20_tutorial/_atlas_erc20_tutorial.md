---
title: ERC20 token with Atlas
---

## Deploy the smart contract

Atlas is a browser-based IDE with an integrated AI assistant that allows you to write, test and deploy smart contracts
directly from your browser. Click the button below to open the project in Atlas.

:u-button{ icon="i-heroicons-code-bracket" size="lg" color="primary" variant="solid" :trailing="false"
to="https://app.atlaszk.com/templates/33EAJkwrTKFaDJiEuy9Om?chainId=%%zk_testnet_chain_id%%&openFile=/contracts/TestToken.sol"
target="_blank" label="Open smart contract in Atlas"}

You can see the contract in the Atlas code editor. In the right sidebar,
make sure the selected network is “%%zk_testnet_name%%“
and click on **"Deploy"** to trigger the smart contract compilation and deployment.

::callout{icon="i-heroicons-light-bulb"}
Behind the scenes, Atlas is using the ZKsync Era custom solidity compiler
(named `zksolc` ) to generate ZKEVM compatible bytecode. [Learn more about ZKsync custom compilers](/zksync-protocol/compiler/toolchain).
::

![ERC20 interact script in Atlas](/images/101-erc20/atlas-deploy-erc20.png)

Once compiled sign the transaction with your wallet and wait until its processed. You’ll see the contract in the
**“Deployed contracts”** section.

## Interact with the ERC20 contract

In the `scripts` folder you can find the `mint-token.ts`  script containing the following code:

```ts
import { ethers } from "hardhat";

// Address of the ERC20 token contract
const TOKEN_CONTRACT_ADDRESS = "";
// Wallet that will receive tokens
const RECEIVER_WALLET = "";
// Amount of tokens to mint in ETH format, e.g. 1.23
const TOKEN_AMOUNT = "";

async function main() {
  const Token = await ethers.getContractFactory("TestToken");
  const tokenContract = Token.attach(TOKEN_CONTRACT_ADDRESS);

  console.log("Minting tokens...");

  const tx = await tokenContract.mint(
    RECEIVER_WALLET,
    ethers.parseEther(TOKEN_AMOUNT),
  );
  await tx.wait();

  console.log("Success!");
  console.log(
    `The account ${RECEIVER_WALLET} now has ${await tokenContract.balanceOf(
      RECEIVER_WALLET,
    )} tokens`,
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

This scripts uses `ethers` to interact with the contract we’ve just deployed.

::callout{icon="i-heroicons-light-bulb"}
Existing libraries like `ethers` , `viem` and `web3.js` can be used to interact with smart contracts deployed on ZKsync.
::

Fill the following variables:

- `TOKEN_CONTRACT_ADDRESS`: the contract address of the ERC20 token we just deployed.
- `RECEIVER_WALLET`: address of a different account that will receive new tokens.
- `TOKEN_AMOUNT`: the amount of tokens we’ll send to the account.

With the `mint-token.ts` file open in the Atlas editor, click on the “Deploy” button to run the script and see the output
in the terminal.

![ERC20 interact script in Atlas](/images/101-erc20/atlas-erc20-interact.png)

To confirm the account has received the tokens, visit the [%%zk_testnet_name%%
explorer](%%zk_testnet_block_explorer_url%%) and search the receiver wallet
address. You’ll see the new token balance in the assets table:

![ERC20 tokens in account balance](/images/101-erc20/erc20-tokens-minted.png)
