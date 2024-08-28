---
title: Migrating Foundry project to ZKsync Era
description: Learn how to migrate an existing Foundry project to ZKsync Era.
---

First of all, we highly recommend you to check the ZKsync Foundry short [overview](/build/tooling/foundry/overview) page
to learn about made changes, features and limitations.

First step you need to do to migrate your project, is install ZKsync foundry. You can do this
by following our [installation guide](/build/foundry/getting-started#installation-guide).

Now you are ready to migrate.

### Compilation

You have to rebuild your foundry project. To do this, follow [`Compilation with forge build --zksync`](/build/foundry/getting-started#compilation-with-forge-build-zksync) guide.

### Deployment

To deploy your contracts on ZKsync Era, follow [`Deployment with `forge create --zksync`](/build/foundry/getting-started#deployment-with-forge-create-zksync) guide.


### ZKsync Chain Interactions with `cast`
TODO


### Configuration

More about configuration is described in Getting Started [configuration](/build/foundry/getting-started#configuration) guide.

::callout{icon="i-heroicons-information-circle-16-solid" color="amber"}
We are going to introduce the `ZK Foundry Discrepancies Guide` soon, where we will cover the differences, potential challenges, and best practices for a successful migration. Besides we are working on ZKsync Foundry book. Stay tuned!
::

## Testing
Check out our guide for foundry testing [here](/build/test-and-debug/foundry).
