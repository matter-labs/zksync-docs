import { Provider, Wallet, InteropClient } from 'zksync-ethers';

// private key for local pre-configured rich wallet
const PRIVATE_KEY = '0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110';
const CHAIN1_RPC = 'http://localhost:3050';
const GW_RPC = 'http://localhost:3150';
const L1_RPC = 'http://localhost:8545';
const GW_CHAIN_ID = BigInt('506');

const providerl2 = new Provider(CHAIN1_RPC);
const providerl1 = new Provider(L1_RPC);
const wallet = new Wallet(PRIVATE_KEY, providerl2, providerl1);

const interop = new InteropClient({
  gateway: {
    // 'testnet' | 'mainnet' | 'local'
    env: 'local',
    gwRpcUrl: GW_RPC,
    gwChainId: GW_CHAIN_ID,
  },
});

export async function send() {
  const message = 'Some L2->L1 message';
  const sent = await interop.sendMessage(wallet, message);
  console.log('Sent on source chain:', sent);
  // -> { txHash, l1BatchNumber, l1BatchTxIndex, l2ToL1LogIndex, sender, messageHex }
}
