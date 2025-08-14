// ANCHOR: usdc-deposit
import { Wallet, Provider, types, USDCBridge } from 'zksync-ethers';
import { ethers } from 'ethers';

const PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY || '0x<WALLET_PRIVATE_KEY>';
const USDC_TOKEN_L1_ADDRESS = '<USDC_TOKEN_ADDRESS>';
const USDC_BRIDGE_L1_ADDRESS = '<USDC_BRIDGE_L1_ADDRESS>';
const AMOUNT = '5';

const provider = Provider.getDefaultProvider(types.Network.Sepolia);
const ethProvider = ethers.getDefaultProvider('sepolia');
const wallet = new Wallet(PRIVATE_KEY, provider, ethProvider);
const usdcBridge = new USDCBridge(wallet);

async function main() {
  const depositTx = await usdcBridge.deposit({
    token: USDC_TOKEN_L1_ADDRESS,
    amount: ethers.parseUnits(AMOUNT, 6),
    approveERC20: true,
    bridgeAddress: USDC_BRIDGE_L1_ADDRESS,
  });

  // Note that we wait not only for the L1 transaction to complete but also for it to be
  // processed by ZKsync. If we want to wait only for the transaction to be processed on L1,
  // we can use `await depositTx.waitL1Commit()`
  await depositTx.wait();
}
// ANCHOR_END: usdc-deposit

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
