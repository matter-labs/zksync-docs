---
title: Quickstart - Config 2
description: Understand the access config
---

For more details about configuring this file, see the [components page](/zk-stack/prividium/components).

#### ERC-20 Config

Replace the generated access config with the one below:

::drop-panel
  ::panel{label="permissions.yaml"}
    ```ts
    :code-import{filePath="prividium/permissions.yaml"}
    ```
  ::
::

Replace `<0xYOUR_CONTRACT_ADDRESS>` with the deployed ERC-20 contract address.

Note that the `transfer` and `approve` methods are marked as `public`,
however this doesn't mean that anyone can see the details of these transactions.
This is because for these methods, the private proxy RPC API validates that current user is equal to the `msg.sender` in the transactions.

To apply changes to the permissions file,
you will need to restart the Proxy API.
If your config file isn't correctly configured,
the API won't start.
