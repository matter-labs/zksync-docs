<script setup lang="ts">
const props = defineProps<{
  network: { type: String; required: true };
}>();

const chainName = props.network === 'mainnet' ? 'zkSync Era Mainnet' : 'zkSync Sepolia Testnet';

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
    icon="metamask"
    @click="addNetwork"
  >
    <img
      width="32"
      src="/images/metamask_logo.svg"
      class="m-0 p-0"
      :alt="Metamask"
    />
    Add {{ chainName }}
  </UButton>
</template>

<style scoped>
.add-network {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px 8px;
  gap: 4px;
  cursor: pointer;
  border: 1px solid #000;
}

img[src*='/images/metamask_logo.svg'] {
  content: url('/images/metamask_logo.svg');
}
</style>
