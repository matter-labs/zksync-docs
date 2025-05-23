import { ethers } from 'hardhat';
import { Provider } from 'zksync-ethers';

// Address of the ERC20 contract
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || '';
const BASE_URL = process.env.BASE_URL || 'http://localhost:4041';
const USER_TOKEN = process.env.USER_TOKEN || '';
if (!CONTRACT_ADDRESS || !USER_TOKEN) throw '⛔️ Provide address of the contract and user token.';

async function main() {
  console.log(`Running script to check balance of token ${CONTRACT_ADDRESS}`);

  // Get wallet address
  const [wallet] = await ethers.getWallets();

  // Connect to user-specific url
  const provider = new Provider(`${BASE_URL}/rpc/${USER_TOKEN}`);
  const signer = new ethers.Wallet(wallet.privateKey, provider);

  // Get the ERC20 deployed contract
  const ERC20Factory = await ethers.getContractFactory('MyERC20Token');
  const ERC20Contract = ERC20Factory.connect(signer).attach(CONTRACT_ADDRESS);

  // Get the token balance
  // Checking the balance for another address will fail with 'unauthorized' error
  const balance = await ERC20Contract.balanceOf(signer);
  console.log(`${signer.address} token balance: ${ethers.formatUnits(balance, 18)}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
