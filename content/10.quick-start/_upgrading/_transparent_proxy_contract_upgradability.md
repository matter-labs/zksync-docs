---
title: Transparent Proxy Contract Upgradeability
---

### What is a transparent upgradeable contract?
Transparent Upgradeable Contracts utilize the proxy pattern to facilitate post-deployment
logic updates while preventing accidental function collisions. They consist of:

1. **Proxy Contract**: Manages storage, balance, and delegates calls to the logic contract,
except for those by the admin, ensuring clear separation between user and administrative interactions.
2. **Logic Contract**: Houses the actual business logic, upgradeable by swapping out for new versions.
3. **Admin Address**: Holds the rights to upgrade the logic contract, with its commands executed
exclusively by the proxy to prevent unintended logic execution.

This setup ensures only non-administrative calls reach the logic contract, allowing
for safe and seamless upgrades. By switching the logic contract to a newer version
while keeping the original proxy intact, the contract's state and balance are preserved.
This facilitates improvements or bug fixes without changing the proxy, maintaining a
consistent user interface.

## Framework selection

Select the framework you want to get started using zkSync Era with.

::content-switcher
---
items: [{
  label: 'Hardhat',
  partial: '_upgrading/_transparent/_hardhat_transparent_contract_upgradability'
}, {
  label: 'Foundry',
  partial: '_upgrading/_transparent/_foundry_transparent_contract_upgradability'
}]
---
::
