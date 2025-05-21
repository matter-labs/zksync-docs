---
title: Quickstart - Config
description: Understand the access config
---

The permissions config file at
`my_elastic_network/chains/prividium_chain/configs/private-rpc-permissions.yaml`
can be edited based on what access you want end users to have.

There are two sections in the permissions file: `groups` and `contracts`.

### Groups Access

You can define hard-coded groups of administrative addresses in the `groups` section.
A group consists of a name and a list member addresses.

After defining a group,
the group name can be used in the `contracts` section to grant the entire group certain access.

### Contracts Access

The `contracts` section defines the level of access available to specific contracts and their functions.
If a contract is not included here, or a function not defined,
it can only be accessed via the standard RPC API.

#### Defining Methods

For a given contract address, the `methods` field defines the contract functions that can be called.

The function signature is used to identify functions and define rules for them.
The format should be nearly identical to the function signature in the target contract, with a few exceptions.
The following items can be omitted:

- `memory` or `calldata` keywords
- the `returns` keyword
- `virtual` and `override` keywords
- the variable names of arguments

```solidity
function <functionName>(<type of param1>, <type of param2>, ...)
    <public | private | internal | external>
    <pure | view | payable>
    returns (<type of return1>, <type of return2>, …)
```

#### Method Access

For each function, you can define a rule for `read` and `write` regardless of whether the function itself is a pure function.
(clarify what read access changes here)

For each rule within a `read` or `write` section,
you must choose a `type`.

The types available out-of-the-box include:

- `public`: anyone can call this function.
- `closed`: no one can call this function (default).
- `group`: only the specified groups can call this
- `checkArgument`: the specified argument index must match the function caller's address
- `oneOf`: allows you to define more than one rule type.
  It functions as an `OR` operator;
  if at least one condition is met, access is granted.

In addition to these rules,
there is a universal rule applied
so that users can only see transactions where
their address is equal to the `msg.sender`.
(how does this affect `read` access ?)

You can fully customize the types by editing the `zksync-era/private-rpc/src/permissions/yaml-parser.ts` file.
For more details about configuring this file, see (/zk-stack/prividium/components#TODO: add section).

#### ERC-20 Config

Replace the generated access config with the one below:

```yaml
:code-import{filePath="prividium/permissions.yaml"}
```

Replace `<0xYOUR_CONTRACT_ADDRESS>` with the deployed ERC-20 contract address.

Note that the `transfer` and `approve` methods are marked as `public`,
however this doesn't mean that anyone can see the details of these transactions.
This is because for these methods, the private proxy RPC API validates that current user is equal to the `msg.sender` in the transactions.

To apply changes to the permissions file,
you will need to restart the proxy API.
If your config file isn't correctly configured,
the API won't start.
