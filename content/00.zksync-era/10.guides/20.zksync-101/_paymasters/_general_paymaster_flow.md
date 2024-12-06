---
title: General Paymaster
description: Learn to deploy contract factories in the ZKsync environment.
---

## Understanding the `GaslessPaymaster` contract

Let's start by reviewing the
[`contracts/4-paymaster/gasless/GaslessPaymaster.sol`][gasless-paymaster-sol]
contract:

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

## Compile and deploy the `GaslessPaymaster` contract

Run the npm script `compile` to compile the contracts:

```bash [npm]
npm run compile
```

The script to deploy the `GaslessPaymaster` is located at [`/deploy/4-paymaster/gasless/deploy.ts][deploy-script].

**Key Components:**

- **`deployContract` Method:** Utilized for deploying the `GaslessPaymaster` contract. This method takes the name of the
contract and any constructor arguments needed for initialization,
mirroring the deployment process used for the `CrowdfundingCampaign` contract.
- **Funding the Paymaster:** An important step where the deployed `GaslessPaymaster` contract is funded with ETH
to cover transaction fees for users. The script sends a transaction
from the deployer's wallet to the paymaster contract, ensuring it has sufficient balance to operate.

Execute the deploy npm script command to upgrade:

```bash [npm]
npm run deploy:gasless-paymaster
```

Upon successful deployment, you'll receive output detailing the deployment process,
including the contract address, source, and encoded constructor arguments:

```bash
GaslessPaymaster contract deployed at <0xYOUR_PAYMASTER_ADDRESS>

Paymaster ETH balance is now 0.005
```

---

## Interact with the GaslessPaymaster contract

We will interact with the `GaslessPaymaster` by creating a `CrowdfundCampaign`
and have the paymaster pay for the transaction fees for your contribution.

The interaction script is situated in the `/deploy/4-paymaster/gasless` directory,
named [`interact.ts`][interact-script].

Ensure the `YOUR_PAYMASTER_ADDRESS` variable is set to your deployed paymaster address.

**Key Components:**

- **Paymaster Parameters:** Before executing transactions that involve the contract, the script prepares paymaster parameters using
`getPaymasterParams`. This specifies the paymaster contract to be
used and the type of paymaster flow, which in this case is `General`.

- **Transaction with Paymaster:** Demonstrated by the `contribute` function call, the script shows how to include paymaster parameters
in transactions. This allows the paymaster to cover transaction
fees, providing a seamless experience for users.

Run the npm script that interacts with the gasless paymaster:

```bash [npm]
npm run interact:gasless-paymaster
```

Upon successful usage, you'll receive output detailing the transaction:

```bash
Deploying a CrowdfundingCampaign contract...
Contributing 0.01 to the crowdfund contract...
Transaction hash: 0x1281592537c81f4d4ca259022b649dc582b186911af8f6b3612568383ea99b1b
Contribution successful!
```

🎉 Great job! You've successfully interacted with the `CrowdfundingCampaign` using a paymaster to cover the transaction fees.

[gasless-paymaster-sol]: https://github.com/matter-labs/zksync-contract-templates/blob/main/templates/101/contracts/4-paymaster/gasless/GaslessPaymaster.sol
[deploy-script]: https://github.com/matter-labs/zksync-contract-templates/blob/main/templates/101/deploy/4-paymaster/gasless/deploy.ts
[interact-script]: https://github.com/matter-labs/zksync-contract-templates/blob/main/templates/101/deploy/4-paymaster/gasless/interact.ts
