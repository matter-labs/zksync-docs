---
title: Quickstart - Interact
description: Interact with token contract
---

Make a new file in the `scripts` folder called `priv-interact.ts`
and copy/paste the script below:

::drop-panel
  ::panel{label="scripts/priv-interact.ts"}
    ```ts
    :code-import{filePath="prividium/scripts/priv-interact.ts"}
    ```
  ::
::

This script:

- Registers the deployer address as a user
- Uses the generated user token to access the Proxy RPC API
- Sends tokens from the deployer address to another address

There is no method available to fetch a token that was previously generated.
If you generate a user token and it's forgotten,
you can simply generate a new token.

Before running, update your `.env` file with the `RECIPIENT_ADDRESS` and `CONTRACT_ADDRESS`.
Use the deployed ERC20 contract address for `CONTRACT_ADDRESS`,
and any other wallet address for the recipient.
Choose an address you also have the private key for.

Then, run the interact script with:

::code-group

```bash [npm]
npx hardhat run ./scripts/priv-interact.ts
```

```bash [yarn]
yarn hardhat run ./scripts/priv-interact.ts
```

```bash [pnpm]
pnpm hardhat run ./scripts/priv-interact.ts
```

```bash [bun]
bun hardhat run ./scripts/priv-interact.ts
```

::

Note that the user will be able to see their own balance, but not the balance of the recipient wallet.
If you try to access the balance from a different wallet (or without a wallet), you will see an `Unauthorized` error.

#### Checking balance

Make a new file called `check-balance.ts` in the scripts folder
and copy/paste the script below.

::drop-panel
  ::panel{label="scripts/check-balance.ts"}
    ```ts
    :code-import{filePath="prividium/scripts/check-balance.ts"}
    ```
  ::
::

This script just checks the ERC20 balance of the default wallet.

To check the balance of another address,
you must register a user token for that address,
update the private key in your `.env` file,
and then run the `check-balance` script.

Before running, update your `.env` file with the `USER_TOKEN`
obtained during the previous step.

You can run the script with:

::code-group

```bash [npm]
npx hardhat run ./scripts/check-balance.ts
```

```bash [yarn]
yarn hardhat run ./scripts/check-balance.ts
```

```bash [pnpm]
pnpm hardhat run ./scripts/check-balance.ts
```

```bash [bun]
bun hardhat run ./scripts/check-balance.ts
```

::
