import { createClient } from '@matterlabs/zksync-js/viem';
import { createViemSdk } from '@matterlabs/zksync-js/viem/sdk';
import { network } from 'hardhat';
import { erc20Abi, type Address, zeroAddress } from 'viem';

const chain1 = await network.create({
  network: 'localZKsyncOSChain1',
  chainType: 'generic',
});
const chain2 = await network.create({
  network: 'localZKsyncOSChain2',
  chainType: 'generic',
});
const l1 = await network.create({
  network: 'localZKsyncOSL1',
  chainType: 'l1',
});

const gatewayRPC = 'http://localhost:3052';
const amount = 1_000_000n;
const tokenAddress = process.env.INTEROP_TOKEN_ADDRESS as Address | undefined;

if (!tokenAddress) {
  throw new Error('Set INTEROP_TOKEN_ADDRESS to the deployed token contract address on chain 6565.');
}

const l1PublicClient = await l1.viem.getPublicClient();
const chain1PublicClient = await chain1.viem.getPublicClient();
const chain2PublicClient = await chain2.viem.getPublicClient();
const [l1WalletClient] = await l1.viem.getWalletClients();
const [chain1WalletClient] = await chain1.viem.getWalletClients();

const client = createClient({
  l1: l1PublicClient,
  l2: chain1PublicClient,
  l1Wallet: l1WalletClient,
});
const sdk = createViemSdk(client, {
  interop: { gwChain: gatewayRPC },
});
const me = chain1WalletClient.account.address;
const token = await chain1.viem.getContractAt('InteropToken', tokenAddress);
const chain1NativeTokenVault = await sdk.contracts.l2NativeTokenVault();

const chain2Client = createClient({
  l1: l1PublicClient,
  l2: chain2PublicClient,
  l1Wallet: l1WalletClient,
});
const chain2Sdk = createViemSdk(chain2Client, {
  interop: { gwChain: gatewayRPC },
});
const chain2NativeTokenVault = await chain2Sdk.contracts.l2NativeTokenVault();

console.log(`Using InteropToken on localZKsyncOSChain1 at: ${tokenAddress}`);

const sourceBalance = await token.read.balanceOf([me]);
console.log('SourceBalance: ', sourceBalance);

const created = await sdk.interop.create(chain2PublicClient, {
  actions: [{ type: 'sendErc20', token: tokenAddress, to: me, amount }],
});
console.log('✅ Created interop transaction.');

const finalizationInfo = await sdk.interop.wait(chain2PublicClient, created);
console.log('✅ Bundle is finalized on source; root available on destination.');

const finalizationResult = await sdk.interop.finalize(chain2PublicClient, finalizationInfo);
console.log('Finalize result:', finalizationResult);

const assetId = await chain1NativeTokenVault.read.assetId([tokenAddress]);
const chain2TokenAddress = await chain2NativeTokenVault.read.tokenAddress([assetId]);
if (chain2TokenAddress === zeroAddress) {
  throw new Error(
    `Token representation for asset ${assetId} was not deployed on chain 6566 after interop finalization.`
  );
}

const chain1BalanceAfter = await chain1PublicClient.readContract({
  address: tokenAddress,
  abi: erc20Abi,
  functionName: 'balanceOf',
  args: [me],
});
const chain2BalanceAfter = await chain2PublicClient.readContract({
  address: chain2TokenAddress,
  abi: erc20Abi,
  functionName: 'balanceOf',
  args: [me],
});

console.log(`Chain 6565 balance after interop: ${chain1BalanceAfter}`);
console.log(`Mapped token on chain 6566 after interop: ${chain2TokenAddress}`);
console.log(`Chain 6566 balance after interop: ${chain2BalanceAfter}`);
