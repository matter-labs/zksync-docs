---
title: EVM Quickstart with Remix
---

:display_partial{path="/_partials/remix/deploy/_remix-intro"}

:display-partial{path="/_partials/remix/erc20/_template"}

Then, open up the `ZeekMessages.sol` contract file.

### Connect your wallet

:display_partial{path="/_partials/remix/deploy/_remix-evm-wallet"}

:display_partial{path="/_partials/remix/deploy/_connect"}

### Compile the contract

To compile the contract, click on the "Solidity Compiler" tab and press the "Compile `ZeekMessages.sol`" button.

### Deploy the contract

To deploy the contract, go back to the "Deploy and run transactions" tab and click on the "Deploy" button.
Sign the transaction in your wallet and wait a few seconds until it's processed. Congratulations, you’ve
deployed your first contract to %%zk_testnet_name%%!

![Remix interact ZKsync contract](/images/101-quickstart/deploy.gif)

### Interact with the contract

Under "Deployed Contracts", click on your contract to show the interaction options:

![Remix interact ZKsync contract](/images/101-quickstart/interact.gif)

:display_partial{path="/_partials/remix/deploy/_remix-template-interact-2"}

## Check the contract in explorer

Copy the smart contract address from Remix and search it via the [%%zk_testnet_name%%
explorer](%%zk_testnet_block_explorer_url%%). You’ll see the contract has a transaction from the message you just sent.

![Contract in ZKsync explorer](/images/101-quickstart/explorer.png)
