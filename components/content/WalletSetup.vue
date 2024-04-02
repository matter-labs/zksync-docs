<script setup lang="ts">
const items = [
  {
    label: 'Fund Wallet',
    content: `
      Deploying contracts on the zkSync Sepolia testnet requires having testnet ETH. If you're working within the local development environment, you can utilize pre-configured rich wallets and skip this step. For testnet deployments, follow these steps to secure your funds: 
      1. Obtaining Testnet ETH:
        - Use the [LearnWeb3 faucet](https://learnweb3.io/faucets/zksync_sepolia/) to directly receive testnet ETH on zkSync Sepolia.
        - Alternatively, acquire SepoliaETH from [recommended faucets](https://www.notion.so/tooling/network-faucets.md) and transfer it to the zkSync Sepolia testnet via the [zkSync bridge](https://portal.zksync.io/bridge/?network=sepolia).
      2. Verify your balance:
        - Check your wallet's balance using the [zkSync Sepolia explorer](https://sepolia.explorer.zksync.io/).
      `,
  },
  {
    label: 'Configuring Your Wallet in the Project',
    content: `
      To deploy contracts, you'll need to securely add your wallet's private key to the project environment:

      1. **Extract Your Private Key:**
          - Find your wallet's private key. For MetaMask users, here's how to [export your wallet's private key](https://support.metamask.io/hc/en-us/articles/360015289632-How-to-export-an-account-s-private-key). If you're in the local environment, use a private key from the available rich accounts.
      2. **Prepare the Environment File:**
      - Locate the **.env.example** file in your project directory. Rename this file to **.env**.
      1. **Add Your Private Key:**
          - Open the .env file and add your private key in the following format:
          code
          PRIVATE_KEY=your_private_key_here
          code
        - Replace **your_private_key_here** with your actual private key.
    `,
  },
];
</script>

<template>
  <ULandingFAQ
    :items="items"
    multiple
  >
    <template #item="{ item }">
      <component :is="item.contentComponent" />
    </template>
  </ULandingFAQ>
</template>
