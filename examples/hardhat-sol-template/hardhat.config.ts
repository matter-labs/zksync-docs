import type { HardhatUserConfig } from 'hardhat/config';
// ANCHOR: zksync-import
import '@matterlabs/hardhat-zksync';
// ANCHOR_END: zksync-import
const config: HardhatUserConfig = {
  // ANCHOR: networks
  defaultNetwork: 'zkSyncSepoliaTestnet',
  networks: {
    zkSyncSepoliaTestnet: {
      url: 'https://sepolia.era.zksync.dev',
      ethNetwork: 'sepolia',
      zksync: true,
      verifyURL: 'https://explorer.sepolia.era.zksync.dev/contract_verification',
    },
    zkSyncMainnet: {
      url: 'https://mainnet.era.zksync.io',
      ethNetwork: 'mainnet',
      zksync: true,
      verifyURL: 'https://zksync2-mainnet-explorer.zksync.io/contract_verification',
    },
    dockerizedNode: {
      url: 'http://localhost:3050',
      ethNetwork: 'http://localhost:8545',
      zksync: true,
    },
    inMemoryNode: {
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
    version: '0.8.17',
  },
};

export default config;
