// ANCHOR: setup
import { Wallet, Provider, types, USDCBridge } from 'zksync-ethers';
import { ethers } from 'ethers';

const PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY || '0x<WALLET_PRIVATE_KEY>';
const USDC_BRIDGE_L1_ADDRESS = '<USDC_BRIDGE_L1_ADDRESS>';

const provider = Provider.getDefaultProvider(types.Network.Sepolia);
const ethProvider = ethers.getDefaultProvider('sepolia');
const wallet = new Wallet(PRIVATE_KEY, provider, ethProvider);
const usdcBridge = new USDCBridge(wallet);

const WITHDRAWAL_TX_HASH = '<WITHDRAWAL_TX_HASH>';
// ANCHOR_END: setup

// ANCHOR: finalize
async function finalizeWithdrawal() {
  const finalizeWithdrawalTx = await usdcBridge.finalizeWithdrawal(USDC_BRIDGE_L1_ADDRESS, WITHDRAWAL_TX_HASH);
  console.log('Finalize withdrawal transaction hash:', finalizeWithdrawalTx.hash);
}
// ANCHOR_END: finalize

// ANCHOR: status
async function checkWithdrawalStatus() {
  const isFinalized = await usdcBridge.isWithdrawalFinalized(USDC_BRIDGE_L1_ADDRESS, WITHDRAWAL_TX_HASH);
  console.log('Withdrawal is finalized:', isFinalized);
}
// ANCHOR_END: status

async function main() {
  await finalizeWithdrawal();
  await checkWithdrawalStatus();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
