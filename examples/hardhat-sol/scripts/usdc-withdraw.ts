// ANCHOR: usdc-withdraw
import { Wallet, Provider, types, USDCBridge } from 'zksync-ethers';
import { ethers } from 'ethers';

const PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY || '0x<WALLET_PRIVATE_KEY>';
const USDC_TOKEN_L2_ADDRESS = '<USDC_TOKEN_L2_ADDRESS>';
const USDC_BRIDGE_L2_ADDRESS = '<USDC_BRIDGE_L2_ADDRESS>';
const AMOUNT = '5';

const provider = Provider.getDefaultProvider(types.Network.Sepolia);
const wallet = new Wallet(PRIVATE_KEY, provider);
const usdcBridge = new USDCBridge(wallet);

async function main() {
  const withdrawTx = await usdcBridge.withdraw({
    token: USDC_TOKEN_L2_ADDRESS,
    amount: ethers.parseUnits(AMOUNT, 6),
    bridgeAddress: USDC_BRIDGE_L2_ADDRESS,
    approveERC20: true,
  });
  console.log('Withdraw transaction hash:', withdrawTx.hash);
}
// ANCHOR_END: usdc-withdraw

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
