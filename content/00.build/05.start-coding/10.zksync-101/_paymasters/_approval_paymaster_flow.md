---
title: Approval Paymaster
description: Learn to deploy contract factories in the ZKsync environment.
---

## Understanding the `ApprovalPaymaster` contract

Let's start by reviewing the contract at [`contracts/4-paymaster/approval/ApprovalFlowPaymaster.sol`][approval-flow-paymaster-sol]:

**Key components:**

- The `ApprovalFlowPaymaster` contract allows for transactions costs to be covered using an allowed ERC20 token at the
exchange of 1.
- **Allowed Token:** Transactions are facilitated using the
  [`CROWN`][crown-token-sol]
  token that we'll deploy along with the `ApprovalPaymaster` contract,
  with a fee set at a constant value of 1.
- **`validateAndPayForPaymasterTransaction` Method:**
  This critical method evaluates transactions
  to decide if the contract will cover the gas fees. It confirms the token used matches the allowed token
  and checks if the token allowance is adequate. If conditions are met, it proceeds to transfer funds calculated
  as `tx.gasprice * tx.gasLimit` to the `bootloader`.
- **`postTransaction`** Method: An optional method invoked
  post-transaction execution, provided the transaction doesn't fail
  due to out-of-gas errors. It receives several parameters, including the transaction's context and result, aiding in finalizing paymaster duties.
  - **`onlyBootloader`** Modifier: Ensures that certain methods are exclusively callable by the system's bootloader,
  adding an extra layer of security and control.

---

## Deploy the `ApprovalFlowPaymaster` and `CrownToken` contracts

Run the npm script `compile` to compile the contracts:

```bash [npm]
npm run compile
```

The compiled artifacts will be located in the `/artifacts-zk` folder.

The script to deploy the `ApprovalFlowPaymaster` contract is located at [`/deploy/4-paymaster/approval/deploy.ts`][deploy-script].

The script deploys the `Crown` token and the `ApprovalFlowPaymaster` contracts.
It also funds the `ApprovalFlowPaymaster` with "0.005" ETH to use
for transaction payments.

Run the deploy script from npm using the following command:

```bash [npm]
npm run deploy:approval-paymaster
```

On success, the console will return the addresses of the `Crown` token
as well as the `ApprovalFlowPaymaster`.

```bash
CrownToken contract deployed at 0x4f4A0F99981E9884C9a3FfDeD9C33FF8D088bC30
ApprovalFlowPaymaster contract deployed at 0xd00aA47887597f95a68f87f1a5C96Df1B3fF0bdF

Paymaster ETH balance is now 0.005
```

---

## Interact with the `ApprovalFlowPaymaster` contract

This section will navigate you through the steps to interact with the
`ApprovalFlowPaymaster` contract, using it to cover transaction fees for your operation.

### Obtain CROWN tokens

The `ApprovalFlowPaymaster` requires CROWN tokens to cover transaction gas costs. To use this
paymaster, you will first need to acquire CROWN tokens by minting them yourself.
We will use ZKsync CLI to interact with the Crown token contract:

Run the following in your console to mint yourself Crown tokens.
Replace the contract address with your Crown token contract's address.
The private key is for the local rich wallet used to deploy the smart contracts.

```bash
zksync-cli contract write \
--chain in-memory-node \
--abi artifacts-zk/contracts/4-paymaster/approval/CrownToken.sol/CrownToken.json \
--contract 0x4f4A0F99981E9884C9a3FfDeD9C33FF8D088bC30 \
--pk 0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110
```

The CLI will prompt for the method, navigate with the arrow keys and press **Enter**
on `mint(address to, uint256 amount)`.

The next prompt will ask for an address, we will use the local rich wallet address, `0x36615Cf349d7F6344891B1e7CA7C72883F5dc049`.

The final prompt will ask for the amount to mint, type in `500000000000000000`.

<!-- TODO: add zksync-cli wallet balance command to check crown balance -->

### Interact with the ApprovalFlowPaymaster contract

We will interact with the `ApprovalFlowPaymaster` by creating a `CrowdfundCampaign` and have the paymaster pay for the contribution transaction.

The interaction script is found at [`deploy/4-paymaster/approval/interact.ts`][interact-script].

Set the `YOUR_PAYMASTER_ADDRESS` and `YOUR_TOKEN_ADDRESS` variables to the
addresses of your paymaster and crown token addresses.

**Key Components:**

- **Paymaster Parameters:** Before executing transactions that involve the contract, the script prepares paymaster parameters using
`getPaymasterParams`. This specifies the paymaster contract to be
used and the type of paymaster flow, which in this case is `Approval`, and includes the token address
of the ERC20 token, and the minimum allowance set to 1.

- **Transaction with Paymaster:** Demonstrated by the `contribute` function call, the script shows how to include paymaster parameters
in transactions. This allows the paymaster to cover transaction
fees using the `CROWN` token, providing a seamless experience for users.

Run the npm script that interacts with the approval paymaster:

```bash [npm]
npm run interact:approval-paymaster
```

Upon successful usage, you'll receive output detailing the transaction:

```bash
Deploying a CrowdfundingCampaign contract...
Contributing 0.0001 to the crowdfund contract...
Transaction hash: 0xf26ee884ef116b226a45b45ec689ca1f2e9367f83164959b27a960802f89e627
Contribution successful!
```

🎉 Great job! You've successfully interacted with the `CrowdfundingCampaign` using a paymaster to cover the transaction fees using the `CROWN` token.

[approval-flow-paymaster-sol]: https://github.com/matter-labs/zksync-contract-templates/blob/main/templates/101/contracts/4-paymaster/approval/ApprovalFlowPaymaster.sol
[crown-token-sol]: https://github.com/matter-labs/zksync-contract-templates/blob/main/templates/101/contracts/4-paymaster/approval/CrownToken.sol
[deploy-script]: https://github.com/matter-labs/zksync-contract-templates/blob/main/templates/101/deploy/4-paymaster/approval/deploy.ts
[interact-script]: https://github.com/matter-labs/zksync-contract-templates/blob/main/templates/101/deploy/4-paymaster/approval/interact.ts
