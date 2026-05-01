import { createClient } from '@matterlabs/zksync-js/ethers';
import { createEthersSdk } from '@matterlabs/zksync-js/ethers/sdk';
import { ZeroAddress } from 'ethers';
import { network } from 'hardhat';

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
const tokenAddress = process.env.INTEROP_TOKEN_ADDRESS;

if (!tokenAddress) {
  throw new Error('Set INTEROP_TOKEN_ADDRESS to the deployed token contract address on chain 6565.');
}

const [l1Signer] = await l1.ethers.getSigners();
const [chain1Signer] = await chain1.ethers.getSigners();

const client = createClient({
  l1: l1Signer.provider,
  l2: chain1.ethers.provider,
  signer: l1Signer,
});
const sdk = createEthersSdk(client, {
  interop: { gwChain: gatewayRPC },
});
const chain1NativeTokenVault = await sdk.contracts.l2NativeTokenVault();

const chain2Client = createClient({
  l1: l1Signer.provider,
  l2: chain2.ethers.provider,
  signer: l1Signer,
});
const chain2Sdk = createEthersSdk(chain2Client, {
  interop: { gwChain: gatewayRPC },
});
const chain2NativeTokenVault = await chain2Sdk.contracts.l2NativeTokenVault();

const token = await chain1.ethers.getContractAt('InteropToken', tokenAddress, chain1Signer);
const me = await chain1Signer.getAddress();
console.log(`Using InteropToken on localZKsyncOSChain1 at: ${tokenAddress}`);

const sourceBalance = await token.balanceOf(me);
console.log('SourceBalance: ', sourceBalance);

const created = await sdk.interop.create(chain2.ethers.provider, {
  actions: [{ type: 'sendErc20' as const, token: tokenAddress, to: me, amount }],
});
console.log('✅ Created interop transaction.');

const finalizationInfo = await sdk.interop.wait(chain2.ethers.provider, created);
console.log('✅ Bundle is finalized on source; root available on destination.');

const finalizationResult = await sdk.interop.finalize(chain2.ethers.provider, finalizationInfo);
console.log('Finalize result:', finalizationResult);

const assetId = await chain1NativeTokenVault.assetId(tokenAddress);
const chain2TokenAddress = await chain2NativeTokenVault.tokenAddress(assetId);
if (chain2TokenAddress === ZeroAddress) {
  throw new Error(
    `Token representation for asset ${assetId} was not deployed on chain 6566 after interop finalization.`
  );
}

const chain1BalanceAfter = await token.balanceOf(me);
const chain2Token = await chain2.ethers.getContractAt('InteropToken', chain2TokenAddress);
const chain2BalanceAfter = await chain2Token.balanceOf(me);

console.log(`Chain 6565 balance after interop: ${chain1BalanceAfter}`);
console.log(`Mapped token on chain 6566 after interop: ${chain2TokenAddress}`);
console.log(`Chain 6566 balance after interop: ${chain2BalanceAfter}`);
