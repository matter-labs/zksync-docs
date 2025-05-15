/* eslint-disable @typescript-eslint/no-explicit-any */
import ERC20_ABI from '../artifacts-zk/contracts/TestToken.sol/TestToken.json';
// ANCHOR: start
import { ethers } from 'ethers';

// Address of the ERC20 token contract
const TOKEN_CONTRACT_ADDRESS = '';
// Wallet that will receive tokens
const RECEIVER_WALLET = '';
// Amount of tokens to mint in ETH format, e.g. 1.23
const TOKEN_AMOUNT = '';

(async () => {
  try {
    // ANCHOR_END: start
    // // Note that the script needs the ABI which is generated from the compilation artifact.
    // // Make sure contract is compiled and artifacts are generated
    // const artifactsPath = `browser/contracts/artifacts/TestToken.json`
    // console.log(artifactsPath)

    // const metadata = JSON.parse(await remix.call('fileManager', 'getFile', artifactsPath))

    // 'web3Provider' is a remix global variable object
    // const signer = (new ethers.BrowserProvider(web3Provider)).getSigner(0)
    const metadata = ERC20_ABI;

    const browserWindow = window as any;
    const signer = await new ethers.BrowserProvider(browserWindow.ethereum).getSigner(0);

    // ANCHOR: end
    // initialise token contract with address, abi and signer
    const tokenContract = new ethers.Contract(TOKEN_CONTRACT_ADDRESS, metadata.abi, signer);

    console.log('Minting tokens...');
    const tx = await tokenContract.mint(RECEIVER_WALLET, ethers.parseEther(TOKEN_AMOUNT));
    console.log(`Mint transaction is ${tx.hash}`);
    await tx.wait();
    console.log('Success!');

    const balance = await tokenContract.balanceOf(RECEIVER_WALLET);

    console.log(`The account ${RECEIVER_WALLET} now has ${balance} tokens`);
  } catch (e: any) {
    console.log(e.message);
  }
})();
// ANCHOR_END: end
