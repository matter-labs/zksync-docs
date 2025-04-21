---
title: EraVM Quickstart with Remix
---

:display_partial{path="/_partials/remix/deploy/_remix-intro"}

:display_partial{path="/_partials/remix/deploy/_enable-remix-zksync-plugin"}

:display-partial{path="/_partials/remix/erc20/_template"}

### Connect your wallet

:display_partial{path="/_partials/remix/deploy/_remix-era-wallet"}

:display_partial{path="/_partials/remix/deploy/_connect"}

:display_partial{path="/_partials/remix/deploy/_remix-compile-era"}

::callout{icon="i-heroicons-light-bulb"}
Behind the scenes, Remix is using the ZKsync Era custom solidity compiler
(named `zksolc`) to generate ZKsync VM compatible bytecode. [Learn more about ZKsync custom compilers](/zksync-protocol/compiler/toolchain).
::

### Deploy the contract

To deploy the contract, open the "Deploy" dropdown, check the "Verify contract" checkbox, and click on “Deploy &
Verify”. Sign the transaction in your wallet and wait a few seconds until it's processed. Congratulations, you’ve
deployed your first contract to %%zk_testnet_name%%!

![Remix interact ZKsync contract](/images/101-quickstart/101-remix-deploy.png)

### Interact with the contract

Next to the contract name you can find the address where the contract is deployed. The “Interact” section displays the
forms to interact with the `getTotalMessages` and `sendMessage` functions.

![Remix interact ZKsync contract](/images/101-quickstart/101-remix-interact.png)

:display_partial{path="/_partials/remix/deploy/_remix-template-interact-2"}

## Check the contract in explorer

Copy the smart contract address from Remix and search it via the [%%zk_testnet_name%%
explorer](%%zk_testnet_block_explorer_url%%). You’ll see the contract has a transaction from the message you just sent.

![Contract in ZKsync explorer](/images/101-quickstart/101-contract-deployed.png)
