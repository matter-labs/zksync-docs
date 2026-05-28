import type { HardhatUserConfig } from 'hardhat/config';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import hardhatToolboxMochaEthersPlugin from '@nomicfoundation/hardhat-toolbox-mocha-ethers';
import hardhatToolboxViemPlugin from '@nomicfoundation/hardhat-toolbox-viem';

const config: HardhatUserConfig = {
  // plugins: [hardhatToolboxMochaEthersPlugin],
  plugins: [hardhatToolboxViemPlugin],
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
  // ANCHOR: hh-config
  ignition: {
    requiredConfirmations: 1,
  },
  networks: {
    anvil: {
      type: 'http',
      chainType: 'generic',
      url: 'http://localhost:8545',
      accounts: ['0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'],
    },
  },
  // ANCHOR_END: hh-config
};

export default config;
