---
title: Quickstart - Foundry Install OpenZeppelin
---

:test-action{actionId="install-foundry-openzeppelin"}

```bash
forge install OpenZeppelin/openzeppelin-contracts
```

Once installed, add a `remappings.txt` file and add this line:

:test-action{actionId="create-remappings"}
:test-action{actionId="modify-remappings"}

```txt
@openzeppelin/contracts/=lib/openzeppelin-contracts/contracts/
```
