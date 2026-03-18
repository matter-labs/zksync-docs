import { network } from 'hardhat';
import { formatUnits, type Abi, type Address } from 'viem';

const CONTRACT_ADDRESS: Address = (process.env.CONTRACT_ADDRESS as Address) || '0x...';
const TRANSFER_AMOUNT = 10n * 10n ** 18n;

const { viem } = await network.connect('anvil');
const publicClient = await viem.getPublicClient();
const [walletClient, fallbackRecipientClient] = await viem.getWalletClients();
if (!walletClient) throw new Error('No wallet client configured for the local node.');
const recipientAddress =
  (process.env.RECIPIENT_ADDRESS as Address | undefined) || fallbackRecipientClient?.account.address;
if (!recipientAddress) throw new Error('No recipient address configured for the local node.');

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
  args: [recipientAddress, TRANSFER_AMOUNT],
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
    args: [recipientAddress],
  }),
]);

console.log('Token name:', tokenName);
console.log('Token symbol:', tokenSymbol);
console.log('Total supply:', formatUnits(totalSupply as bigint, 18));
console.log('Transferred amount:', formatUnits(TRANSFER_AMOUNT, 18));
console.log('Recipient address:', recipientAddress);
console.log('Recipient balance:', formatUnits(recipientBalance as bigint, 18));
console.log('Sender balance:', formatUnits(senderBalance as bigint, 18));
