import { network } from 'hardhat';
import type { Abi, Address } from 'viem';

const CONTRACT_ADDRESS: Address = '0x...';

const { viem } = await network.connect('anvil');
const publicClient = await viem.getPublicClient();
const [walletClient] = await viem.getWalletClients();
if (!walletClient) throw new Error('No wallet client configured for the local node.');

const contract = await viem.getContractAt('ZeekMessages', CONTRACT_ADDRESS, {
  client: { public: publicClient, wallet: walletClient },
});

const hash = await walletClient.writeContract({
  address: CONTRACT_ADDRESS,
  abi: contract.abi as Abi,
  functionName: 'sendMessage',
  args: ['Hello from local Hardhat'],
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
