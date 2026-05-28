import { createClient } from '@matterlabs/zksync-js/viem';
import { createViemSdk } from '@matterlabs/zksync-js/viem/sdk';
import { network } from 'hardhat';
import { erc20Abi, type Address, zeroAddress } from 'viem';

const gatewayRpc = 'http://localhost:3052';
const depositAmount = 10_000_000n;
const interopAmount = 1_000_000n;
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

const l1PublicClient = await l1.viem.getPublicClient();
const chain1PublicClient = await chain1.viem.getPublicClient();
const chain2PublicClient = await chain2.viem.getPublicClient();
const [l1WalletClient] = await l1.viem.getWalletClients();
const [chain1WalletClient] = await chain1.viem.getWalletClients();

const chain1Client = createClient({
  l1: l1PublicClient,
  l2: chain1PublicClient,
  l1Wallet: l1WalletClient,
});
const chain2Client = createClient({
  l1: l1PublicClient,
  l2: chain2PublicClient,
  l1Wallet: l1WalletClient,
});

const chain1Sdk = createViemSdk(chain1Client, {
  interop: { gwChain: gatewayRpc },
});
const chain2Sdk = createViemSdk(chain2Client, {
  interop: { gwChain: gatewayRpc },
});

const me = chain1WalletClient.account.address;

console.log('Step 1: deploying ERC20 on L1...');
const l1Token = await l1.viem.deployContract('InteropToken', ['L1 Interop Token', 'L1IT']);
console.log(`L1 token deployed at: ${l1Token.address}`);

console.log('Step 2: bridging the L1 token to chain 6565...');
const depositHandle = await chain1Sdk.deposits.create({
  token: l1Token.address,
  amount: depositAmount,
  to: me,
});
console.log(`L1 deposit tx hash: ${depositHandle.l1TxHash}`);

const depositReceipt = await chain1Sdk.deposits.wait(depositHandle, { for: 'l2' });
if (!depositReceipt || depositReceipt.status !== 'success') {
  throw new Error('L1 -> chain 6565 deposit did not finalize successfully on L2.');
}
console.log(`Deposit finalized on chain 6565 in tx: ${depositReceipt.transactionHash}`);

const chain1TokenAddress = await chain1Sdk.tokens.toL2Address(l1Token.address);
const chain1NativeTokenVault = await chain1Sdk.contracts.l2NativeTokenVault();
const chain2NativeTokenVault = await chain2Sdk.contracts.l2NativeTokenVault();
const assetId = await chain1NativeTokenVault.read.assetId([chain1TokenAddress]);
const chain2MappedTokenBefore = await chain2NativeTokenVault.read.tokenAddress([assetId]);
console.log(`Bridged token on chain 6565: ${chain1TokenAddress}`);
console.log(`Mapped token on chain 6566 before interop: ${chain2MappedTokenBefore}`);

const chain1BalanceBefore = await chain1PublicClient.readContract({
  address: chain1TokenAddress,
  abi: erc20Abi,
  functionName: 'balanceOf',
  args: [me],
});
console.log(`Chain 6565 balance before interop: ${chain1BalanceBefore}`);

if (chain1BalanceBefore < interopAmount) {
  throw new Error(
    `Expected at least ${interopAmount.toString()} tokens on chain 6565, found ${chain1BalanceBefore.toString()}.`
  );
}

console.log('Step 3: sending the bridged token from chain 6565 to chain 6566 with interop...');
const created = await chain1Sdk.interop.create(chain2PublicClient, {
  actions: [{ type: 'sendErc20', token: chain1TokenAddress as Address, to: me, amount: interopAmount }],
});
console.log('✅ Created interop transaction bundle.');

const finalizationInfo = await chain1Sdk.interop.wait(chain2PublicClient, created);
console.log('✅ Bundle finalized on chain 6565 and became available on chain 6566.');

const finalizationResult = await chain1Sdk.interop.finalize(chain2PublicClient, finalizationInfo);
console.log('Interop finalization result:', finalizationResult);

const chain2TokenAddress = await chain2NativeTokenVault.read.tokenAddress([assetId]);
if (chain2TokenAddress === zeroAddress) {
  throw new Error(
    `Token representation for asset ${assetId} was not deployed on chain 6566 after interop finalization.`
  );
}

const chain1BalanceAfter = await chain1PublicClient.readContract({
  address: chain1TokenAddress,
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
