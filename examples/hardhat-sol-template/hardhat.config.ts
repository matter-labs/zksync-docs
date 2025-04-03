import type { HardhatUserConfig } from 'hardhat/config';
// ANCHOR: zksync-import
import '@matterlabs/hardhat-zksync';
// ANCHOR_END: zksync-import
const config: HardhatUserConfig = {
  // ANCHOR: networks
  defaultNetwork: 'ZKsyncEraSepolia',
  networks: {
    ZKsyncEraSepolia: {
      url: 'https://sepolia.era.zksync.dev',
      ethNetwork: 'sepolia',
      zksync: true,
      verifyURL: 'https://block-explorer-api.sepolia.zksync.dev/api',
    },
    ZKsyncEraMainnet: {
      url: 'https://mainnet.era.zksync.io',
      ethNetwork: 'mainnet',
      zksync: true,
      verifyURL: 'https://block-explorer-api.mainnet.zksync.io/api',
    },
    dockerizedNode: {
      url: 'http://localhost:3050',
      ethNetwork: 'http://localhost:8545',
      zksync: true,
    },
    anvilZKsync: {
      url: 'http://127.0.0.1:8011',
      ethNetwork: 'localhost', // in-memory node doesn't support eth node; removing this line will cause an error
      zksync: true,
    },
    hardhat: {
      zksync: true,
    },
  },
  // ANCHOR_END: networks
  // ANCHOR: zksolc
  zksolc: {
    version: 'latest', // Uses latest available in %%zk_git_repo_zksolc-bin%%
    settings: {},
  },
  // ANCHOR_END: zksolc
  solidity: {
    version: '0.8.24',
  },
};

export default config;
