/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@matterlabs/zksync-js/viem';
import { createViemSdk } from '@matterlabs/zksync-js/viem/sdk';
import { Interface, JsonRpcProvider, ZeroHash } from 'ethers';
import { network } from 'hardhat';
import { getContract, parseAbi, zeroAddress } from 'viem';

const L1_RPC_URL = 'http://localhost:8545';
const L2_RPC_URL = 'http://localhost:3050';
const L2_ASSET_TRACKER_ADDRESS = '0x000000000000000000000000000000000001000f';

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

const l1PublicClient = await l1.viem.getPublicClient();
const chain1PublicClient = await chain1.viem.getPublicClient();
const [chain1WalletClient] = await chain1.viem.getWalletClients();
const [l1WalletClient] = await l1.viem.getWalletClients();

const client = createClient({
  l1: l1PublicClient,
  l2: chain1PublicClient,
  l1Wallet: l1WalletClient,
});
const sdk = createViemSdk(client);

const l2Provider = new JsonRpcProvider(L2_RPC_URL);
const l1MessageSentIface = new Interface([
  'event L1MessageSent(address indexed sender, bytes32 indexed hash, bytes message)',
]);
const newPriorityRequestIface = new Interface([
  'event NewPriorityRequest(uint256 txId, bytes32 txHash, uint64 expirationTimestamp, tuple(uint256 txType, uint256 from, uint256 to, uint256 gasLimit, uint256 gasPerPubdataByteLimit, uint256 maxFeePerGas, uint256 maxPriorityFeePerGas, uint256 paymaster, uint256 nonce, uint256 value, uint256[4] reserved, bytes data, bytes signature, uint256[] factoryDeps, bytes paymasterInput, bytes reservedDynamic) transaction, bytes[] factoryDeps)',
]);

const l2AssetTrackerAbi = parseAbi([
  'function initiateL1ToGatewayMigrationOnL2(bytes32 assetId)',
  'function tokenMigratedThisChain(bytes32 assetId) view returns (bool)',
  'function assetMigrationNumber(uint256 chainId, bytes32 assetId) view returns (uint256)',
]);

const l2NativeTokenVaultWriteAbi = parseAbi(['function registerToken(address nativeToken)']);

const l1AssetTrackerAbi = parseAbi([
  'function receiveL1ToGatewayMigrationOnL1((uint256,uint256,uint256,address,uint16,bytes,bytes32[]))',
]);

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

function getPriorityOpL2Hash(
  l1Receipt: Awaited<ReturnType<typeof l1PublicClient.waitForTransactionReceipt>>,
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

    if (parsedReceipt?.logs) {
      let message: string | undefined;

      for (const log of parsedReceipt.logs) {
        try {
          const parsed = l1MessageSentIface.parseLog(log);
          message = parsed?.args.message as string;
          break;
        } catch {
          // Keep scanning logs until the messenger event is found.
        }
      }

      if (message) {
        try {
          const proof = await client.zks.getL2ToL1LogProof(l2TxHash, 0);
          return {
            chainId: BigInt(await chain1PublicClient.getChainId()),
            l2BatchNumber: proof.batchNumber,
            l2MessageIndex: proof.id,
            l2Sender: parsedReceipt.to,
            l2TxNumberInBatch: Number(parsedReceipt.transactionIndex ?? 0),
            message,
            merkleProof: proof.proof,
          };
        } catch {
          // The receipt exists, but the proof is not ready yet.
        }
      }
    }

    await sleep(1_000);
  }

  throw new Error(`Timed out waiting for L2->L1 log proof for migration tx ${l2TxHash}.`);
}

async function waitForPriorityOpFromL1Receipt(
  l1Receipt: Awaited<ReturnType<typeof l1PublicClient.waitForTransactionReceipt>>,
  mainContractAddress: `0x${string}`,
  timeoutMs: number = 10 * 60 * 1000
) {
  const l2Hash = getPriorityOpL2Hash(l1Receipt, mainContractAddress);
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    try {
      const priorityReceipt = await chain1PublicClient.getTransactionReceipt({ hash: l2Hash });
      if (priorityReceipt) {
        return priorityReceipt;
      }
    } catch {
      // The priority op has not executed yet.
    }

    await sleep(1_000);
  }

  throw new Error(`Timed out waiting for priority op ${l2Hash} generated by L1 tx ${l1Receipt.transactionHash}.`);
}

const { bridgehub, l1NativeTokenVault: l1Ntv, l2NativeTokenVault: ntv } = await sdk.contracts.instances();
const l1AssetTrackerAddress = await l1Ntv.read.l1AssetTracker();
const l2AssetTracker = getContract({
  address: L2_ASSET_TRACKER_ADDRESS,
  abi: l2AssetTrackerAbi,
  client: { public: chain1PublicClient, wallet: chain1WalletClient } as any,
}) as any;
const ntvWriter = getContract({
  address: ntv.address,
  abi: l2NativeTokenVaultWriteAbi,
  client: { public: chain1PublicClient, wallet: chain1WalletClient } as any,
}) as any;
const l1AssetTracker = getContract({
  address: l1AssetTrackerAddress,
  abi: l1AssetTrackerAbi,
  client: { public: l1PublicClient, wallet: l1WalletClient } as any,
}) as any;
const sourceChainId = BigInt((await l2Provider.getNetwork()).chainId);
const settlementLayerChainId = await bridgehub.read.settlementLayer([sourceChainId]);
const nestedL1DiamondProxy = await bridgehub.read.getZKChain([sourceChainId]);
let assetId = await ntv.read.assetId([tokenAddress]);
if (assetId === ZeroHash) {
  const l1TokenAddressBefore = await l1Ntv.read.tokenAddress([assetId]);
  console.log('Token is not registered in the L2 Native Token Vault yet. Registering now...');
  console.log(`L1 tokenAddress(assetId) before registration: ${l1TokenAddressBefore}`);
  const registerTxHash = await ntvWriter.write.registerToken([tokenAddress]);
  await chain1PublicClient.waitForTransactionReceipt({ hash: registerTxHash });
  assetId = await ntv.read.assetId([tokenAddress]);
}

const tokenAddressOnL1 = await l1Ntv.read.tokenAddress([assetId]);
console.log(`L1 tokenAddress(assetId) before migration: ${tokenAddressOnL1}`);

if (tokenAddressOnL1 === zeroAddress) {
  console.log(
    `Asset ${assetId} is already registered on the source L2 for token ${tokenAddress}, but it does not exist in the L1 Native Token Vault yet. Skipping duplicate L2 registration and continuing with migration.`
  );
}

const migratedBefore = await l2AssetTracker.read.tokenMigratedThisChain([assetId]);
const migrationNumberBefore = await l2AssetTracker.read.assetMigrationNumber([sourceChainId, assetId]);

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
const initiateTxHash = await l2AssetTracker.write.initiateL1ToGatewayMigrationOnL2([assetId], {
  gas: 5_000_000n,
});
const initiateReceipt = await chain1PublicClient.waitForTransactionReceipt({ hash: initiateTxHash });
if (!initiateReceipt) {
  throw new Error('Failed to fetch the receipt for initiateL1ToGatewayMigrationOnL2.');
}
console.log(`   [TBM] L2 tx: cast run ${initiateTxHash} -r ${L2_RPC_URL}`);

const finalizeParams = await waitForFinalizeDepositParams(initiateTxHash);
console.log(`   [TBM] Captured L2->L1 message (${finalizeParams.message.length} chars)`);

console.log('   [TBM] Step 2: Calling receiveL1ToGatewayMigrationOnL1 on L1...');
const l1TxHash = await l1AssetTracker.write.receiveL1ToGatewayMigrationOnL1(
  [
    [
      finalizeParams.chainId,
      finalizeParams.l2BatchNumber,
      finalizeParams.l2MessageIndex,
      finalizeParams.l2Sender,
      finalizeParams.l2TxNumberInBatch,
      finalizeParams.message,
      finalizeParams.merkleProof,
    ],
  ],
  {
    gas: 10_000_000n,
  }
);
const l1Receipt = await l1PublicClient.waitForTransactionReceipt({ hash: l1TxHash });
if (!l1Receipt) {
  throw new Error('Failed to fetch the receipt for receiveL1ToGatewayMigrationOnL1.');
}
console.log(`   [TBM] L1 tx: cast run ${l1TxHash} -r ${L1_RPC_URL}`);
console.log('   [TBM] Step 3: Waiting for the migration priority op to execute...');
const priorityReceipt = await waitForPriorityOpFromL1Receipt(l1Receipt, nestedL1DiamondProxy);
console.log(`   [TBM] Priority op executed on L2 in tx ${priorityReceipt.transactionHash}`);

const migratedAfter = await l2AssetTracker.read.tokenMigratedThisChain([assetId]);
const migrationNumberAfter = await l2AssetTracker.read.assetMigrationNumber([sourceChainId, assetId]);

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
