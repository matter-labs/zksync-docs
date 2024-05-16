---
title: General Paymaster
description: Learn to deploy contract factories in the zkSync environment.
---

Run the following command in your terminal to initialize the project.

```sh
npx zksync-cli@latest create --template qs-paymaster contract-paymaster-quickstart
cd contract-paymaster-quickstart
```

## Set up your wallet

:display-partial{path = /build/quick-start/_partials/_setup-wallet"}

---

## Understanding the `GeneralPaymaster` contract

Let's start by reviewing the [`GeneralPaymaster.sol`](https://github.com/matter-labs/zksync-contract-templates/blob/main/templates/quickstart/hardhat/paymaster/contracts/GaslessPaymaster.sol)
contract in the `contracts/` directory:

::drop-panel
  ::panel{label="GeneralPaymaster.sol"}
    ```solidity [GeneralPaymaster.sol]
    // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.0;

    import {IPaymaster, ExecutionResult, PAYMASTER_VALIDATION_SUCCESS_MAGIC} from "@matterlabs/zksync-contracts/l2/system-contracts/interfaces/IPaymaster.sol";
    import {IPaymasterFlow} from "@matterlabs/zksync-contracts/l2/system-contracts/interfaces/IPaymasterFlow.sol";
    import {TransactionHelper, Transaction} from "@matterlabs/zksync-contracts/l2/system-contracts/libraries/TransactionHelper.sol";
    import "@matterlabs/zksync-contracts/l2/system-contracts/Constants.sol";
    import "@openzeppelin/contracts/access/Ownable.sol";

    /// @notice This contract does not include any validations other than using the paymaster general flow.
    contract GaslessPaymaster is IPaymaster, Ownable {
        modifier onlyBootloader() {
            require(
                msg.sender == BOOTLOADER_FORMAL_ADDRESS,
                "Only bootloader can call this method"
            );
            // Continue execution if called from the bootloader.
            _;
        }

        function validateAndPayForPaymasterTransaction(
            bytes32,
            bytes32,
            Transaction calldata _transaction
        )
            external
            payable
            onlyBootloader
            returns (bytes4 magic, bytes memory context)
        {
            // By default we consider the transaction as accepted.
            magic = PAYMASTER_VALIDATION_SUCCESS_MAGIC;
            require(
                _transaction.paymasterInput.length >= 4,
                "The standard paymaster input must be at least 4 bytes long"
            );

            bytes4 paymasterInputSelector = bytes4(
                _transaction.paymasterInput[0:4]
            );
            if (paymasterInputSelector == IPaymasterFlow.general.selector) {
                // Note, that while the minimal amount of ETH needed is tx.gasPrice * tx.gasLimit,
                // neither paymaster nor account are allowed to access this context variable.
                uint256 requiredETH = _transaction.gasLimit *
                    _transaction.maxFeePerGas;

                // The bootloader never returns any data, so it can safely be ignored here.
                (bool success, ) = payable(BOOTLOADER_FORMAL_ADDRESS).call{
                    value: requiredETH
                }("");
                require(
                    success,
                    "Failed to transfer tx fee to the Bootloader. Paymaster balance might not be enough."
                );
            } else {
                revert("Unsupported paymaster flow in paymasterParams.");
            }
        }

        function postTransaction(
            bytes calldata _context,
            Transaction calldata _transaction,
            bytes32,
            bytes32,
            ExecutionResult _txResult,
            uint256 _maxRefundedGas
        ) external payable override onlyBootloader {
            // Refunds are not supported yet.
        }

        function withdraw(address payable _to) external onlyOwner {
            // send paymaster funds to the owner
            uint256 balance = address(this).balance;
            (bool success, ) = _to.call{value: balance}("");
            require(success, "Failed to withdraw funds from paymaster.");
        }

        receive() external payable {}
    }
    ```
  ::
::

**Key components:**

- The `GaslessPaymaster` contract ensures that transaction fees are handled automatically without user intervention.
- **`validateAndPayForPaymasterTransaction` Method:** This mandatory method assesses whether the paymaster agrees to cover the
transaction fees. If affirmative, it transfers the necessary funds
(calculated as tx.gasprice * tx.gasLimit) to the operator. It returns a context for the `postTransaction` method.
- **`postTransaction`** Method: An optional method invoked
post-transaction execution, provided the transaction doesn't fail
due to out-of-gas errors. It receives several parameters, including the transaction's context and result, aiding in finalizing paymaster duties.
- **`onlyBootloader`** Modifier: Ensures that certain methods are
exclusively callable by the system's bootloader, adding an extra layer of security and control.

---

## Compile and deploy the `GeneralPaymaster` contract

:display-partial{path = "/_partials/_compile-solidity-contracts"}

Upon successful compilation, you'll receive output detailing the
`zksolc` and `solc` versions used during compiling and the number
of Solidity files compiled.

```bash
Compiling contracts for zkSync Era with zksolc v1.4.0 and solc v0.8.17
Compiling 4 Solidity file
Successfully compiled 4 Solidity file
```

The compiled artifacts will be located in the `/artifacts-zk` folder.

The script to deploy the `GaslessPaymaster` is located at [`/deploy/deployGaslessPaymaster.ts`](https://github.com/matter-labs/zksync-contract-templates/blob/main/templates/quickstart/hardhat/paymaster/deploy/deployGaslessPaymaster.ts).

```typescript [deployGaslessPaymaster.ts]
import { deployContract, getWallet, getProvider } from "./utils";
import { ethers } from "ethers";

// An example of a basic deploy script
// It will deploy a CrowdfundingCampaign contract to selected network
// `parseEther` converts ether to wei, and `.toString()` ensures serialization compatibility.
export default async function() {
  const contractArtifactName = "GaslessPaymaster";
  const constructorArguments = [];
  const contract = await deployContract(
    contractArtifactName,
    constructorArguments
  );
  const wallet = getWallet();
  const provider = getProvider();

  // Supplying paymaster with ETH
  await (
    await wallet.sendTransaction({
      to: contract.target,
      value: ethers.parseEther("0.005"),
    })
  ).wait();

  let paymasterBalance = await provider.getBalance(contract.target.toString());
  console.log(`Paymaster ETH balance is now ${paymasterBalance.toString()}`);
}
```

**Key Components:**

- **`deployContract` Method:** Utilized for deploying the `GaslessPaymaster` contract. This method takes the name of the
contract and any constructor arguments needed for initialization,
mirroring the deployment process used for the `CrowdfundingCampaign` contract.
- **Funding the Paymaster:** An important step where the deployed `GaslessPaymaster` contract is funded with ETH
to cover transaction fees for users. The script sends a transaction
from the deployer's wallet to the paymaster contract, ensuring it has sufficient balance to operate.

Execute the deployment command corresponding to your package manager. The default command
deploys to the configured network in your Hardhat setup. For local deployment, append
`--network inMemoryNode` to deploy to the local in-memory node running.

::code-group

```bash [npm]
npm run hardhat deploy-zksync --script deployGaslessPaymaster.ts
# To deploy the contract on local in-memory node:
# npm run hardhat deploy-zksync --script deployGaslessPaymaster.ts --network inMemoryNode
```

```bash [yarn]
yarn hardhat deploy-zksync --script deployGaslessPaymaster.ts
# To deploy the contract on local in-memory node:
# yarn hardhat deploy-zksync --script deployGaslessPaymaster.ts --network inMemoryNode
```

```bash [pnpm]
pnpm run hardhat deploy-zksync --script deployGaslessPaymaster.ts
# To deploy the contract on local in-memory node:
# pnpm run hardhat deploy-zksync --script deployGaslessPaymaster.ts --network inMemoryNode
```

```bash [bun]
bun run hardhat deploy-zksync --script deployGaslessPaymaster.ts
# To deploy the contract on local in-memory node:
# bun run hardhat deploy-zksync --script deployGaslessPaymaster.ts --network inMemoryNode
```

::

Upon successful deployment, you'll receive output detailing the deployment process,
including the contract address, source, and encoded constructor arguments:

```bash
Starting deployment process of "GaslessPaymaster"...
Estimated deployment cost: 0.0004922112 ETH

"GaslessPaymaster" was successfully deployed:
 - Contract address: 0x6f72f0d7bDba2E2a923beC09fBEE64cD134680F2
 - Contract source: contracts/GaslessPaymaster.sol:GaslessPaymaster
 - Encoded constructor arguments: 0x

Requesting contract verification...
Your verification ID is: 10634
Contract successfully verified on zkSync block explorer!
Paymaster ETH balance is now 5000000000000000
```

---

## Interact with the GeneralPaymaster contract

This section will navigate you through the steps to interact with the `GeneralPaymaster` contract,
using it to cover transaction fees for your operation.

The interaction script is situated in the `/deploy/interact/` directory, named [`interactWithGaslessPaymaster.ts`](https://github.com/matter-labs/zksync-contract-templates/blob/main/templates/quickstart/hardhat/paymaster/deploy/interact/interactWithGaslessPaymaster.ts).

Ensure the `CONTRACT_ADDRESS` and `PAYMASTER_ADDRESS` variables are set to your deployed contract and paymaster addresses, respectively.

::drop-panel
  ::panel{label="interactWithGaslessPaymaster.ts"}

  ```typescript [interactWithGaslessPaymaster.ts]
  import * as hre from "hardhat";
  import { getWallet, getProvider } from "../utils";
  import { ethers } from "ethers";
  import { utils } from "zksync-ethers";

  // Address of the contract to interact with
  const CONTRACT_ADDRESS = "YOUR-CONTRACT-ADDRESS";
  const PAYMASTER_ADDRESS = "YOUR-PAYMASTER-ADDRESS";
  if (!CONTRACT_ADDRESS || !PAYMASTER_ADDRESS)
      throw new Error("Contract and Paymaster addresses are required.");

  export default async function() {
    console.log(`Running script to interact with contract ${CONTRACT_ADDRESS} using paymaster ${PAYMASTER_ADDRESS}`);

    // Load compiled contract info
    const contractArtifact = await hre.artifacts.readArtifact(
      "CrowdfundingCampaignV2"
    );

    // Initialize contract instance for interaction
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      contractArtifact.abi,
      getWallet()
    );

    const provider = getProvider();
    let balanceBeforeTransaction = await provider.getBalance(getWallet().address);
    console.log(`Wallet balance before contribution: ${ethers.formatEther(balanceBeforeTransaction)} ETH`);

    const contributionAmount = ethers.parseEther("0.01");
    // Get paymaster params
    const paymasterParams = utils.getPaymasterParams(PAYMASTER_ADDRESS, {
      type: "General",
      innerInput: new Uint8Array(),
    });

    const gasLimit = await contract.contribute.estimateGas({
      value: contributionAmount,
      customData: {
        gasPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
        paymasterParams: paymasterParams,
      },
    });

    const transaction = await contract.contribute({
      value: contributionAmount,
      maxPriorityFeePerGas: 0n,
      maxFeePerGas: await provider.getGasPrice(),
      gasLimit,
      // Pass the paymaster params as custom data
      customData: {
        gasPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
        paymasterParams,
      },
    });
    console.log(`Transaction hash: ${transaction.hash}`);

    await transaction.wait();

    let balanceAfterTransaction = await provider.getBalance(getWallet().address);
    // Check the wallet balance after the transaction
    // We only pay the contribution amount, so the balance should be less than before
    // Gas fees are covered by the paymaster
    console.log(`Wallet balance after contribution: ${ethers.formatEther(balanceAfterTransaction)} ETH`);
  }
  ```

  ::
::

**Key Components:**

- **Paymaster Parameters:** Before executing transactions that involve the contract, the script prepares paymaster parameters using
`getPaymasterParams`. This specifies the paymaster contract to be
used and the type of paymaster flow, which in this case is `General`.

- **Transaction with Paymaster:** Demonstrated by the `contribute` function call, the script shows how to include paymaster parameters
in transactions. This allows the paymaster to cover transaction
fees, providing a seamless experience for users.

Execute the command corresponding to your package manager:

::code-group

```bash [npm]
npm run hardhat deploy-zksync --script interact/interactWithGaslessPaymaster.ts
```

```bash [yarn]
yarn hardhat deploy-zksync --script interact/interactWithGaslessPaymaster.ts
```

```bash [pnpm]
pnpm run hardhat deploy-zksync --script interact/interactWithGaslessPaymaster.ts
```

```bash [bun]
bun run hardhat deploy-zksync --script interact/interactWithGaslessPaymaster.ts
```

::

Upon successful usage, you'll receive output detailing the transaction:

```bash
Running script to interact with contract 0x68E8533acE01019CB8D07Eca822369D5De71b74D using paymaster 0x6f72f0d7bDba2E2a923beC09fBEE64cD134680F2
Wallet balance before contribution: 5.879909434005856127 ETH
Transaction hash: 0x41c463abf7905552b69b25e7918374aab27f2d7e8cbebe212a0eb6ef8deb81e8
Wallet balance after contribution: 5.869909434005856127 ETH
```

🎉 Great job! You've successfully interacted with the `CrowdfundingCampaignV2` using a paymaster to cover the transaction fees.
