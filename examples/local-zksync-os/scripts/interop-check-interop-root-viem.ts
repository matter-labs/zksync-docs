import { createClient } from '@matterlabs/zksync-js/viem';
import { createViemSdk } from '@matterlabs/zksync-js/viem/sdk';
import { messengerLogIndex } from '@matterlabs/zksync-js/core';
import { createPublicClient, http, zeroHash } from 'viem';
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

while (true) {
  const root = await sdk.interop.getInteropRoot(chain2PublicClient, BigInt(gatewayChainId), proof.gatewayBlockNumber);
  if (root !== zeroHash) {
    console.log('Interop root is updated on chain 6566:', root);
    break;
  }

  const pokeTxHash = await chain2WalletClient.sendTransaction({
    account: chain2WalletClient.account,
    to: chain2WalletClient.account.address,
    value: 1n,
  });
  await chain2PublicClient.waitForTransactionReceipt({ hash: pokeTxHash });
}
