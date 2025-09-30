import { Provider, InteropClient } from 'zksync-ethers';

// Testnet RPC URLS & Gateway chain ID
const CHAIN1_RPC = 'https://sepolia.era.zksync.dev'; // Era
const GW_RPC = 'https://rpc.era-gateway-testnet.zksync.dev'; // Gateway testnet
const GW_CHAIN_ID = BigInt('32657'); // Gateway testnet ID

// Provider for message source chain
const providerChain1 = new Provider(CHAIN1_RPC);

const interop = new InteropClient({
  gateway: {
    // 'testnet' | 'mainnet' | 'local'
    env: 'testnet',
    gwRpcUrl: GW_RPC,
    gwChainId: GW_CHAIN_ID,
  },
});

export async function checkStatus() {
  const txHash = '0xd2ed8c2141996e123a2dbe153beb84404775300f654ba633994e8d48d2cbad2d';
  const status = await interop.getMessageStatus(providerChain1, txHash);
  console.log('status', status);
  // -> "QUEUED" | "SENDING" | "PROVING" | "EXECUTED" | "FAILED" | "REJECTED" | "UNKNOWN"
}
