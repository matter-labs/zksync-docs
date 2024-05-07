---
title: Quickstart with Remix
---

The Remix IDE is an open-source web and desktop application that supports Ethereum smart contract development and
deployment, offering tools for writing, testing, debugging, and deploying smart contracts written in Solidity to EVM
compatible protocols.

### Enable the Remix ZKsync plugin

:display_partial{path="/_partials/_enable-remix-zksync-plugin"}

Click the button below to open the project in Remix and see the contract in the Remix code editor.

:u-button{ icon="i-heroicons-code-bracket" size="xl" color="primary" variant="solid" :trailing="false"
to="https://remix.ethereum.org/#url=https://github.com/uF4No/zksync-101-remix/blob/master/contracts/ZeekSecretMessages.sol"
target="_blank" label="Open smart contract in Remix"}

To compile the contract, click on  Compile ZeeksSecretMessages.sol. If you get a popup message requesting permissions to
access **`ACCESS TO "WRITEFILE" OF "FILE MANAGER"`,** click on Accept.

::callout{icon="i-heroicons-light-bulb"}
Behind the scenes, Remix is using the ZKsync Era custom solidity compiler
(named `zksolc`) to generate ZKSync VM compatible bytecode. [Learn more about ZKsync custom compilers](/zk-stack/components/compiler/toolchain/overview).
::

We will use our wallet’s configured network to connect and deploy our smart contract so make sure your wallet is
currently connected to the %%zk_testnet_name%%. In Remix, under the Environment Section, select “Wallet” and click on
“Connect Wallet”.

To deploy the contract, click on “Deploy” and sign the transaction on your wallet. Congratulations, you’ve deployed your
first contract to %%zk_testnet_name%%!

Below the contract name you can find the address where the contract is deployed. The “Interact” section displays the
forms to interact with the `getTotalMessages` and `sendMessage` functions.

![Remix interact ZKsync contract](/images/101-quickstart/101-remix-interact.png)

Write a message in the form, click the “sendMessage” button and confirm the transaction in your wallet. Once processed,
click the `getTotalMessages` and check the response in the terminal, which should be `1`. That means our contract is
storing the messages as expected! But how can we see the replies from Zeek?
