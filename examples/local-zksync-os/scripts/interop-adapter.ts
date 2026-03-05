import { createClient } from '@matterlabs/zksync-js/ethers';
import { createEthersSdk } from '@matterlabs/zksync-js/ethers/sdk';
import { AbiCoder } from 'ethers';
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

const [chain2Signer] = await chain2.ethers.getSigners();

const counterFactory = await chain2.ethers.getContractFactory('Counter', chain2Signer);
const counter = await counterFactory.deploy();
await counter.waitForDeployment();

const counterAddress = (await counter.getAddress()) as `0x${string}`;
console.log(`Counter deployed on localZKsyncOSChain2 at: ${counterAddress}`);

const adapterFactory = await chain2.ethers.getContractFactory('CounterInteropAdapter', chain2Signer);
const adapter = await adapterFactory.deploy(counterAddress);
await adapter.waitForDeployment();

const adapterAddress = await adapter.getAddress();
console.log(`Counter Adapter deployed on localZKsyncOSChain2 at: ${adapterAddress}`);

const tx = await counter.inc();
await tx.wait();
const startingNumber = await counter.x();
console.log('StartingNumber: ', startingNumber);

// use op=0 to call inc()
// or op=1 to call incBy(by)
const data = AbiCoder.defaultAbiCoder().encode(['uint8'], [0]) as `0x${string}`;

const params = {
  dstChain: chain2.ethers.provider,
  actions: [
    {
      type: 'call' as const,
      to: adapterAddress,
      data: data,
    },
  ],
  // Optional bundle-level execution constraints:
  // execution: { only: someExecAddress },
  // unbundling: { by: someUnbundlerAddress },
};

const created = await sdk.interop.create(params);
console.log('✅ Created interop transaction.');

const finalizationInfo = await sdk.interop.wait(created, {
  pollMs: 5_000,
  timeoutMs: 30 * 60 * 1_000,
});
console.log('✅ Bundle is finalized on source; root available on destination.');

const finalizationResult = await sdk.interop.finalize(finalizationInfo);
console.log('Finalize result:', finalizationResult);

const finalNumber = await counter.x();
console.log('FinalNumber: ', finalNumber);
