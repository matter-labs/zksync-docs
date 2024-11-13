import * as hre from 'hardhat';

export default async function () {
  // ANCHOR: deploy
  const mainContract = await hre.ethers.deployContract('Main');
  await mainContract.waitForDeployment();
  // ANCHOR_END: deploy
  console.log('Main contract deployed to:', mainContract.target);
}
