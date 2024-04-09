---
title: UUPS Proxy Contract Upgradeability
---

### What is a UUPS upgradeable contract?
UUPS (Universal Upgradeable Proxy Standard) Upgradeable Contracts embed the upgrade logic
within the contract itself, simplifying upgrades and enhancing security. The components are:

1. **Proxy Contract**: Contains minimal logic, primarily delegating calls to the implementation
contract. Unlike other proxies, it doesn't require a separate upgrade function.
2. **Implementation Contract**: Houses the business logic and the upgrade functionality,
enabling the contract to upgrade itself from within.
3. **Admin Role**: Assigned to an entity with the authority to initiate upgrades, ensuring
controlled access to the upgrade function.

In UUPS contracts, upgrades are performed by invoking the upgrade function within the
implementation contract, which updates the proxy's reference to point to a new implementation.
This self-contained approach minimizes the proxy's complexity and gas costs, while the
implementation contract's built-in upgrade mechanism ensures only authorized upgrades.
The contract's state remains intact across upgrades, facilitating continuous improvement
with a stable user experience.

::content-switcher
---
items: [{
  label: 'Hardhat',
  partial: '_upgrading/_uups/_hardhat_transparent_contract_upgradability'
}, {
  label: 'Foundry',
  partial: '_upgrading/_uups/_foundry_transparent_contract_upgradability'
}]
---
::
