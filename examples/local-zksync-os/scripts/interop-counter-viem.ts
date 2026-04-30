import { createClient, createViemSdk } from '@matterlabs/zksync-js/viem';
import { network } from 'hardhat';
import { encodeAbiParameters } from 'viem';

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

const l1PublicClient = await l1.viem.getPublicClient();
const chain1PublicClient = await chain1.viem.getPublicClient();
const chain2PublicClient = await chain2.viem.getPublicClient();
const [l1WalletClient] = await l1.viem.getWalletClients();

const client = createClient({
  l1: l1PublicClient,
  l2: chain1PublicClient,
  l1Wallet: l1WalletClient,
});
const sdk = createViemSdk(client, {
  interop: { gwChain: gatewayRPC },
});

const counter = await chain2.viem.deployContract('InteropCounter');

const counterAddress = counter.address;
console.log(`Counter deployed on localZKsyncOSChain2 at: ${counterAddress}`);

const txHash = await counter.write.inc();
await chain2PublicClient.waitForTransactionReceipt({ hash: txHash });
const startingNumber = await counter.read.x();
console.log('StartingNumber: ', startingNumber);

// // use op=0 to call inc()
// // or op=1 to call incBy(by)
const data = encodeAbiParameters([{ type: 'uint8' }], [0]);

const params = {
  actions: [
    {
      type: 'call' as const,
      to: counterAddress,
      data,
    },
  ],
  // Optional bundle-level execution constraints:
  // execution: { only: someExecAddress },
  // unbundling: { by: someUnbundlerAddress },
};

const created = await sdk.interop.create(chain2PublicClient, params);
console.log('✅ Created interop transaction.');

const finalizationInfo = await sdk.interop.wait(chain2PublicClient, created);
console.log('✅ Bundle is finalized on source; root available on destination.');

const finalizationResult = await sdk.interop.finalize(chain2PublicClient, finalizationInfo);
console.log('Finalize result:', finalizationResult);

const finalNumber = await counter.read.x();
console.log('FinalNumber: ', finalNumber);
