import { createClient } from '@matterlabs/zksync-js/ethers';
import { createEthersSdk } from '@matterlabs/zksync-js/ethers/sdk';
import { ZeroAddress } from 'ethers';
import { network } from 'hardhat';

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

const [l1Signer] = await l1.ethers.getSigners();
const [chain1Signer] = await chain1.ethers.getSigners();

const chain1Client = createClient({
  l1: l1Signer.provider,
  l2: chain1.ethers.provider,
  signer: l1Signer,
});
const chain2Client = createClient({
  l1: l1Signer.provider,
  l2: chain2.ethers.provider,
  signer: l1Signer,
});

const chain1Sdk = createEthersSdk(chain1Client, {
  interop: { gwChain: gatewayRpc },
});
const chain2Sdk = createEthersSdk(chain2Client, {
  interop: { gwChain: gatewayRpc },
});

const me = await chain1Signer.getAddress();

console.log('Step 1: deploying ERC20 on L1...');
const l1TokenFactory = await l1.ethers.getContractFactory('InteropToken', l1Signer);
const l1Token = await l1TokenFactory.deploy('L1 Interop Token', 'L1IT');
await l1Token.waitForDeployment();
const l1TokenAddress = await l1Token.getAddress();
console.log(`L1 token deployed at: ${l1TokenAddress}`);

console.log('Step 2: bridging the L1 token to chain 6565...');
const depositHandle = await chain1Sdk.deposits.create({
  token: l1TokenAddress,
  amount: depositAmount,
  to: me,
});
console.log(`L1 deposit tx hash: ${depositHandle.l1TxHash}`);

const depositReceipt = await chain1Sdk.deposits.wait(depositHandle, { for: 'l2' });
if (!depositReceipt || depositReceipt.status !== 1) {
  throw new Error('L1 -> chain 6565 deposit did not finalize successfully on L2.');
}
console.log(`Deposit finalized on chain 6565 in tx: ${depositReceipt.hash}`);

const chain1TokenAddress = await chain1Sdk.tokens.toL2Address(l1TokenAddress);
const chain1NativeTokenVault = await chain1Sdk.contracts.l2NativeTokenVault();
const chain2NativeTokenVault = await chain2Sdk.contracts.l2NativeTokenVault();
const assetId = await chain1NativeTokenVault.assetId(chain1TokenAddress);
const chain2MappedTokenBefore = await chain2NativeTokenVault.tokenAddress(assetId);
console.log(`Bridged token on chain 6565: ${chain1TokenAddress}`);
console.log(`Mapped token on chain 6566 before interop: ${chain2MappedTokenBefore}`);

const chain1Token = await chain1.ethers.getContractAt('InteropToken', chain1TokenAddress, chain1Signer);
const chain1BalanceBefore = await chain1Token.balanceOf(me);
console.log(`Chain 6565 balance before interop: ${chain1BalanceBefore}`);

if (chain1BalanceBefore < interopAmount) {
  throw new Error(
    `Expected at least ${interopAmount.toString()} tokens on chain 6565, found ${chain1BalanceBefore.toString()}.`
  );
}

console.log('Step 3: sending the bridged token from chain 6565 to chain 6566 with interop...');
const created = await chain1Sdk.interop.create(chain2.ethers.provider, {
  actions: [{ type: 'sendErc20' as const, token: chain1TokenAddress, to: me, amount: interopAmount }],
});
console.log('✅ Created interop transaction bundle.');

const finalizationInfo = await chain1Sdk.interop.wait(chain2.ethers.provider, created);
console.log('✅ Bundle finalized on chain 6565 and became available on chain 6566.');

const finalizationResult = await chain1Sdk.interop.finalize(chain2.ethers.provider, finalizationInfo);
console.log('Interop finalization result:', finalizationResult);

const chain2TokenAddress = await chain2NativeTokenVault.tokenAddress(assetId);
if (chain2TokenAddress === ZeroAddress) {
  throw new Error(
    `Token representation for asset ${assetId} was not deployed on chain 6566 after interop finalization.`
  );
}

const chain1BalanceAfter = await chain1Token.balanceOf(me);
const chain2Token = await chain2.ethers.getContractAt('InteropToken', chain2TokenAddress);
const chain2BalanceAfter = await chain2Token.balanceOf(me);

console.log(`Chain 6565 balance after interop: ${chain1BalanceAfter}`);
console.log(`Mapped token on chain 6566 after interop: ${chain2TokenAddress}`);
console.log(`Chain 6566 balance after interop: ${chain2BalanceAfter}`);
