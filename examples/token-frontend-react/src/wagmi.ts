import { createConfig, http } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { defineChain } from 'viem';
import { anvil } from 'viem/chains';

const zksyncOSTestnet = defineChain({
  id: 8022833,
  name: 'ZKsync OS Developer Preview',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: { default: { http: ['https://zksync-os-testnet-alpha.zksync.dev'] } },
  blockExplorers: {
    default: {
      name: 'ZKsync OS Developer Preview Explorer',
      url: 'https://zksync-os-testnet-alpha.staging-scan-v2.zksync.dev',
    },
  },
});

export const activeChain = import.meta.env.VITE_CHAIN === 'local' ? anvil : zksyncOSTestnet;

export const config =
  import.meta.env.VITE_CHAIN === 'local'
    ? createConfig({
        chains: [anvil],
        connectors: [injected()],
        transports: {
          [anvil.id]: http(),
        },
      })
    : createConfig({
        chains: [zksyncOSTestnet],
        connectors: [injected()],
        transports: {
          [zksyncOSTestnet.id]: http(),
        },
      });
