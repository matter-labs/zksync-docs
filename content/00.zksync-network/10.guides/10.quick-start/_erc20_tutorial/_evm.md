---
title: ERC20 with Remix EVM
---

:display_partial{path="/_partials/remix/erc20/_intro"}

:display-partial{path="/_partials/remix/erc20/_template"}

Then, open up the `TestToken.sol` contract file.

### Connect your wallet

:display_partial{path="/_partials/remix/deploy/_remix-evm-wallet"}

:display_partial{path="/_partials/remix/deploy/_connect"}

### Compile the contract

To compile the contract, click on the "Solidity Compiler" tab and press the "Compile `TestToken.sol`" button.

### Deploy the contract

To deploy the contract, go back to the "Deploy and run transactions" tab.
Enter the name and symbol for your token in the input field by the "Deploy" button, then click "Deploy".
Sign the transaction in your wallet and wait a few seconds until it's processed.

![Deploy ERC20 Remix EVM](/images/101-erc20/deploy-erc20.gif)

Congratulations, your ERC20 token
contract is now deployed on %%zk_testnet_name%%!

Under the "Deployed Contracts" section, you should now see your contract deployment.
Click on the copy icon to copy your contract address.
You will need this for the next section.

## Interact with the ERC20 contract

In the `scripts` folder you can find the `mint-token-evm.ts` script containing the following code:

:display_partial{path="/_partials/remix/erc20/_script_code_evm"}

:display_partial{path="/_partials/remix/erc20/_ethers"}

With the `mint-token-evm.ts` file open in the editor, click on the “▶️” button to run the script.
Sign the transaction in your wallet and see the output in the terminal.

![ERC20 interact script in Remix](/images/101-erc20/run-script-evm.png)

:display_partial{path="/_partials/remix/erc20/_run_script"}
