import { network } from 'hardhat';
import { stringToHex } from 'viem';

const chain1 = await network.create({
  network: 'localZKsyncOSChain1',
  chainType: 'generic',
});

const chain1PublicClient = await chain1.viem.getPublicClient();

const sender = await chain1.viem.deployContract('InteropSendMessage');

const txHash = await sender.write.sendMessage([stringToHex('Hello from chain 6565')]);
await chain1PublicClient.waitForTransactionReceipt({ hash: txHash });

console.log('Message sender contract:', sender.address);
console.log('Source chain tx hash:', txHash);
