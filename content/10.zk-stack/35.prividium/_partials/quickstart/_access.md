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
The format should the same signature as "canonical" signature defined in [Solidity ABI](https://docs.soliditylang.org/en/latest/abi-spec.html).

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

You can fully customize the types by editing the `zksync-era/private-rpc/src/permissions/yaml-parser.ts` file.
