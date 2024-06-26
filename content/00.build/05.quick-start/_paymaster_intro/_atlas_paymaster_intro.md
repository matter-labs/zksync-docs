---
title: Paymaster with Atlas
---

Click the following button to open the project in Atlas:

:u-button{ icon="i-heroicons-code-bracket" size="lg" color="primary" variant="solid" :trailing="false"
to="https://app.atlaszk.com/templates/33EAJkwrTKFaDJiEuy9Om?chainId=%%zk_testnet_chain_id%%&openFile=/scripts/paymaster-transaction.ts"
target="_blank" label="Open script in Atlas"}

It’ll open the script to send a transaction via the paymaster. Let’s go through the most important parts:

### Retrieve the token balance

```typescript
// retrieve and print the current balance of the wallet
let ethBalance = await provider.getBalance(walletAddress)
let tokenBalance = await tokenContract.balanceOf(walletAddress)
console.log(`Account ${walletAddress} has ${ethers.formatEther(ethBalance)} ETH`);
console.log(`Account ${walletAddress} has ${ethers.formatUnits(tokenBalance, 18)} tokens`);
```

In this part we’re retrieving the ETH and ERC20 token balances of the account. We’ll compare them after the transaction
is executed to see the difference.

### Estimate transaction fee

```typescript
// retrieve the testnet paymaster address
const testnetPaymasterAddress = await zkProvider.getTestnetPaymasterAddress();

console.log(`Testnet paymaster address is ${testnetPaymasterAddress}`);

const gasPrice = await zkProvider.getGasPrice();

// define paymaster parameters for gas estimation
const paramsForFeeEstimation = utils.getPaymasterParams(testnetPaymasterAddress, {
  type: "ApprovalBased",
  token: TOKEN_CONTRACT_ADDRESS,
  // set minimalAllowance to 1 for estimation
  minimalAllowance: ethers.toBigInt(1),
  // empty bytes as testnet paymaster does not use innerInput
  innerInput: new Uint8Array(0),
});

// estimate gasLimit via paymaster
const gasLimit = await messagesContract.sendMessage.estimateGas(NEW_MESSAGE, {
  customData: {
    gasPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
    paymasterParams: paramsForFeeEstimation,
  },
});

// fee calculated in ETH will be the same in
// ERC20 token using the testnet paymaster
const fee = gasPrice * gasLimit;
```

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
console.log(`Account ${walletAddress} now has ${ethers.formatEther(ethBalance)} ETH`);
console.log(`Account ${walletAddress} now has ${ethers.formatUnits(tokenBalance, 18)} tokens`);
```

Finally we retrieve and print the ETH and ERC20 balances to see how they’ve changed.

## Run the script

To run the script, first enter the addresses of the `ZeekMessages.sol` and `TestToken.sol` contracts that we
deployed previously ([Deploy your first contract](/build/quick-start/deploy-your-first-contract) and
[Erc20 Token](/build/quick-start/erc20-token)) in the following variables at the beginning of
the script:

```typescript
// Address of the ZeekMessages contract
const ZEEK_MESSAGES_CONTRACT_ADDRESS = "";
// Address of the ERC20 token contract
const TOKEN_CONTRACT_ADDRESS = ""
// Message to be sent to the contract
const NEW_MESSAGE = "This tx cost me no ETH!";
```

Next, make sure the script file is selected in the Atlas editor and click on the “Deploy” button.

![ERC20 interact script in Remix](/images/101-paymasters/atlas-paymaster-script.png)

You’ll see the progress in the console.

If everything worked as expected, only the ERC20 balance will decrease, meaning the fee was paid with the ERC20 token
instead of ETH.
