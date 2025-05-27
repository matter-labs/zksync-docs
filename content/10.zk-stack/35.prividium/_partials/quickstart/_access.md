---
title: Quickstart - Config
description: Understand the access config
---

The permissions config file at
`/chains/prividium_chain/configs/private-rpc-permissions.yaml`
can be edited based on what access you want end users to have.

There are two sections in the permissions file:

- `groups`: Logical collections of users or addresses sharing the same permissions.
- `contracts`: Specific contracts or methods that a group is allowed to access.

### Groups Access

You can define hard-coded groups of administrative addresses in the `groups` section.
A group consists of a name and a list of member addresses.

After defining a group,
the group name can be used in the `contracts` section to grant the entire group certain access.

### Contracts Access

The `contracts` section defines the level of access available to specific contracts and their functions.
If a contract is not included here, or a function not defined,
it can only be accessed via the standard RPC API.

Note that contracts can only be deployed via the standard RPC API.

#### Defining Methods

For a given contract address, the `methods` field defines the contract functions that can be called.

The function signature is used to identify functions and define rules for them.
The format should the same signature as the canonical signature defined in [Solidity ABI](https://docs.soliditylang.org/en/latest/abi-spec.html).

To generate a list of your contract's functions in this format,
you can use the `formatAbiItem` method from [`abitype`](https://abitype.dev/api/human#formatabiitem-1),
as shown in the example script below.

```ts
:code-import{filePath="prividium/scripts/print-format.ts:function-signature"}
```

#### Method Access

For each function, you can define a rule for `read` and `write` regardless of whether the function itself is a pure function.

For each rule within a `read` or `write` section,
you must choose a `type`.

The types available out-of-the-box include:

- `public`: anyone can call this function.
- `closed`: no one can call this function (default).
- `group`: only the specified groups can call this.
- `checkArgument`: the specified argument index must match the function caller's address.
- `oneOf`: allows you to define more than one rule type.
  It functions as an `OR` operator;
  if at least one condition is met, access is granted.

In addition to these rules,
there is a universal rule applied
so that users can only see transactions where
their address is equal to the `msg.sender`.

You can fully customize the types and their access logic by editing the `zksync-era/private-rpc/src/permissions/yaml-parser.ts` file.
