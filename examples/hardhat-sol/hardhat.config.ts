import type { HardhatUserConfig } from 'hardhat/config';
import '@matterlabs/hardhat-zksync';

const config: HardhatUserConfig = {
  defaultNetwork: 'inMemoryNode',
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
    // ANCHOR: dockerizedNode
    dockerizedNode: {
      url: 'http://localhost:3050',
      ethNetwork: 'http://localhost:8545',
      zksync: true,
    },
    // ANCHOR_END: dockerizedNode
    inMemoryNode: {
      url: 'http://127.0.0.1:8011',
      ethNetwork: 'localhost', // in-memory node doesn't support eth node; removing this line will cause an error
      zksync: true,
    },
    hardhat: {
      zksync: true,
    },
  },
  // ANCHOR: zksolc
  zksolc: {
    version: 'latest',
    settings: {
      libraries: {
        'contracts/MiniMath/MiniMath.sol': {
          MiniMath: '0x111C3E89Ce80e62EE88318C2804920D4c96f92bb',
        },
      },
    },
  },
  // ANCHOR_END: zksolc
  solidity: {
    version: '0.8.24',
  },
};

export default config;
