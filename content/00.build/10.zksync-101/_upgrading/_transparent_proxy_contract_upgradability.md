---
title: Transparent Upgradeable Proxy Contract
---

### What is a transparent upgradeable proxy contract?
Transparent upgradeable contracts utilize the proxy pattern to facilitate post-deployment
logic updates while preventing accidental function collisions. They consist of:

1. **Proxy Contract**: Manages storage, balance, and delegates calls to the logic contract,
except for those by the admin, ensuring clear separation between user and administrative interactions.
1. **Logic Contract**: Houses the actual business logic, upgradeable by swapping out for new versions.
1. **Admin Address**: Holds the rights to upgrade the logic contract, with its commands executed
exclusively by the proxy to prevent unintended logic execution.

This setup ensures only non-administrative calls reach the logic contract, allowing
for safe and seamless upgrades. By switching the logic contract to a newer version
while keeping the original proxy intact, the contract's state and balance are preserved.
This facilitates improvements or bug fixes without changing the proxy, maintaining a
consistent user interface.

---

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
