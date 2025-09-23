import { ethers } from 'ethers';
import { Provider, Wallet, InteropClient, getGwBlockForBatch, Contract, utils } from 'zksync-ethers';

// private key for local pre-configured rich wallet
const PRIVATE_KEY = '0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110';

const CHAIN1_RPC = 'http://localhost:3050';
const CHAIN2_RPC = 'http://localhost:3250';
const GW_RPC = 'http://localhost:3150'; // gateway
const L1_RPC = 'http://localhost:8545';
const GW_CHAIN_ID = BigInt('506');

// Chain 1
const providerChain1 = new Provider(CHAIN1_RPC);
const providerl1 = new Provider(L1_RPC);
const walletChain1 = new Wallet(PRIVATE_KEY, providerChain1, providerl1);

// Chain 2
const providerChain2 = new Provider(CHAIN2_RPC);
const walletChain2 = new Wallet(PRIVATE_KEY, providerChain2, providerl1);

const interop = new InteropClient({
  gateway: {
    // 'testnet' | 'mainnet' | 'local'
    env: 'local',
    gwRpcUrl: GW_RPC,
    gwChainId: GW_CHAIN_ID,
  },
});

// get args to pass into a contract for onchain verification
export async function getVerificationArgs() {
  const txHash = '0x...';

  // for local testing only
  // needed to force interop root to update on local chain 2
  const root = await updateLocalChainInteropRoot(txHash);
  console.log('interop root is updated', root);

  const args = await interop.getVerificationArgs({
    txHash,
    srcProvider: providerChain1, // source chain provider (to fetch proof + batch details)
    targetChain: providerChain2, // target chain provider (to read interop root + verify)
  });
  console.log('Verification Args:', args);
  // --> { srcChainId, l1BatchNumber, l2MessageIndex, msgData: { txNumberInBatch, sender, data }, gatewayProof }
  return args;
}

// force interop root to update on local chain 2
async function updateLocalChainInteropRoot(txHash: `0x${string}`, timeoutMs = 120_000): Promise<string> {
  const receipt = await (await walletChain1.provider.getTransaction(txHash)).waitFinalize();
  const gw = new ethers.JsonRpcProvider(GW_RPC);
  const gwBlock = await getGwBlockForBatch(BigInt(receipt.l1BatchNumber!), providerChain1, gw);

  // fetch the interop root from target chain
  const InteropRootStorage = new Contract(
    utils.L2_INTEROP_ROOT_STORAGE_ADDRESS,
    utils.L2_INTEROP_ROOT_STORAGE_ABI,
    walletChain2
  );

  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const root: string = await InteropRootStorage.interopRoots(GW_CHAIN_ID, gwBlock);
    if (root && root !== '0x' + '0'.repeat(64)) return root;
    // send tx just to get chain2 to seal batch
    const t = await walletChain2.sendTransaction({
      to: walletChain2.address,
      value: BigInt(1),
    });
    await (await walletChain2.provider.getTransaction(t.hash)).waitFinalize();
  }
  throw new Error(`Chain2 did not import interop root for (${GW_CHAIN_ID}, ${gwBlock}) in time`);
}
