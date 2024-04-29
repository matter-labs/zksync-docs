<script setup lang="ts">
const props = defineProps({
  network: { type: String, required: true },
});

const chainName = props.network === 'mainnet' ? 'ZKsync Era Mainnet' : 'ZKsync Sepolia Testnet';

function addNetwork() {
  const config = {
    mainnet: {
      chainId: '0x144',
      rpcUrls: ['https://mainnet.era.zksync.io'],
      blockExplorerUrls: ['https://explorer.zksync.io/'],
    },
    testnet: {
      chainId: '0x12c',
      rpcUrls: ['https://sepolia.era.zksync.dev'],
      blockExplorerUrls: ['https://sepolia.explorer.zksync.dev/'],
    },
  }[props.network];

  window.ethereum.request({
    method: 'wallet_addEthereumChain',
    params: [
      {
        chainId: config.chainId,
        chainName: chainName,
        nativeCurrency: { name: 'Ethereum', symbol: 'ETH', decimals: 18 },
        iconUrls: ['https://docs.zksync.io/favicon-32x32.png'],
        rpcUrls: config.rpcUrls,
        blockExplorerUrls: config.blockExplorerUrls,
      },
    ],
  });
}
</script>

<template>
  <UButton
    type="button"
    icon="i-custom-metamask-logo"
    size="xl"
    :variant="chainName === 'ZKsync Era Mainnet' ? 'solid' : 'soft'"
    @click="addNetwork"
  >
    Add {{ chainName }}
  </UButton>
</template>
