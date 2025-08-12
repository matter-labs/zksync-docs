import { Provider, types, Wallet, USDCBridge } from 'zksync-ethers';
import { ethers } from 'ethers';

const PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY || '0x<WALLET_PRIVATE_KEY>';
const provider = Provider.getDefaultProvider(types.Network.Sepolia);
const ethProvider = ethers.getDefaultProvider('sepolia');
const wallet = new Wallet(PRIVATE_KEY, provider, ethProvider);

const usdcBridge = new USDCBridge(wallet);
console.log('USDC Bridge initialized', usdcBridge);
