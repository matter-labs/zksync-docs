import type { HardhatUserConfig } from 'hardhat/config';
import hardhatVerify from '@nomicfoundation/hardhat-verify';

import hardhatToolboxViemPlugin from '@nomicfoundation/hardhat-toolbox-viem';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import hardhatToolboxMochaEthersPlugin from '@nomicfoundation/hardhat-toolbox-mocha-ethers';
import { configVariable } from 'hardhat/config';

const config: HardhatUserConfig = {
  // plugins: [hardhatToolboxMochaEthersPlugin],
  plugins: [hardhatToolboxViemPlugin, hardhatVerify],
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
  // ANCHOR: verify-config
  chainDescriptors: {
    8022833: {
      name: 'zksyncOS',
      blockExplorers: {
        blockscout: {
          name: 'Testnet Explorer',
          url: 'https://zksync-os-testnet-alpha.staging-scan-v2.zksync.dev',
          apiUrl: 'https://block-explorer-api.zksync-os-testnet-alpha.zksync.dev/api',
        },
      },
    },
  },
  // ANCHOR_END: verify-config
};

export default config;
