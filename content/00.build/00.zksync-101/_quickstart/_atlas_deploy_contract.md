---
title: Quickstart with Atlas
---
Atlas is a browser-based IDE with an integrated AI assistant that allows you to write, test and deploy smart contracts
directly from your browser. Click the button below to open the project in Atlas.

:u-button{ icon="i-heroicons-code-bracket" size="xl" color="primary" variant="solid" :trailing="false"
to="https://app.atlaszk.com/projects?template=https://github.com/uF4No/zksync-101-atlas&open=/contracts/ZeekSecretMessages.sol&chainId=300"
target="_blank" label="Open smart contract in Atlas"}
  
You can see the contract in the Atlas code editor. On the right side, make sure the selected network is “zkSync Sepolia
tesnet“ and click on **“Deploy”** to trigger the smart contract compilation and deployment.

::callout{icon="i-heroicons-light-bulb"}
Behind the scenes, Atlas is using the zkSync Era custom solidity compiler
(named `zksolc` ) to generate ZKEVM compatible bytecode. [Learn more about zkSync custom compilers](/zk-stack/components/compiler/toolchain/overview).
::

![Contract in Atlas](/images/101-quickstart/101-atlas-contract.png)

Once compiled sign the transaction with your wallet and wait until its processed. You’ll see the contract in the
“Deployed contracts” section. Congratulations, you’ve deployed your first smart contract to %%zk_testnet_name%%!

Below the contract name you can find its deployment address. The “Live Contract State” section displays the smart
contract balance and the value returned by the `getTotalMessages` function.

![Contract deployed](/images/101-quickstart/101-atlas-deployed.png)

The “Write Functions” section contains the form to interact with the `sendMessage` function. Write a message, click the
“Run” button and confirm the transaction in your wallet. You’ll see that the `getTotalMessages` is updated to `1`. That
means our contract is storing the messages as expected! But how can we see the replies from Zeek?
