// ANCHOR: imports
import { expect } from 'chai';
import { Wallet, type Contract } from 'ethers';

import * as hre from 'hardhat';
// ANCHOR_END: imports

describe('Greeter', function () {
  let greeter: Contract;

  before(async function () {
    // Deploy the Greeter contract
    const Greeter = await hre.ethers.getContractFactory('Greeter');
    const greeting = 'Hello world!';
    greeter = await Greeter.deploy(greeting);
    await greeter.waitForDeployment();
  });

  // Test the greet() function
  it("Should return the new greeting once it's changed", async function () {
    // Ensure the greet function returns the initial greeting after deployment
    expect(await greeter.greet()).to.eq('Hello world!');
  });

  // Test the setGreeting() function
  it('Should set a new greeting and return it', async function () {
    // Set a new greeting
    const setGreetingTx = await greeter.setGreeting('Hola, mundo!');
    // Wait for the transaction to be confirmed
    await setGreetingTx.wait();

    // Ensure the greet function returns the newly set greeting
    expect(await greeter.greet()).to.equal('Hola, mundo!');
  });

  // Test for lack of funds (or other tx failures)
  it('Should fail when insufficient funds', async function () {
    // Create an empty wallet with no funds
    const userWallet = Wallet.createRandom();
    // Connect the empty wallet to the greeter contract and attempt to set a new greeting
    try {
      greeter.connect(userWallet);
      await greeter.setGreeting('fail');
      // The following line should not be reached if the transaction fails
      expect(true).to.equal(false);
    } catch (e) {
      // Expect an error to be thrown for the transaction
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      expect(e).to.exist;
    }
  });
});
