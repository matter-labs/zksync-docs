import { ethers } from 'hardhat';
import { Provider } from 'zksync-ethers';

// Address of the ERC20 contract
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || '';
// Address to send tokens to
const RECIPIENT_ADDRESS = process.env.RECIPIENT_ADDRESS || '';
// Base URL of the private proxy RPC API
const BASE_URL = process.env.BASE_URL || 'http://localhost:4041';
if (!CONTRACT_ADDRESS || !RECIPIENT_ADDRESS) throw '⛔️ Provide address of the contract and recipient.';

async function main() {
  console.log(`Running script to interact with token contract ${CONTRACT_ADDRESS}`);

  // Get deployer address
  const [deployer] = await ethers.getWallets();
  console.log(`Deployer address: ${deployer.address}`);

  // Register the user and get user access token
  const userToken = await registerUser(deployer.address);
  // You can reuse the token after the first registration
  // const userToken = '';
  console.log('User token:', userToken);

  // Connect to user-specific url
  const provider = new Provider(`${BASE_URL}/rpc/${userToken}`);
  console.log('Connected to provider:');
  const signer = new ethers.Wallet(deployer.privateKey, provider);
  console.log(`Signer address: ${signer.address}`);

  // Get the ERC20 deployed contract
  const ERC20Factory = await ethers.getContractFactory('MyERC20Token');
  const ERC20Contract = ERC20Factory.connect(signer).attach(CONTRACT_ADDRESS);
  console.log('got contract');

  // get the token balance of the deployer wallet
  let balance = await ERC20Contract.balanceOf(signer.address);
  console.log(`${signer.address} token balance: ${ethers.formatUnits(balance, 18)}`);

  // approve transfer
  const amount = ethers.parseUnits('1', 18);
  const tx = await ERC20Contract.approve(signer.address, amount);
  console.log(`Transaction hash: ${tx.hash}`);
  await tx.wait();
  console.log(`✅ Approved.`);

  // transfer tokens
  const transferTx = await ERC20Contract.transfer(RECIPIENT_ADDRESS, amount);
  console.log(`Transaction hash: ${transferTx.hash}`);
  await transferTx.wait();
  console.log(`✅ Transferred ${ethers.formatUnits(amount, 18)} tokens to ${RECIPIENT_ADDRESS}.`);

  // get the token balance of the deployer wallet
  balance = await ERC20Contract.balanceOf(signer.address);
  console.log(`${signer.address} token balance: ${ethers.formatUnits(balance, 18)}`);
}

interface RegisterUserInput {
  address: string;
  secret: string;
}

// register the user and get user access token
async function registerUser(address: string) {
  const url = `${BASE_URL}/users`;
  const input: RegisterUserInput = {
    address,
    secret: 'sososecret',
  };
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    const json = await response.json();
    console.log('Register User Response JSON:', json);
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    return json.token;
  } catch (error) {
    console.error('ERROR:', error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
