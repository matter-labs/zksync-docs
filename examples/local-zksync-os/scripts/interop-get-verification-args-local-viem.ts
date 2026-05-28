import { createClient } from '@matterlabs/zksync-js/viem';
import { createViemSdk } from '@matterlabs/zksync-js/viem/sdk';
import { findL1MessageSentLog, messengerLogIndex } from '@matterlabs/zksync-js/core';
import { createPublicClient, decodeAbiParameters, http, zeroHash } from 'viem';
import { network } from 'hardhat';

const txHash = process.env.MESSAGE_TX_HASH || '0x...';

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

const gatewayRpc = 'http://localhost:3052';
const gatewayPublicClient = createPublicClient({
  transport: http(gatewayRpc),
});

const l1PublicClient = await l1.viem.getPublicClient();
const chain1PublicClient = await chain1.viem.getPublicClient();
const chain2PublicClient = await chain2.viem.getPublicClient();
const [l1WalletClient] = await l1.viem.getWalletClients();
const [chain2WalletClient] = await chain2.viem.getWalletClients();

const client = createClient({
  l1: l1PublicClient,
  l2: chain1PublicClient,
  l1Wallet: l1WalletClient,
});
const sdk = createViemSdk(client, {
  interop: { gwChain: gatewayRpc },
});

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const txReceipt = await chain1PublicClient.getTransactionReceipt({ hash: txHash as `0x${string}` });
const receiptWithLogs = await client.zks.getReceiptWithL2ToL1(txHash as `0x${string}`);
if (!receiptWithLogs) {
  throw new Error(`L2 -> L1 receipt not found for ${txHash}.`);
}
if (!txReceipt.to) {
  throw new Error(`Transaction target not found for ${txHash}.`);
}
const txNumberInBatch = Number(txReceipt.transactionIndex);
if (!Number.isInteger(txNumberInBatch)) {
  throw new Error(`Transaction index is not available for ${txHash}.`);
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

if (proof.gatewayBlockNumber == null) {
  throw new Error(`Gateway block number is not available yet for ${txHash}.`);
}

const gatewayChainId = await gatewayPublicClient.getChainId();
let interopRoot = zeroHash;
while (interopRoot === zeroHash) {
  interopRoot = await sdk.interop.getInteropRoot(chain2PublicClient, BigInt(gatewayChainId), proof.gatewayBlockNumber);
  if (interopRoot !== zeroHash) {
    break;
  }

  const pokeTxHash = await chain2WalletClient.sendTransaction({
    account: chain2WalletClient.account,
    to: chain2WalletClient.account.address,
    value: 1n,
  });
  await chain2PublicClient.waitForTransactionReceipt({ hash: pokeTxHash });
}

const sourceChainId = await chain1PublicClient.getChainId();
const args = {
  interopRoot,
  srcChainId: BigInt(sourceChainId),
  l1BatchNumber: proof.batchNumber,
  l2MessageIndex: proof.id,
  msgData: {
    txNumberInBatch,
    sender: txReceipt.to,
    data: messageData,
  },
  gatewayProof: proof.proof,
};

console.log('Interop root:', args.interopRoot);
console.log('Verification args:', args);
