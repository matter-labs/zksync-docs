import { AbiCoder } from 'ethers';
import { createClient } from '@matterlabs/zksync-js/ethers';
import { createEthersSdk } from '@matterlabs/zksync-js/ethers/sdk';
import { network } from 'hardhat';

const chain1 = await network.connect({
  network: 'localZKsyncOSChain1',
  chainType: 'generic',
});
const chain2 = await network.connect({
  network: 'localZKsyncOSChain2',
  chainType: 'generic',
});
const l1 = await network.connect({
  network: 'localZKsyncOSL1',
  chainType: 'l1',
});

const [l1Signer] = await l1.ethers.getSigners();

const client = createClient({
  l1: l1Signer.provider,
  l2: chain1.ethers.provider,
  signer: l1Signer,
});
const sdk = createEthersSdk(client);

const [chain1Signer] = await chain1.ethers.getSigners();
const [chain2Signer] = await chain2.ethers.getSigners();

const counterFactory = await chain2.ethers.getContractFactory('InteropCounter', chain2Signer);
const counter = await counterFactory.deploy();
await counter.waitForDeployment();
const counterAddress = await counter.getAddress();
console.log(`InteropCounter deployed on localZKsyncOSChain2 at: ${counterAddress}`);

const demoFactoryChain1 = await chain1.ethers.getContractFactory('InteropBundleSolidityDemo', chain1Signer);
const senderDemo = await demoFactoryChain1.deploy();
await senderDemo.waitForDeployment();
console.log(`InteropBundleSolidityDemo (sender) deployed on localZKsyncOSChain1 at: ${await senderDemo.getAddress()}`);

const demoFactoryChain2 = await chain2.ethers.getContractFactory('InteropBundleSolidityDemo', chain2Signer);
const finalizerDemo = await demoFactoryChain2.deploy();
await finalizerDemo.waitForDeployment();
console.log(
  `InteropBundleSolidityDemo (finalizer) deployed on localZKsyncOSChain2 at: ${await finalizerDemo.getAddress()}`
);

const initial = await counter.x();
console.log(`Initial counter value: ${initial}`);

const destinationChainId = (await chain2.ethers.provider.getNetwork()).chainId;
const payload = AbiCoder.defaultAbiCoder().encode(['uint8'], [0]) as `0x${string}`;

const sendTx = await senderDemo.sendSingleCallBundle(destinationChainId, counterAddress, payload);
const sendReceipt = await sendTx.wait();

if (!sendReceipt) {
  throw new Error('Missing receipt for sendSingleCallBundle transaction');
}

console.log(`Bundle sent via Solidity contract. Source tx hash: ${sendTx.hash}`);

const finalizationInfo = await sdk.interop.wait(
  {
    dstChain: chain2.ethers.provider,
    waitable: sendTx.hash as `0x${string}`,
  },
  {
    pollMs: 5_000,
    timeoutMs: 30 * 60 * 1_000,
  }
);
console.log('Bundle is finalized on source; proof is available.');

const finalizeTx = await finalizerDemo.finalizeBundle(finalizationInfo.encodedData, finalizationInfo.proof);
await finalizeTx.wait();
console.log(`Bundle executed on destination via Solidity contract. Dest tx hash: ${finalizeTx.hash}`);

const finalValue = await counter.x();
console.log(`Final counter value: ${finalValue}`);
