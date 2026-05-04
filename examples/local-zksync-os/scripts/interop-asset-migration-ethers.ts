/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@matterlabs/zksync-js/ethers';
import { createEthersSdk } from '@matterlabs/zksync-js/ethers/sdk';
import { AbiCoder, Contract, Interface, JsonRpcProvider, ZeroAddress, ZeroHash, keccak256, toUtf8Bytes } from 'ethers';
import { network } from 'hardhat';

const L1_RPC_URL = 'http://localhost:8545';
const L2_RPC_URL = 'http://localhost:3050';
const L2_ASSET_TRACKER_ADDRESS = '0x000000000000000000000000000000000001000f';
const L1_MESSENGER_ADDRESS = '0x0000000000000000000000000000000000008008';
const TOPIC_L1_MESSAGE_SENT_NEW = keccak256(toUtf8Bytes('L1MessageSent(uint256,bytes32,bytes)'));
const TOPIC_L1_MESSAGE_SENT_LEG = keccak256(toUtf8Bytes('L1MessageSent(address,bytes32,bytes)'));

const tokenAddress = process.env.INTEROP_TOKEN_ADDRESS;

if (!tokenAddress) {
  throw new Error('Set INTEROP_TOKEN_ADDRESS to the deployed token contract address on chain 6565.');
}

const chain1 = await network.create({
  network: 'localZKsyncOSChain1',
  chainType: 'generic',
});
const l1 = await network.create({
  network: 'localZKsyncOSL1',
  chainType: 'l1',
});

const [l1Signer] = await l1.ethers.getSigners();
const [chain1Signer] = await chain1.ethers.getSigners();

const client = createClient({
  l1: l1Signer.provider,
  l2: chain1.ethers.provider,
  signer: l1Signer,
});
const sdk = createEthersSdk(client);

const l2Provider = new JsonRpcProvider(L2_RPC_URL);
const newPriorityRequestIface = new Interface([
  'event NewPriorityRequest(uint256 txId, bytes32 txHash, uint64 expirationTimestamp, tuple(uint256 txType, uint256 from, uint256 to, uint256 gasLimit, uint256 gasPerPubdataByteLimit, uint256 maxFeePerGas, uint256 maxPriorityFeePerGas, uint256 paymaster, uint256 nonce, uint256 value, uint256[4] reserved, bytes data, bytes signature, uint256[] factoryDeps, bytes paymasterInput, bytes reservedDynamic) transaction, bytes[] factoryDeps)',
]);

const l2AssetTrackerAbi = [
  'function initiateL1ToGatewayMigrationOnL2(bytes32 assetId)',
  'function tokenMigratedThisChain(bytes32 assetId) view returns (bool)',
  'function assetMigrationNumber(uint256 chainId, bytes32 assetId) view returns (uint256)',
] as const;

const l1AssetTrackerAbi = [
  'function receiveL1ToGatewayMigrationOnL1((uint256,uint256,uint256,address,uint16,bytes,bytes32[]))',
] as const;

type FinalizeL1DepositParams = {
  chainId: bigint;
  l2BatchNumber: bigint;
  l2MessageIndex: bigint;
  l2Sender: string;
  l2TxNumberInBatch: number;
  message: string;
  merkleProof: string[];
};

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function findL1MessageSentLog(receipt: NonNullable<Awaited<ReturnType<typeof client.zks.getReceiptWithL2ToL1>>>) {
  const matches = receipt.logs.filter((log: (typeof receipt.logs)[number]) => {
    const topic = (log.topics?.[0] ?? '').toLowerCase();
    return topic === TOPIC_L1_MESSAGE_SENT_NEW.toLowerCase() || topic === TOPIC_L1_MESSAGE_SENT_LEG.toLowerCase();
  });

  if (!matches.length) {
    throw new Error('No L1MessageSent event found in L2 receipt logs.');
  }

  const preferred = matches.find(
    (log: (typeof matches)[number]) => (log.address ?? '').toLowerCase() === L1_MESSENGER_ADDRESS.toLowerCase()
  );
  return preferred ?? matches[0];
}

function messengerLogIndex(rawReceipt: NonNullable<Awaited<ReturnType<typeof client.zks.getReceiptWithL2ToL1>>>) {
  const logs = Array.isArray(rawReceipt.l2ToL1Logs) ? rawReceipt.l2ToL1Logs : [];
  const hit = logs.findIndex(
    (log: (typeof logs)[number]) => (log?.sender ?? '').toLowerCase() === L1_MESSENGER_ADDRESS.toLowerCase()
  );

  if (hit === -1) {
    throw new Error('No L2->L1 messenger logs found in receipt.');
  }

  return hit;
}

function getPriorityOpL2Hash(
  l1Receipt: Awaited<ReturnType<typeof l1Signer.provider.waitForTransactionReceipt>>,
  mainContractAddress: `0x${string}`
): `0x${string}` {
  for (const log of l1Receipt.logs) {
    if (log.address.toLowerCase() !== mainContractAddress.toLowerCase()) {
      continue;
    }

    try {
      const parsed = newPriorityRequestIface.parseLog({
        topics: [...log.topics],
        data: log.data,
      });
      return parsed?.args.txHash as `0x${string}`;
    } catch {
      // Ignore unrelated logs from the same address.
    }
  }

  throw new Error(`Could not find a NewPriorityRequest log emitted by ${mainContractAddress}.`);
}

async function waitForFinalizeDepositParams(
  l2TxHash: `0x${string}`,
  timeoutMs: number = 10 * 60 * 1000
): Promise<FinalizeL1DepositParams> {
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    const parsedReceipt = await client.zks.getReceiptWithL2ToL1(l2TxHash);

    if (parsedReceipt?.logs?.length) {
      try {
        const messageLog = findL1MessageSentLog(parsedReceipt);
        const [message] = AbiCoder.defaultAbiCoder().decode(['bytes'], messageLog.data);
        const logIndex = messengerLogIndex(parsedReceipt);
        const proof = await client.zks.getL2ToL1LogProof(l2TxHash, logIndex);

        return {
          chainId: BigInt(await chain1.ethers.provider.getNetwork().then((net: { chainId: bigint }) => net.chainId)),
          l2BatchNumber: proof.batchNumber,
          l2MessageIndex: proof.id,
          l2Sender: parsedReceipt.to,
          l2TxNumberInBatch: Number(parsedReceipt.transactionIndex ?? 0),
          message,
          merkleProof: proof.proof,
        };
      } catch {
        // The receipt exists, but the messenger log/proof is not ready yet.
      }
    }

    await sleep(1_000);
  }

  throw new Error(`Timed out waiting for L2->L1 log proof for migration tx ${l2TxHash}.`);
}

async function waitForPriorityOpFromL1Receipt(
  l1Receipt: Awaited<ReturnType<typeof l1Signer.provider.waitForTransactionReceipt>>,
  mainContractAddress: `0x${string}`,
  timeoutMs: number = 10 * 60 * 1000
) {
  const l2Hash = getPriorityOpL2Hash(l1Receipt, mainContractAddress);
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    const priorityReceipt = await chain1.ethers.provider.getTransactionReceipt(l2Hash);
    if (priorityReceipt) {
      return priorityReceipt;
    }

    await sleep(1_000);
  }

  throw new Error(`Timed out waiting for priority op ${l2Hash} generated by L1 tx ${l1Receipt.hash}.`);
}

const { bridgehub, l1NativeTokenVault: l1Ntv, l2NativeTokenVault: ntv } = await sdk.contracts.instances();
const l1AssetTrackerAddress = await l1Ntv.l1AssetTracker();
const l2AssetTracker = new Contract(L2_ASSET_TRACKER_ADDRESS, l2AssetTrackerAbi, chain1Signer);
const ntvWriter = ntv.connect(chain1Signer);
const l1AssetTracker = new Contract(l1AssetTrackerAddress, l1AssetTrackerAbi, l1Signer);

const sourceChainId = BigInt((await l2Provider.getNetwork()).chainId);
const settlementLayerChainId = await bridgehub.settlementLayer(sourceChainId);
const nestedL1DiamondProxy = await bridgehub.getZKChain(sourceChainId);

let assetId = await ntv.assetId(tokenAddress);
if (assetId === ZeroHash) {
  const l1TokenAddressBefore = await l1Ntv.tokenAddress(assetId);
  console.log('Token is not registered in the L2 Native Token Vault yet. Registering now...');
  console.log(`L1 tokenAddress(assetId) before registration: ${l1TokenAddressBefore}`);
  const ensureTx = await ntvWriter.ensureTokenIsRegistered(tokenAddress);
  await ensureTx.wait();
  assetId = await ntv.assetId(tokenAddress);
}

const tokenAddressOnL1 = await l1Ntv.tokenAddress(assetId);
console.log(`L1 tokenAddress(assetId) before migration: ${tokenAddressOnL1}`);

if (tokenAddressOnL1 === ZeroAddress) {
  console.log(
    `Asset ${assetId} is already registered on the source L2 for token ${tokenAddress}, but it does not exist in the L1 Native Token Vault yet. Skipping duplicate L2 registration and continuing with migration.`
  );
}

const migratedBefore = await l2AssetTracker.tokenMigratedThisChain(assetId);
const migrationNumberBefore = await l2AssetTracker.assetMigrationNumber(sourceChainId, assetId);

console.log('Token migration status before:');
console.log({
  tokenAddress,
  assetId,
  sourceChainId: sourceChainId.toString(),
  settlementLayerChainId: settlementLayerChainId.toString(),
  l1AssetTrackerAddress,
  migratedBefore,
  migrationNumberBefore: migrationNumberBefore.toString(),
});

if (migratedBefore) {
  console.log('Token is already migrated on this chain. Nothing to do.');
  process.exit(0);
}

console.log(`   [TBM] Step 1: Calling initiateL1ToGatewayMigrationOnL2 on chain ${sourceChainId}...`);
const initiateTx = await l2AssetTracker.initiateL1ToGatewayMigrationOnL2(assetId, {
  gasLimit: 5_000_000n,
});
await initiateTx.wait();
console.log(`   [TBM] L2 tx: cast run ${initiateTx.hash} -r ${L2_RPC_URL}`);

const finalizeParams = await waitForFinalizeDepositParams(initiateTx.hash);
console.log(`   [TBM] Captured L2->L1 message (${finalizeParams.message.length} chars)`);

console.log('   [TBM] Step 2: Calling receiveL1ToGatewayMigrationOnL1 on L1...');
const l1Tx = await l1AssetTracker.receiveL1ToGatewayMigrationOnL1(
  [
    finalizeParams.chainId,
    finalizeParams.l2BatchNumber,
    finalizeParams.l2MessageIndex,
    finalizeParams.l2Sender,
    finalizeParams.l2TxNumberInBatch,
    finalizeParams.message,
    finalizeParams.merkleProof,
  ],
  {
    gasLimit: 10_000_000n,
  }
);
const l1Receipt = await l1Tx.wait();
if (!l1Receipt) {
  throw new Error('Failed to fetch the receipt for receiveL1ToGatewayMigrationOnL1.');
}
console.log(`   [TBM] L1 tx: cast run ${l1Tx.hash} -r ${L1_RPC_URL}`);

console.log('   [TBM] Step 3: Waiting for the migration priority op to execute...');
const priorityReceipt = await waitForPriorityOpFromL1Receipt(l1Receipt, nestedL1DiamondProxy);
console.log(`   [TBM] Priority op executed on L2 in tx ${priorityReceipt.hash}`);

const migratedAfter = await l2AssetTracker.tokenMigratedThisChain(assetId);
const migrationNumberAfter = await l2AssetTracker.assetMigrationNumber(sourceChainId, assetId);

if (!migratedAfter) {
  throw new Error('Migration relay completed, but the token is still not marked as migrated on the source L2.');
}

console.log(`   [TBM] Token balance migration complete for chain ${sourceChainId}, assetId ${assetId}`);
console.log({
  tokenAddress,
  assetId,
  migratedAfter,
  migrationNumberAfter: migrationNumberAfter.toString(),
});
