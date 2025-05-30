---
title: Quickstart - Contract Verifier
description: Setup the contract verifier
---

### Start the contract verifier

The contract verifier is used to check contract source code against deployed bytecode.
This is going to be used in the explorer to display the source code and ABIs of contracts.

In a new terminal run:

:test-action{actionId="init-verifier"}

```bash
zkstack contract-verifier init \
--zksolc-version v1.5.6 \
--zkvyper-version v1.5.10  \
--solc-version 0.8.24 \
--era-vm-solc-version 0.8.28-1.0.2 \
--vyper-version v0.4.1
```

This will download the needed binaries for verifying contracts on the block explorer.

Next, run:

:test-action{actionId="run-verifier"}

```bash
zkstack contract-verifier run
```

Once this is done you are going to have the verifier running on port `3070`.
