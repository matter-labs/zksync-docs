---
title: Paymaster with Remix
---

REMIX DOES NOT SUPPORT ZKSYNC-ETHERS YET

To open the project in Remix, use the “Clone” option from the file explorer to import it from the following GitHub
repository:`https://github.com/uF4No/zksync-101-remix`

![Clone repo in Remix](/images/remix-plugin-clone-repo.gif)

Once the project is imported, open the `scripts/paymaster-transaction.ts` file, which contains the code to send a
transaction via the paymaster. Let’s go through the most important parts:

### Retrieve the token balance

```typescript
// retrieve and print the current balance of the wallet
let ethBalance = await provider.getBalance(walletAddress)
let tokenBalance = await tokenContract.balanceOf(walletAddress)
console.log(`Account ${walletAddress} has ${ethers.utils.formatEther(ethBalance)} ETH`);
console.log(`Account ${walletAddress} has ${ethers.utils.formatUnits(tokenBalance, 18)} tokens`);
```

In this part we’re retrieving the ETH and ERC20 token balances of the account. We’ll compare them after the transaction
is executed to see the difference.

### Estimate transaction fee

```typescript
// retrieve the testnet paymaster address
const testnetPaymasterAddress = await zkProvider.getTestnetPaymasterAddress();

console.log(`Testnet paymaster address is ${testnetPaymasterAddress}`);

const gasPrice = await provider.getGasPrice();

// define paymaster parameters for gas estimation
const paramsForFeeEstimation = utils.getPaymasterParams(testnetPaymasterAddress, {
  type: "ApprovalBased",
  token: TOKEN_CONTRACT_ADDRESS,
  // set minimalAllowance to 1 for estimation
  minimalAllowance: ethers.BigNumber.from(1),
  // empty bytes as testnet paymaster does not use innerInput
  innerInput: new Uint8Array(0),
});

// estimate gasLimit via paymaster
const gasLimit = await messagesContract.estimateGas.sendMessage(NEW_MESSAGE, {
  customData: {
    gasPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
    paymasterParams: paramsForFeeEstimation,
  },
});

// fee calculated in ETH will be the same in
// ERC20 token using the testnet paymaster
const fee = gasPrice * gasLimit;
```

In this part of the script we:

1. Retrieve the testnet paymaster address.
2. Generate the paymaster parameters to estimate the transaction fees passing the paymaster address, token address, and
   `ApprovalBased` as the paymaster flow type.
3. Retrieve the `gasLimit` of sending the transaction with the paymaster params.
4. Calculate the final estimated fee which is equal to `gasPrice` multiplied by `gasLimit`.

### Send the transaction

```typescript
// new paymaster params with fee as minimalAllowance
const paymasterParams = utils.getPaymasterParams(testnetPaymasterAddress, {
  type: "ApprovalBased",
  token: TOKEN_CONTRACT_ADDRESS,
  // provide estimated fee as allowance
  minimalAllowance: fee,
  // empty bytes as testnet paymaster does not use innerInput
  innerInput: new Uint8Array(0),
});

// full overrides object including maxFeePerGas and maxPriorityFeePerGas
const txOverrides = {
  maxFeePerGas: gasPrice,
  maxPriorityFeePerGas: "1",
  gasLimit,
  customData: {
    gasPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
    paymasterParams,
  }
}

console.log(`Sign the transaction in your wallet`);

// send transaction with additional paymaster params as overrides
const txHandle = await messagesContract.sendMessage(NEW_MESSAGE, txOverrides);
```

1. Create the new paymaster params with the calculated `fee` as `minimalAllowance` .
2. Complete the transaction overrides object with `maxFeePerGas`, `maxPriorityFeePerGas` and `gasPerPubdata`
3. Send the transaction including the `txOverrides`

### Compare the final balance

```typescript
ethBalance = await provider.getBalance(walletAddress)
tokenBalance = await tokenContract.balanceOf(walletAddress)
console.log(`Account ${walletAddress} now has ${ethers.utils.formatEther(ethBalance)} ETH`);
console.log(`Account ${walletAddress} now has ${ethers.utils.formatUnits(tokenBalance, 18)} tokens`);
```

Finally we retrieve and print the ETH and ERC20 balances to see how they’ve changed.

## Run the script

To run the script, first enter the addresses of the `ZeekSecretMessages.sol` and `TestToken.sol` contracts that we
deployed previously ([here](https://www.notion.so/6385bbbc22b14d1797eeb7648d9a926d?pvs=21) and
[here](https://www.notion.so/6385bbbc22b14d1797eeb7648d9a926d?pvs=21)) in the following variables at the beginning of
the script:

```typescript
// Address of the ZeekMessages contract
const ZEEK_MESSAGES_CONTRACT_ADDRESS = "";
// Address of the ERC20 token contract
const TOKEN_CONTRACT_ADDRESS = ""
// Message to be sent to the contract
const NEW_MESSAGE = "This tx cost me no ETH!";
```

Next, make sure the script file is selected in the Remix editor and click on the “▶️” button.

[REMIX IMAGE]

You’ll see the progress in the console.

If everything worked as expected, only the ERC20 balance will decrease, meaning the fee was paid with the ERC20 token
instead of ETH.
