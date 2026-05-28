import { createClient } from '@matterlabs/zksync-js/viem';
import { findL1MessageSentLog, messengerLogIndex } from '@matterlabs/zksync-js/core';
import { network } from 'hardhat';
import { decodeAbiParameters } from 'viem';

const txHash = process.env.MESSAGE_TX_HASH || '0x...';

const chain1 = await network.create({
  network: 'localZKsyncOSChain1',
  chainType: 'generic',
});
const l1 = await network.create({
  network: 'localZKsyncOSL1',
  chainType: 'l1',
});

const l1PublicClient = await l1.viem.getPublicClient();
const chain1PublicClient = await chain1.viem.getPublicClient();
const [l1WalletClient] = await l1.viem.getWalletClients();

const client = createClient({
  l1: l1PublicClient,
  l2: chain1PublicClient,
  l1Wallet: l1WalletClient,
});

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const txReceipt = await chain1PublicClient.getTransactionReceipt({ hash: txHash as `0x${string}` });
const receiptWithLogs = await client.zks.getReceiptWithL2ToL1(txHash as `0x${string}`);
if (!receiptWithLogs) {
  throw new Error(`L2 -> L1 receipt not found for ${txHash}.`);
}

const messageLog = findL1MessageSentLog(txReceipt, { prefer: 'messenger' });
const [messageData] = decodeAbiParameters([{ type: 'bytes' }], messageLog.data);
const messageLogIndex = messengerLogIndex(receiptWithLogs);

while (true) {
  const finalizedBlock = await chain1PublicClient.getBlock({ blockTag: 'finalized' });
  if (finalizedBlock.number !== null && finalizedBlock.number >= txReceipt.blockNumber) {
    break;
  }
  await sleep(5_000);
}

let proof;
while (true) {
  try {
    proof = await client.zks.getL2ToL1LogProof(txHash as `0x${string}`, messageLogIndex, 'messageRoot');
    break;
  } catch {
    await sleep(5_000);
  }
}

console.log('Source transaction is finalized in batch:', proof.batchNumber);
console.log('Message data:', messageData);
console.log('Message proof is ready for gateway block:', proof.gatewayBlockNumber);
console.log('Source chain batch number:', proof.batchNumber);
console.log('L2 message index:', proof.id);
