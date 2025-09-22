import type { HardhatUserConfig } from 'hardhat/config';

import hardhatToolboxViemPlugin from '@nomicfoundation/hardhat-toolbox-viem';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import hardhatToolboxMochaEthersPlugin from '@nomicfoundation/hardhat-toolbox-mocha-ethers';
import { configVariable } from 'hardhat/config';

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
    zksyncOS: {
      type: 'http',
      chainType: 'generic',
      url: 'https://zksync-os-testnet-alpha.zksync.dev',
      accounts: [configVariable('TESTNET_PRIVATE_KEY')],
    },
  },
  // ANCHOR_END: hh-config
};

export default config;
