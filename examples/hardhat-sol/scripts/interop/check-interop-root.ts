import { ethers } from 'ethers';
import { Provider, waitForGatewayInteropRoot, getGwBlockForBatch } from 'zksync-ethers';

// Testnet RPC URLS & Gateway chain ID
const CHAIN1_RPC = 'https://sepolia.era.zksync.dev'; // Era
const CHAIN2_RPC = 'https://api.testnet.abs.xyz'; // Abstract
const GW_RPC = 'https://rpc.era-gateway-testnet.zksync.dev'; // Gateway testnet
const GW_CHAIN_ID = BigInt('32657'); // Gateway testnet ID

// Provider for message source chain
const providerChain1 = new Provider(CHAIN1_RPC);
// Provider for chain to verify on
const providerChain2 = new Provider(CHAIN2_RPC);

export async function checkInteropRoot() {
  const txHash = '0xd2ed8c2141996e123a2dbe153beb84404775300f654ba633994e8d48d2cbad2d';
  const receipt = await (await providerChain1.getTransaction(txHash)).waitFinalize();
  const gw = new ethers.JsonRpcProvider(GW_RPC);
  const gwBlock = await getGwBlockForBatch(BigInt(receipt.l1BatchNumber!), providerChain1, gw);
  const root = await waitForGatewayInteropRoot(GW_CHAIN_ID, providerChain2, gwBlock);
  console.log('interop root is updated', root);
}
