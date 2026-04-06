---
title: Get testnet funds
---

## Get funds for your wallet

Once you have your wallet connected to the ZKsync OS Developer Preview environment,
you can bridge testnet ETH from Sepolia Testnet.
You can get testnet funds on Sepolia from one of many [testnet faucets](/zksync-network/zksync-era/ecosystem/network-faucets#sepolia-faucets).

### Bridging testnet ETH

The easiest way to bridge funds to the testnet is by using the [ZKsync OS Portal](https://zksync-os.portal.zksync.io/) to bridge testnet ETH over.

You can also bridge funds in your terminal with [`cast`](https://www.getfoundry.sh/cast)
or in a script using [`zksync-js`](https://matter-labs.github.io/zksync-js/latest/overview/index.html) as shown in the examples below.

#### Bridging with `cast`

<!-- // cspell: disable -->
```bash
export BRIDGEHUB_ADDRESS=0xc4fd2580c3487bba18d63f50301020132342fdbd
export CHAIN_ID=8022833
export SEPOLIA_RPC=<YOUR_SEPOLIA_RPC_ENDPOINT>
export ADDRESS=<YOUR_WALLET_ADDRESS>
export VALUE_TO_BRIDGE=<AMOUNT_TO_BRIDGE_IN_WEI>
```
<!-- // cspell: enable -->

```bash
cast send -r $SEPOLIA_RPC $BRIDGEHUB_ADDRESS "requestL2TransactionDirect((uint256,uint256,address,uint256,bytes,uint256,uint256,bytes[],address))" "($CHAIN_ID,$VALUE_TO_BRIDGE,$ADDRESS,50,0x,300000,800,[],$ADDRESS)" --value $VALUE_TO_BRIDGE --private-key=$PRIVATE_KEY
```

#### Bridging with `zksync-js`

You can find examples for bridging with `ethers` or `viem` in the [`zksync-js` docs](https://matter-labs.github.io/zksync-js/latest/overview/index.html).
