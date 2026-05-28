import { createClient } from '@matterlabs/zksync-js/ethers';
import { createEthersSdk } from '@matterlabs/zksync-js/ethers/sdk';
import { findL1MessageSentLog, messengerLogIndex } from '@matterlabs/zksync-js/core';
import { AbiCoder, JsonRpcProvider, ZeroHash } from 'ethers';
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
const gatewayProvider = new JsonRpcProvider(gatewayRpc);

const [l1Signer] = await l1.ethers.getSigners();
const [chain2Signer] = await chain2.ethers.getSigners();

const client = createClient({
  l1: l1Signer.provider,
  l2: chain1.ethers.provider,
  signer: l1Signer,
});
const sdk = createEthersSdk(client, {
  interop: { gwChain: gatewayRpc },
});

const abiCoder = AbiCoder.defaultAbiCoder();

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const txReceipt = await chain1.ethers.provider.getTransactionReceipt(txHash);
if (!txReceipt) {
  throw new Error(`Transaction receipt not found for ${txHash}.`);
}

const receiptWithLogs = await client.zks.getReceiptWithL2ToL1(txHash as `0x${string}`);
if (!receiptWithLogs) {
  throw new Error(`L2 -> L1 receipt not found for ${txHash}.`);
}

const messageLog = findL1MessageSentLog(txReceipt, { prefer: 'messenger' });
if (!txReceipt.to) {
  throw new Error(`Transaction target not found for ${txHash}.`);
}
const txNumberInBatch = Number(txReceipt.transactionIndex);
if (!Number.isInteger(txNumberInBatch)) {
  throw new Error(`Transaction index is not available for ${txHash}.`);
}

const [messageData] = abiCoder.decode(['bytes'], messageLog.data) as [`0x${string}`];
const messageLogIndex = messengerLogIndex(receiptWithLogs);

while (true) {
  const finalizedBlock = await chain1.ethers.provider.getBlock('finalized');
  if (finalizedBlock && finalizedBlock.number >= txReceipt.blockNumber) {
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

const { chainId: gatewayChainId } = await gatewayProvider.getNetwork();
let interopRoot = ZeroHash;
while (interopRoot === ZeroHash) {
  interopRoot = await sdk.interop.getInteropRoot(chain2.ethers.provider, gatewayChainId, proof.gatewayBlockNumber);
  if (interopRoot !== ZeroHash) {
    break;
  }

  const pokeTx = await chain2Signer.sendTransaction({
    to: await chain2Signer.getAddress(),
    value: 1n,
  });
  await pokeTx.wait();
}

const sourceChain = await chain1.ethers.provider.getNetwork();
const args = {
  interopRoot,
  srcChainId: sourceChain.chainId,
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
