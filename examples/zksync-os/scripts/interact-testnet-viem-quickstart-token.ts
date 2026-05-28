import { network } from 'hardhat';
import { defineChain, formatUnits, type Abi, type Address } from 'viem';

const CONTRACT_ADDRESS: Address = '0x...';
const RECIPIENT_ADDRESS: Address = '0x...';
const TRANSFER_AMOUNT = 10n * 10n ** 18n;

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

const contract = await viem.getContractAt('QuickstartToken', CONTRACT_ADDRESS, {
  client: { public: publicClient, wallet: walletClient },
});

const [tokenName, tokenSymbol, totalSupply] = await Promise.all([
  publicClient.readContract({
    address: CONTRACT_ADDRESS,
    abi: contract.abi as Abi,
    functionName: 'name',
  }),
  publicClient.readContract({
    address: CONTRACT_ADDRESS,
    abi: contract.abi as Abi,
    functionName: 'symbol',
  }),
  publicClient.readContract({
    address: CONTRACT_ADDRESS,
    abi: contract.abi as Abi,
    functionName: 'totalSupply',
  }),
]);

const hash = await walletClient.writeContract({
  address: CONTRACT_ADDRESS,
  abi: contract.abi as Abi,
  functionName: 'transfer',
  args: [RECIPIENT_ADDRESS, TRANSFER_AMOUNT],
  account: walletClient.account,
});
await publicClient.waitForTransactionReceipt({ hash });

const [senderBalance, recipientBalance] = await Promise.all([
  publicClient.readContract({
    address: CONTRACT_ADDRESS,
    abi: contract.abi as Abi,
    functionName: 'balanceOf',
    args: [walletClient.account.address],
  }),
  publicClient.readContract({
    address: CONTRACT_ADDRESS,
    abi: contract.abi as Abi,
    functionName: 'balanceOf',
    args: [RECIPIENT_ADDRESS],
  }),
]);

console.log('Token name:', tokenName);
console.log('Token symbol:', tokenSymbol);
console.log('Total supply:', formatUnits(totalSupply as bigint, 18));
console.log('Transferred amount:', formatUnits(TRANSFER_AMOUNT, 18));
console.log('Recipient address:', RECIPIENT_ADDRESS);
console.log('Recipient balance:', formatUnits(recipientBalance as bigint, 18));
console.log('Sender balance:', formatUnits(senderBalance as bigint, 18));
