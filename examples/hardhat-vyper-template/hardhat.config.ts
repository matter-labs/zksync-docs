import type { HardhatUserConfig } from 'hardhat/config';

// ANCHOR: zksync-vyper-import
import '@nomiclabs/hardhat-vyper';
import '@matterlabs/hardhat-zksync-vyper';
import '@matterlabs/hardhat-zksync-node';
import '@matterlabs/hardhat-zksync-deploy';
// ANCHOR_END: zksync-vyper-import

const config: HardhatUserConfig = {
  defaultNetwork: 'zkSyncSepoliaTestnet',
  networks: {
    zkSyncSepoliaTestnet: {
      url: 'https://sepolia.era.zksync.dev',
      ethNetwork: 'sepolia',
      zksync: true,
    },
    zkSyncMainnet: {
      url: 'https://mainnet.era.zksync.io',
      ethNetwork: 'mainnet',
      zksync: true,
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
  // ANCHOR: zkvyper
  zkvyper: {
    version: 'latest', // Uses latest available in %%zk_git_repo_zkvyper-bin%%
    settings: {},
  },
  // ANCHOR_END: zkvyper
  // Currently, only Vyper 0.3.3 or 0.3.9 are supported.
  vyper: {
    version: '0.3.3',
  },
};

export default config;
