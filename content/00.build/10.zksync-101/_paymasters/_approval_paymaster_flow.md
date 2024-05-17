---
title: Approval Paymaster
description: Learn to deploy contract factories in the zkSync environment.
---

Run the following command in your terminal to initialize the project.

```sh
npx zksync-cli@latest create --template qs-paymaster contract-paymaster-quickstart
cd contract-paymaster-quickstart
```

## Set up your wallet

:display-partial{path = "/build/zksync-101/_partials/_setup-wallet"}

---

## Understanding the `ApprovalPaymaster` contract

Let's start by reviewing the `ApprovalFlowPaymaster.sol` contract in the `contracts/` directory:

::drop-panel
  ::panel{label="ApprovalFlowPaymaster.sol"}
    ```solidity [ApprovalFlowPaymaster.sol]
    // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.0;

    import {IPaymaster, ExecutionResult, PAYMASTER_VALIDATION_SUCCESS_MAGIC} from "@matterlabs/zksync-contracts/l2/system-contracts/interfaces/IPaymaster.sol";
    import {IPaymasterFlow} from "@matterlabs/zksync-contracts/l2/system-contracts/interfaces/IPaymasterFlow.sol";
    import {TransactionHelper, Transaction} from "@matterlabs/zksync-contracts/l2/system-contracts/libraries/TransactionHelper.sol";

    import "@matterlabs/zksync-contracts/l2/system-contracts/Constants.sol";

    import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
    import "@openzeppelin/contracts/access/Ownable.sol";

    /// @notice This smart contract pays the gas fees for accounts with balance of a specific ERC20 token. It makes use of the approval-based flow paymaster.
    contract ApprovalFlowPaymaster is IPaymaster, Ownable {
        uint256 constant PRICE_FOR_PAYING_FEES = 1;

        address public allowedToken;

        modifier onlyBootloader() {
            require(
                msg.sender == BOOTLOADER_FORMAL_ADDRESS,
                "Only bootloader can call this method"
            );
            _;
        }

        constructor() {
            // Sepolia CROWN token address
            allowedToken = 0x927488F48ffbc32112F1fF721759649A89721F8F;
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
            // Default to transaction acceptance
            magic = PAYMASTER_VALIDATION_SUCCESS_MAGIC;
            require(
                _transaction.paymasterInput.length >= 4,
                "The standard paymaster input must be at least 4 bytes long"
            );

            bytes4 paymasterInputSelector = bytes4(
                _transaction.paymasterInput[0:4]
            );
            // Check if it's approval-based flow
            if (paymasterInputSelector == IPaymasterFlow.approvalBased.selector) {
                (address token, uint256 amount, bytes memory data) = abi.decode(
                    _transaction.paymasterInput[4:],
                    (address, uint256, bytes)
                );

                // Ensure the token is the allowed one
                require(token == allowedToken, "Invalid token");

                // Check user's allowance
                address userAddress = address(uint160(_transaction.from));
                address thisAddress = address(this);
                uint256 providedAllowance = IERC20(token).allowance(userAddress, thisAddress);
                require(
                    providedAllowance >= PRICE_FOR_PAYING_FEES,
                    "Min allowance too low"
                );

                uint256 requiredETH = _transaction.gasLimit * _transaction.maxFeePerGas;
                try IERC20(token).transferFrom(userAddress, thisAddress, amount) {}
                catch (bytes memory revertReason) {
                    if (revertReason.length <= 4) {
                        revert("Failed to transferFrom from user's account");
                    } else {
                        assembly {
                            revert(add(0x20, revertReason), mload(revertReason))
                        }
                    }
                }

                (bool success, ) = payable(BOOTLOADER_FORMAL_ADDRESS).call{value: requiredETH}("");
                require(success, "Failed to transfer tx fee to bootloader.");
            } else {
                revert("Unsupported paymaster flow");
            }
        }

        function postTransaction(
            bytes calldata _context,
            Transaction calldata _transaction,
            bytes32,
            bytes32,
            ExecutionResult _txResult,
            uint256 _maxRefundedGas
        ) external payable override onlyBootloader {}

        function withdraw(address _to) external onlyOwner {
            (bool success, ) = payable(_to).call{value: address(this).balance}("");
            require(success, "Failed to withdraw funds from paymaster.");
        }

        receive() external payable {}
    }
    ```
  ::
::

**Key components:**

- The `ApprovalFlowPaymaster` contract allows for transactions costs to be covered using an allowed ERC20 token at the
exchange of 1.
- **Allowed Token:** Transactions are facilitated using the `CROWN` token at address [0x927488F48ffbc32112F1fF721759649A89721F8F](https://sepolia.explorer.zksync.io/address/0x927488F48ffbc32112F1fF721759649A89721F8F#contract),
with a fee set at a constant value of 1.
- **`validateAndPayForPaymasterTransaction` Method:** This critical method evaluates transactions
to decide if the contract will cover the gas fees. It confirms the token used matches the allowed token
and checks if the token allowance is adequate. If conditions are met, it proceeds to transfer funds calculated
as `tx.gasprice * tx.gasLimit` to the `bootloader`.
- **`postTransaction`** Method: An optional method invoked
post-transaction execution, provided the transaction doesn't fail
due to out-of-gas errors. It receives several parameters, including the transaction's context and result, aiding in finalizing paymaster duties.
- **`onlyBootloader`** Modifier: Ensures that certain methods are exclusively callable by the system's bootloader,
adding an extra layer of security and control.

---

## Compile and deploy the `ApprovalFlowPaymaster` contract

:display-partial{path = "/_partials/_compile-solidity-contracts"}

Upon successful compilation, you'll receive output detailing the
`zksolc` and `solc` versions used during compiling and the number
of Solidity files compiled.

```bash
Compiling contracts for zkSync Era with zksolc v1.4.0 and solc v0.8.17
Compiling 1 Solidity file
Successfully compiled 1 Solidity file
```

The compiled artifacts will be located in the `/artifacts-zk` folder.

The script to deploy the `ApprovalFlowPaymaster` contract is located at [`/deploy/deployApprovalFlowPaymaster.ts`](https://github.com/matter-labs/zksync-contract-templates/blob/main/templates/quickstart/hardhat/paymaster/deploy/deployApprovalFlowPaymaster.ts).

```typescript [deployApprovalFlowPaymaster.ts]
import { deployContract, getWallet, getProvider } from "./utils";
import { ethers } from "ethers";

// An example of a basic deploy script
// It will deploy a CrowdfundingCampaign contract to selected network
// `parseEther` converts ether to wei, and `.toString()` ensures serialization compatibility.
export default async function() {
  const contractArtifactName = "ApprovalFlowPaymaster";
  const constructorArguments = [];
  const contract = await deployContract(
    contractArtifactName,
    constructorArguments
  );
  const wallet = getWallet();
  const provider = getProvider();

  // Supplying paymaster with ETH
  // Paymaster will receive CROWN tokens from users and
  // cover the gas fees for the transactions using ETH
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

- **`deployContract` Method:** Utilized for deploying the `ApprovalFlowPaymaster` contract. This method takes the name of the
contract and any constructor arguments needed for initialization,
mirroring the deployment process used for the `CrowdfundingCampaign` contract.
- **Funding the Paymaster:** An important step where the deployed `ApprovalFlowPaymaster` contract is funded with ETH
to cover transaction fees for users. The script sends a transaction
from the deployer's wallet to the paymaster contract, ensuring it has sufficient balance to operate.

Execute the deployment command corresponding to your package manager. The default command
deploys to the configured network in your Hardhat setup. For local deployment, append
`--network inMemoryNode` to deploy to the local in-memory node running.

::code-group

```bash [npm]
npx hardhat deploy-zksync --script deployApprovalFlowPaymaster.ts
# To deploy the contract on local in-memory node:
# npx hardhat deploy-zksync --script deployApprovalFlowPaymaster.ts --network inMemoryNode
```

```bash [yarn]
yarn hardhat deploy-zksync --script deployApprovalFlowPaymaster.ts
# To deploy the contract on local in-memory node:
# yarn hardhat deploy-zksync --script deployApprovalFlowPaymaster.ts --network inMemoryNode
```

```bash [pnpm]
pnpx exec hardhat deploy-zksync --script deployApprovalFlowPaymaster.ts
# To deploy the contract on local in-memory node:
# pnpx exec hardhat deploy-zksync --script deployApprovalFlowPaymaster.ts --network inMemoryNode
```

```bash [bun]
bun run hardhat deploy-zksync --script deployApprovalFlowPaymaster.ts
# To deploy the contract on local in-memory node:
# bun run hardhat deploy-zksync --script deployApprovalFlowPaymaster.ts --network inMemoryNode
```

::

Upon successful deployment, you'll receive output detailing the deployment process,
including the contract address, source, and encoded constructor arguments:

```bash
Starting deployment process of "ApprovalFlowPaymaster"...
Estimated deployment cost: 0.0006278488 ETH

"ApprovalFlowPaymaster" was successfully deployed:
 - Contract address: 0x4653CDB4D46c7CdFc5B1ff14ca1B15Db2B0b7819
 - Contract source: contracts/ApprovalFlowPaymaster.sol:ApprovalFlowPaymaster
 - Encoded constructor arguments: 0x

Requesting contract verification...
Your verification ID is: 10923
Contract successfully verified on zkSync block explorer!
Paymaster ETH balance is now 5000000000000000
```

---

## Interact with the `ApprovalFlowPaymaster` contract

This section will navigate you through the steps to interact with the
[`ApprovalFlowPaymaster`](https://github.com/matter-labs/zksync-contract-templates/blob/main/templates/quickstart/hardhat/paymaster/contracts/ApprovalFlowPaymaster.sol)
contract, using it to cover transaction fees for your operation.

### Obtain CROWN tokens

The `ApprovalFlowPaymaster` requires CROWN tokens to cover transaction gas costs. To use this
paymaster, you will first need to acquire CROWN tokens by minting them yourself. Follow these
steps to mint CROWN tokens:

1. Go to the [CROWN token contract on Sepolia](https://sepolia.explorer.zksync.io/address/0x927488F48ffbc32112F1fF721759649A89721F8F#contract).
2. Click on the **Contract** tab.
3. Navigate to the **Write** tab.
4. Locate the **mint** function, which is typically labeled as **6.mint**:
    - In the `_to` field, enter your wallet address where you want the tokens to be deposited.
    - In the `_amount` field, specify the number of tokens you wish to mint.
5. Click on the **mint** button to execute the transaction.

Here is a visual guide to assist you:
![CROWN mint](/images/quickstart-paymasters/crown-mint.png)

Ensure that your wallet is connected and configured for the Sepolia network before attempting to mint tokens.

### Interaction script

The interaction script is situated in the `/deploy/interact/` directory, named [`interactWithApprovalFlowPaymaster.ts`](https://github.com/matter-labs/zksync-contract-templates/blob/main/templates/quickstart/hardhat/paymaster/deploy/interact/interactWithApprovalFlowPaymaster.ts).

Ensure the `CONTRACT_ADDRESS` and `PAYMASTER_ADDRESS` variables are set to your deployed contract and paymaster addresses, respectively.

::drop-panel
  ::panel{label="interactWithApprovalFlowPaymaster.ts"}

  ```typescript [interactWithApprovalFlowPaymaster.ts]
  import * as hre from "hardhat";
  import { getWallet, getProvider } from "../utils";
  import { ethers } from "ethers";
  import { utils } from "zksync-ethers";

  // Address of the contract to interact with
  const CONTRACT_ADDRESS = "YOUR-CONTRACT-ADDRESS";
  const PAYMASTER_ADDRESS = "YOUR-PAYMASTER-ADDRESS";
  // Sepolia CROWN token address
  const TOKEN_ADDRESS = "0x927488F48ffbc32112F1fF721759649A89721F8F"

  if (!CONTRACT_ADDRESS || !PAYMASTER_ADDRESS)
      throw new Error("Contract and Paymaster addresses are required.");

  export default async function() {
    console.log(`Running script to interact with contract ${CONTRACT_ADDRESS} using paymaster ${PAYMASTER_ADDRESS}`);

    // Load compiled contract info
    const contractArtifact = await hre.artifacts.readArtifact(
      "CrowdfundingCampaignV2"
    );
    const provider = getProvider();
    // Initialize contract instance for interaction
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      contractArtifact.abi,
      getWallet()
    );

    const contributionAmount = ethers.parseEther("0.001");
    // Get paymaster params for the ApprovalBased paymaster
    const paymasterParams = utils.getPaymasterParams(PAYMASTER_ADDRESS, {
      type: "ApprovalBased",
      token: TOKEN_ADDRESS,
      minimalAllowance: 1n,
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
  }
  ```

  ::
::

**Key Components:**

- **Paymaster Parameters:** Before executing transactions that involve the contract, the script prepares paymaster parameters using
`getPaymasterParams`. This specifies the paymaster contract to be
used and the type of paymaster flow, which in this case is `Approval`, and includes the token address
of the ERC20 token, and the minimum allowance set to 1.

- **Transaction with Paymaster:** Demonstrated by the `contribute` function call, the script shows how to include paymaster parameters
in transactions. This allows the paymaster to cover transaction
fees using the `CROWN` token, providing a seamless experience for users.

Execute the command corresponding to your package manager:

::code-group

```bash [npm]
npx hardhat deploy-zksync --script interact/interactWithApprovalFlowPaymaster.ts
```

```bash [yarn]
yarn hardhat deploy-zksync --script interact/interactWithApprovalFlowPaymaster.ts
```

```bash [pnpm]
pnpx exec hardhat deploy-zksync --script interact/interactWithApprovalFlowPaymaster.ts
```

```bash [bun]
bun run hardhat deploy-zksync --script interact/interactWithApprovalFlowPaymaster.ts
```

::

Upon successful usage, you'll receive output detailing the transaction:

```bash
Running script to interact with contract 0x68E8533acE01019CB8D07Eca822369D5De71b74D using paymaster 0x4653CDB4D46c7CdFc5B1ff14ca1B15Db2B0b7819
Estimated gas limit: 459220
Transaction hash: 0x6a5a5e8e7d7668a46260b6daf19c7a5579fa4a5ba4591977a944abb1a618187a
```

🎉 Great job! You've successfully interacted with the `CrowdfundingCampaignV2` using a paymaster to cover the transaction fees using the `CROWN` token.
