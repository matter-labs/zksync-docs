// import hardhatToolboxViemPlugin from '@nomicfoundation/hardhat-toolbox-viem';
import hardhatToolboxMochaEthersPlugin from '@nomicfoundation/hardhat-toolbox-mocha-ethers';
import { defineConfig } from 'hardhat/config';

export default defineConfig({
  // plugins: [hardhatToolboxViemPlugin],
  plugins: [hardhatToolboxMochaEthersPlugin],
  solidity: {
    profiles: {
      default: {
        version: '0.8.28',
      },
      production: {
        version: '0.8.28',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    },
  },
  ignition: {
    requiredConfirmations: 1,
  },
  networks: {
    localZKsyncOSL1: {
      type: 'http',
      chainType: 'l1',
      url: 'http://localhost:8545',
      accounts: ['0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110'],
    },
    localZKsyncOSChain1: {
      type: 'http',
      chainType: 'generic',
      url: 'http://localhost:3050',
      accounts: ['0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110'],
    },
    localZKsyncOSChain2: {
      type: 'http',
      chainType: 'generic',
      url: 'http://localhost:3051',
      accounts: ['0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110'],
    },
  },
});
