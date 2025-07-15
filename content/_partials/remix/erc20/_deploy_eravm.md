---
title: Deploy ERC20 with Remix EraVM
---


:display-partial{path="/_partials/remix/deploy/_enable-remix-zksync-plugin"}

:display-partial{path="/_partials/remix/erc20/_template"}

Once the project is imported, open the `contracts/TestToken.sol` file.

To compile the contract, click on the ZKsync
plugin on the left menu and then "Compile TestToken.sol". If you get a popup message requesting permissions to access
**`ACCESS TO "WRITEFILE" OF "FILE MANAGER"`,** click on Accept.

::callout{icon="i-heroicons-light-bulb"}
Behind the scenes, Remix is using the ZKsync Era custom Solidity compiler (named `zksolc` ) to generate ZKEVM compatible
bytecode.
[Learn more about ZKsync custom compilers](/zksync-protocol/compiler/toolchain).
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
