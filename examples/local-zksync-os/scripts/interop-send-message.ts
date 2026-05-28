import { toUtf8Bytes } from 'ethers';
import { network } from 'hardhat';

const chain1 = await network.create({
  network: 'localZKsyncOSChain1',
  chainType: 'generic',
});
const [chain1Signer] = await chain1.ethers.getSigners();

const factory = await chain1.ethers.getContractFactory('InteropSendMessage', chain1Signer);
const sender = await factory.deploy();
await sender.waitForDeployment();

const tx = await sender.sendMessage(toUtf8Bytes('Hello from chain 6565'));
await tx.wait();

console.log('Message sender contract:', await sender.getAddress());
console.log('Source chain tx hash:', tx.hash);
