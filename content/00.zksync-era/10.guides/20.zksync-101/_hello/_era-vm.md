---
title: EraVM - Hello ZKsync
---

:display_partial{path="/_partials/101/hello/_campaign"}

Run the compile script from your project in the terminal:

:display_partial{path="/_partials/commands/_compile"}

Upon successful compilation, you'll receive output detailing the
`zksolc` and `solc` versions used during compiling and the number
of Solidity files compiled.

```bash
Compiling contracts for ZKsync Era with zksolc v1.4.1 and solc v0.8.17
Compiling 15 Solidity files
Successfully compiled 15 Solidity files
```

The compiled artifacts will be located in the `/artifacts-zk` folder.

::callout{icon="i-heroicons-information-circle" color="blue"}
Smart contracts deployed to ZKsync must be compiled using our custom compiler.
`zksolc` is the compiler used for Solidity.
This is why they're placed in the `artifacts-zk` folder!
::

## Setup local node

This series of guides will use in-memory `anvil-zksync` node which allows for quicker testing and debugging processes.
A great benefit of using a local node is that you will avoid incurring any actual transaction costs as the node provides
a set of rich wallets that come with more than enough ETH to use for development.

::callout{icon="i-heroicons-light-bulb"}
`anvil-zksync` can be used with EraVM or EVM. For EVM contracts, you can also use any standard EVM local node like [`anvil`](https://book.getfoundry.sh/anvil/).
::

### Run a local node

To run a local in-memory `anvil-zksync` node on your machine, you will need Docker running.
The easiest way to start Docker is to run the Docker Desktop app.

We are going to use the "in-memory node" module for our local node setup.

1. Run the following command in your terminal:

    ```bash
    zksync-cli dev config
    ```

    It will provide a list of available node types you can run locally.

2. Use the arrow keys to navigate to "in-memory node" and press **Enter** to select.
    The next question will ask what additional modules you want to use.
    Make sure additional modules are unselected for this setup and press **Enter** to finish the configuration.

    ```bash
    ? Node to use (Use arrow keys)
    ❯ in-memory node - Quick startup, no persisted state, only L2 node - zkcli-in-memory-node
      Dockerized node - Persistent state, includes L1 and L2 nodes - zkcli-dockerized-node
    (Move up and down to reveal more choices)
    ```

    The in-memory node module will run a lighter version of the ZKsync Era node
    which is ideal for swift testing, prototyping, bootloader and system contract testing.

3. Run the following command in your terminal to start up the node:

    ```bash
    zksync-cli dev start
    ```

    anvil-zksync node includes pre-configured rich wallets for use, see [anvil-zksync rich wallets](/build/test-and-debug/in-memory-node#pre-configured-rich-wallets).

Your `anvil-zksync` node is accessible at **[http://127.0.0.1:8011](http://127.0.0.1:8011/)**, ready for deployment or testing purposes.
You can use the Docker Desktop app to view logs from the running ZKsync Era node or use the `zksync-cli dev logs` command.

When you are done running your `anvil-zksync` node, you can stop it with `zksync-cli dev stop`.
You can learn more about managing a local node with ZKsync CLI on [Running a node](/build/zksync-cli/running-a-node).

### Configuring a Hardhat Wallet

Since we are using a local in-memory `anvil-zksync` node for development, we can use one of the
rich wallets for transactions and deployments.

Copy the private key for the first rich wallet from `.env.example` to the `.env` file.

::callout{icon="i-heroicons-exclamation-triangle" color="amber"}
Never save a real private key to the `.env` file!
::

:display_partial{path="/_partials/101/hello/_deploy"}

Upon successful deployment, you'll receive output detailing the deployment process,
including the contract address, source, and encoded constructor arguments:

```bash
Starting deployment process of "CrowdfundingCampaign"...
Estimated deployment cost: 0.0065057128 ETH

"CrowdfundingCampaign" was successfully deployed:
 - Contract address: 0x26b368C3Ed16313eBd6660b72d8e4439a697Cb0B
 - Contract source: contracts/1-hello-zksync/CrowdfundingCampaign.sol:CrowdfundingCampaign
 - Encoded constructor arguments: 0x00000000000000000000000000000000000000000000000000470de4df820000
```

:display_partial{path="/_partials/101/hello/_interact"}

### Read from the contract using ZKsync CLI

We can confirm the amount by calling the `getFundingGoal` method using ZKsync CLI.

In the terminal, run the following in your project directory,
replacing the contract address with your contract's address:

```bash
zksync-cli contract read \
--chain in-memory-node \
--contract <0xYOUR_CONTRACT_ADDRESS> \
--abi artifacts-zk/contracts/1-hello-zksync/CrowdfundingCampaign.sol/CrowdfundingCampaign.json
```

The CLI will prompt you with a list of available methods to select from. Navigate with the arrow keys and press **Enter**
on the method `getFundingGoal()`.

```bash
Using provided ABI file
? Contract method to call (Use arrow keys)
  ──────────────── Provided contract ────────────────
❯ getFundingGoal() view returns (uint256)
  getTotalFundsRaised() view returns (uint256)
  owner() view returns (address)
  ───────────────────────────────────────────────────
  Type method manually
```

- The `--chain` option defines the network we want to use, which is our local in-memory node.
- The `--contract` is the address of the contract you just deployed.
- The `--abi` provides the ABI to decode the contract and provide the list of methods to select from.
  Without the ABI provided, you will have to manually type out the method name.

You will get a response with the amount that we passed in to the constructor on deploy:

```bash
? Contract method to call getFundingGoal() view returns (uint256)

✔ Method response (raw): 0x00000000000000000000000000000000000000000000000000470de4df820000
✔ Decoded method response: 20000000000000000
```

:display_partial{path="/_partials/101/hello/_interact2"}

```bash
zksync-cli contract write \
--chain in-memory-node \
--contract <0xCONTRACT_ADDRESS> \
--abi artifacts-zk/contracts/1-hello-zksync/CrowdfundingCampaign.sol/CrowdfundingCampaign.json \
--pk <0xDEPLOYER_PRIVATE_KEY> \
--value 0.5
```

In the prompt, press **Enter** on the `contribute() payable` method.
The CLI will then output the transaction information upon success.

We can read the transaction data of the contribution with the following:

```bash
zksync-cli transaction info \
--tx <0xTRANSACTION_HASH> \
--chain in-memory-node
```

Our crowdfund has reached its funding goal! Let's withdraw the funds for the owner:

```bash
zksync-cli contract write \
--chain in-memory-node \
--contract <0xCONTRACT_ADDRESS> \
--pk <0xDEPLOYER_PRIVATE_KEY>
```

The CLI will prompt for the method to call, we will call `withdrawFunds()`:

```bash
? Enter method to call withdrawFunds()
```

Congratulations! You've deployed a crowdfunding contract and learned how
to interact with the deployed contract using ZKsync CLI!
