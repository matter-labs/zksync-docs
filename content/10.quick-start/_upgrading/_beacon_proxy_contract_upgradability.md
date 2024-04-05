---
title: Beacon Proxy Contract Upgradeability
---

### What is a beacon proxy upgradeable contract?
Beacon Proxy Upgradeable Contracts leverage a beacon to manage upgrades, allowing
for centralized logic updates across multiple proxies. The structure includes:

1. **Beacon Contract**: Acts as the central point holding the address of the current logic contract.
It enables updating the logic for all associated proxies through a single transaction.
2. **Proxy Contracts**: These lightweight contracts delegate calls to the logic contract address
provided by the beacon, maintaining their own state and balance.
3. **Logic Contract**: Contains the executable business logic, which can be updated by changing
the beacon's reference without altering individual proxies.
4. **Admin Address**: Authorized to update the logic contract address in the beacon, ensuring controlled and secure upgrades.

This arrangement allows multiple proxy contracts to be upgraded simultaneously by updating
the logic contract address in the beacon, streamlining the upgrade process. It preserves
the state and balance of each proxy contract, offering an efficient way to roll out new
features or fixes while maintaining a uniform interface for users.

::content-switcher
---
items: [{
  label: 'Hardhat',
  partial: '_upgrading/_beacon/_hardhat_beacon_contract_upgradability'
}, {
  label: 'Foundry',
  partial: '_upgrading/_beacon/_foundry_beacon_contract_upgradability'
}]
---
::
