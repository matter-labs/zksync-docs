import { network } from 'hardhat';
import { defineChain, type Abi, type Address } from 'viem';

const CONTRACT_ADDRESS: Address = '0x...';

const zksyncOS = defineChain({
  id: 8022833,
  name: 'ZKsync OS',
  network: 'zksyncOS',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: { default: { http: ['https://zksync-os-testnet-alpha.zksync.dev'] } },
});

const { viem } = await network.connect('zksyncOS');
const publicClient = await viem.getPublicClient({ chain: zksyncOS });
const [walletClient] = await viem.getWalletClients({ chain: zksyncOS });
if (!walletClient) throw new Error('No wallet client. Set TESTNET_PRIVATE_KEY in the keystore.');

const contract = await viem.getContractAt('ZeekMessages', CONTRACT_ADDRESS, {
  client: { public: publicClient, wallet: walletClient },
});

const hash = await walletClient.writeContract({
  address: CONTRACT_ADDRESS,
  abi: contract.abi as Abi,
  functionName: 'sendMessage',
  args: ['Hello from Hardhat'],
});
await publicClient.waitForTransactionReceipt({ hash });

const totalMessages = await publicClient.readContract({
  address: CONTRACT_ADDRESS,
  abi: contract.abi as Abi,
  functionName: 'getTotalMessages',
});

const lastMessage = await publicClient.readContract({
  address: CONTRACT_ADDRESS,
  abi: contract.abi as Abi,
  functionName: 'getLastMessage',
});

console.log('Total messages:', totalMessages);
console.log('Last message:', lastMessage);
