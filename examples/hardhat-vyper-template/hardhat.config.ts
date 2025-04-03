import type { HardhatUserConfig } from 'hardhat/config';

// ANCHOR: zksync-vyper-import
import '@nomiclabs/hardhat-vyper';
import '@matterlabs/hardhat-zksync-vyper';
import '@matterlabs/hardhat-zksync-node';
import '@matterlabs/hardhat-zksync-ethers';
// ANCHOR_END: zksync-vyper-import

const config: HardhatUserConfig = {
  defaultNetwork: 'ZKsyncEraSepolia',
  networks: {
    ZKsyncEraSepolia: {
      url: 'https://sepolia.era.zksync.dev',
      ethNetwork: 'sepolia',
      zksync: true,
      verifyURL: 'https://explorer.sepolia.era.zksync.dev/contract_verification',
      accounts: process.env.WALLET_PRIVATE_KEY ? [process.env.WALLET_PRIVATE_KEY] : [],
    },
    ZKsyncEraMainnet: {
      url: 'https://mainnet.era.zksync.io',
      ethNetwork: 'mainnet',
      zksync: true,
      verifyURL: 'https://zksync2-mainnet-explorer.zksync.io/contract_verification',
      accounts: process.env.WALLET_PRIVATE_KEY ? [process.env.WALLET_PRIVATE_KEY] : [],
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
  // ANCHOR: zkvyper
  zkvyper: {
    version: 'latest', // Uses latest available in %%zk_git_repo_zkvyper-bin%%
    settings: {},
  },
  // ANCHOR_END: zkvyper
  solidity: '0.8.24',
  // Currently, only Vyper >0.3.3
  vyper: {
    version: '0.4.0',
  },
};

export default config;
