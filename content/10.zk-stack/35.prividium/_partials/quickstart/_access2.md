---
title: Quickstart - Config 2
description: Understand the access config
---

#### ERC-20 Config

Replace the generated access config with the one below:

:test-action{actionId="open-permissions"}
:test-action{actionId="update-permissions"}

::drop-panel
  ::panel{label="private-rpc-permissions.yaml"}
    ```ts
    :code-import{filePath="prividium/permissions.yaml"}
    ```
  ::
::

:test-action{actionId="make-env-file"}
:test-action{actionId="extract-contract-id"}
:test-action{actionId="update-token-address"}
:test-action{actionId="restart-proxy"}

Then replace `<0xYOUR_CONTRACT_ADDRESS>` with the deployed ERC-20 contract address.

Note that the `transfer` and `approve` methods are marked as `public`,
however this doesn't mean that anyone can see the details of these transactions.
This is because for these methods, the private proxy RPC API validates that current user is equal to the `msg.sender` in the transactions.

To apply changes to the permissions file,
you will need to restart the Proxy API.
If your config file isn't correctly configured,
the API won't start.
