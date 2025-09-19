import { network } from 'hardhat';
import { type Abi, defineChain } from 'viem';

const CONTRACT_ADDRESS = '0x7Be3f2d08500Fe75B92b9561287a16962C697cb7';

const { viem } = await network.connect('zksyncOS');

const zksyncOS = defineChain({
  id: 8022833,
  name: 'ZKsync OS',
  network: 'zksyncOS',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: { default: { http: ['https://zksync-os-testnet-alpha.zksync.dev'] } },
});

const publicClient = await viem.getPublicClient({ chain: zksyncOS });
const [senderClient] = await viem.getWalletClients({ chain: zksyncOS });
if (!senderClient) throw new Error('No wallet client. Set TESTNET_PRIVATE_KEY in hardhat config.');

const counterContract = await viem.getContractAt('Counter', CONTRACT_ADDRESS, {
  client: { public: publicClient, wallet: senderClient },
});

const initialCount = await publicClient.readContract({
  address: CONTRACT_ADDRESS,
  abi: counterContract.abi as Abi,
  functionName: 'x',
});
console.log('Initial count:', initialCount);

const tx = await senderClient.writeContract({
  address: CONTRACT_ADDRESS,
  abi: counterContract.abi as Abi,
  functionName: 'inc',
});
await publicClient.waitForTransactionReceipt({ hash: tx });
console.log('Transaction sent successfully');

const newCount = await publicClient.readContract({
  address: CONTRACT_ADDRESS,
  abi: counterContract.abi as Abi,
  functionName: 'x',
});
console.log('New count:', newCount);
