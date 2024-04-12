---
title: Quickstart with Atlas
---
Atlas is a browser-based IDE with an integrated AI assistant that allows you to write, test and deploy smart contracts directly from your browser. Click the button below to open the project in Atlas.
    
<UButton
    icon="i-heroicons-code-bracket"
    size="xl"
    color="primary"
    variant="solid"
    :trailing="false"
    to="https://atlaszk.com"
    target="_blank"
    >Open in Atlas</UButton>
    
You can see the contract in the Atlas code editor. On the right side, make sure the selected network is “zkSync Sepolia tesnet“ and click on “Deploy” to trigger the smart contract compilation and deployment. 

::callout{icon="i-heroicons-light-bulb"}
Behind the scenes, Remix is using the zkSync Era custom solidity compiler (named `zksolc` ) to generate ZKEVM compatible bytecode. [Learn more about zkSync custom compilers]().
::

Once compiled sign the transaction with your wallet and wait until its processed. You’ll see the contract in the “Deployed contracts” section. Congratulations, you’ve deployed your first smart contract to zkSync Era testnet!

![Screenshot 2024-04-05 at 12.58.44.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/703ee435-9e35-441a-b595-a8f42972ac1a/0e02f31d-5f11-4420-a3ad-62264b0fcdf8/Screenshot_2024-04-05_at_12.58.44.png)

Below the contract name you can find its deployment address. The “Live Contract State” section displays the smart contract balance and the value returned by the `getTotalMessages` function. 

![Screenshot 2024-04-04 at 13.37.56.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/703ee435-9e35-441a-b595-a8f42972ac1a/98438027-5f01-4ae1-9096-93219fee0f62/Screenshot_2024-04-04_at_13.37.56.png)

The “Write Functions” section contains the form to interact with the `sendMessage` function. Write a message, click the “Run” button and confirm the transaction in your wallet. You’ll see that the `getTotalMessages` is updated to `1`. That means our contract is storing the messages as expected! But how can we see the replies from Zeek?
