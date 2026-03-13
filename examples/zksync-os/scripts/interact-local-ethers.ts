import { network } from 'hardhat';

const CONTRACT_ADDRESS = '0x...';

const { ethers } = await network.connect('anvil');

const [sender] = await ethers.getSigners();

const contract = await ethers.getContractAt('ZeekMessages', CONTRACT_ADDRESS, sender);

const tx = await contract.sendMessage('Hello from Hardhat');
await tx.wait();

const totalMessages = await contract.getTotalMessages();
const lastMessage = await contract.getLastMessage();

console.log('Total messages:', totalMessages);
console.log('Last message:', lastMessage);
