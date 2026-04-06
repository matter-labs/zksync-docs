import { network } from 'hardhat';
import { formatUnits, parseUnits } from 'ethers';

const CONTRACT_ADDRESS = '0x...';
const RECIPIENT_ADDRESS = '0x...';
const TRANSFER_AMOUNT = parseUnits('10', 18);

const { ethers } = await network.connect({
  network: 'zksyncOS',
  chainType: 'generic',
});

const [sender] = await ethers.getSigners();

const contract = await ethers.getContractAt('QuickstartToken', CONTRACT_ADDRESS, sender);

const tokenName = await contract.name();
const tokenSymbol = await contract.symbol();
const totalSupply = await contract.totalSupply();
const transferTx = await contract.transfer(RECIPIENT_ADDRESS, TRANSFER_AMOUNT);
await transferTx.wait();
const senderBalance = await contract.balanceOf(sender.address);
const recipientBalance = await contract.balanceOf(RECIPIENT_ADDRESS);

console.log('Token name:', tokenName);
console.log('Token symbol:', tokenSymbol);
console.log('Total supply:', formatUnits(totalSupply, 18));
console.log('Transferred amount:', formatUnits(TRANSFER_AMOUNT, 18));
console.log('Recipient address:', RECIPIENT_ADDRESS);
console.log('Recipient balance:', formatUnits(recipientBalance, 18));
console.log('Sender balance:', formatUnits(senderBalance, 18));
