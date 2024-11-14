import * as hre from 'hardhat';

export default async function () {
  // ANCHOR: deploy
  const mainContract = await hre.ethers.deployContract('Main');
  await mainContract.waitForDeployment();
  console.log('Main contract deployed to:', mainContract.target);
  // ANCHOR_END: deploy
}
