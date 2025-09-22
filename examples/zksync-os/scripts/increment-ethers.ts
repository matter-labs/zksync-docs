import { network } from 'hardhat';

const CONTRACT_ADDRESS = '0x8e882b31Fe1d3942c57408D354E754d1659400a7';

const { ethers } = await network.connect({
  network: 'zksyncOS',
  chainType: 'generic',
});

const [sender] = await ethers.getSigners();

const contract = await ethers.getContractAt('Counter', CONTRACT_ADDRESS, sender);

const initialCount = await contract.x();
console.log('Initial count:', initialCount);

const tx = await contract.inc();
await tx.wait();
console.log('Transaction sent successfully');

const newCount = await contract.x();
console.log('New count:', newCount);
