---
title: foundry create keystore
---

Follow these steps to securely store your wallet's private key to use it in Foundry projects:

1. **Extract Your Private Key:** If you are using the local era node, use a private key from the available rich
   accounts. Otherwise, find your personal wallet's private key. For MetaMask users, here's how to [export your wallet's
   private key](https://support.metamask.io/hc/en-us/articles/360015289632-How-to-export-an-account-s-private-key).

2. **Create a Foundry keystore:** Create a keystore and import your private key by running

```bash
cast wallet import myKeystore --interactive
# enter your PK when prompted, provide a password, and copy the returned address
```

It'll return an address (keystore address).

::callout{icon="i-heroicons-information-circle" color="blue"}
Note that the name `myKeystore` is arbitrary and can be updated. For our docs, we've chosen this name for consistency.
If you decide to use another name, be sure to reference it when using `cast`.
::

#### Using the keystore

When running commands that require a private key, like `forge create` or `cast send`, use `--account myKeystore --sender <KEYSTORE_ADDRESS>`. This will
require you to enter the keystore password you provided before.
