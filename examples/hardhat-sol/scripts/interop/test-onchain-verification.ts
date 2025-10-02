import { getVerificationArgs } from './get-verification-args-local';
import { Contract, Provider, Wallet } from 'zksync-ethers';
import ABI_JSON from '../../artifacts-zk/contracts/InteropVerification.sol/InteropVerification.json';

// private key for local pre-configured rich wallet
const PRIVATE_KEY = '0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110';
const CHAIN_RPC = 'http://localhost:3050';
const L1_RPC = 'http://localhost:8545';

const providerl2 = new Provider(CHAIN_RPC);
const providerl1 = new Provider(L1_RPC);
const wallet = new Wallet(PRIVATE_KEY, providerl2, providerl1);

const CONTRACT_ADDRESS = '0x...';

export async function testOnchainVerification() {
  const args = await getVerificationArgs();
  const contract = new Contract(CONTRACT_ADDRESS, ABI_JSON.abi, wallet);
  const response = await contract.checkVerification(
    args.srcChainId,
    args.l1BatchNumber,
    args.l2MessageIndex,
    args.msgData,
    args.gatewayProof
  );
  console.log('message is verified:', response);
}
