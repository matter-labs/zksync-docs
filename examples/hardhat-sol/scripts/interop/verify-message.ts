import { Provider, InteropClient } from 'zksync-ethers';

// Testnet RPC URLS & Gateway chain ID
const CHAIN1_RPC = 'https://sepolia.era.zksync.dev'; // Era
const CHAIN2_RPC = 'https://api.testnet.abs.xyz'; // Abstract
const GW_RPC = 'https://rpc.era-gateway-testnet.zksync.dev'; // Gateway testnet
const GW_CHAIN_ID = BigInt('32657'); // Gateway testnet ID

// Provider for message source chain
const providerChain1 = new Provider(CHAIN1_RPC);
// Provider for chain to verify on
const providerChain2 = new Provider(CHAIN2_RPC);

const interop = new InteropClient({
  gateway: {
    // 'testnet' | 'mainnet' | 'local'
    env: 'testnet',
    gwRpcUrl: GW_RPC,
    gwChainId: GW_CHAIN_ID,
  },
});

export async function verify() {
  const txHash = '0xd2ed8c2141996e123a2dbe153beb84404775300f654ba633994e8d48d2cbad2d';

  const verifyRes = await interop.verifyMessage({
    txHash,
    srcProvider: providerChain1, // source chain provider (to fetch proof + batch details)
    targetChain: providerChain2, // target chain provider (to read interop root + verify)
    // includeProofInputs: true, // optional debug info
  });
  console.log('Message is verified:', verifyRes.verified);
}
