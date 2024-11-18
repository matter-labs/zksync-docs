import * as hre from 'hardhat';

export default async function () {
  // ANCHOR: deploy
  const greeter = await hre.ethers.deployContract('Greeter', ['Hi there!']);
  await greeter.waitForDeployment();
  // ANCHOR_END: deploy

  // ANCHOR: deploy-factory
  const GreeterFactory = await hre.ethers.getContractFactory('Greeter');
  const greeterContract = await GreeterFactory.deploy('Hi there!'); // if any, pass constructor arguments in deploy arguments
  await greeterContract.waitForDeployment();
  // ANCHOR_END: deploy-factory
}
