<template>
  <div class="space-y-6">
    <!-- Mainnet Details -->
    <div class="not-prose overflow-x-auto">
      <UTable
        :columns="columns"
        :rows="mainnetDetails"
        class="min-w-full divide-y divide-gray-200 rounded-lg border border-gray-200 dark:divide-gray-700 dark:border-gray-700"
        :ui="{
          table: 'w-full table-auto',
          thead: 'bg-gray-50 dark:bg-gray-800',
          tbody: 'divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900',
          td: { base: 'whitespace-nowrap px-6 py-4' },
          tr: { base: 'transition-colors hover:bg-gray-50 dark:hover:bg-gray-800' },
          th: {
            base: 'px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400',
          },
        }"
      >
        <template #value-data="{ row }">
          <div class="flex items-center">
            <CopyableUrl
              v-if="row.isCopyable"
              :url="row.value"
            />
            <code
              v-else-if="row.isCode"
              class="rounded bg-gray-100 px-2 py-1 font-mono text-xs text-gray-900 dark:bg-gray-700 dark:text-gray-100"
            >
              {{ row.value }}
            </code>
            <a
              v-else-if="row.isLink"
              :href="row.value"
              target="_blank"
              rel="noopener noreferrer"
              class="text-primary hover:text-primary-dark transition-colors"
            >
              {{ row.value }}
            </a>
            <span
              v-else
              class="text-sm text-gray-900 dark:text-gray-100"
            >
              {{ row.value }}
            </span>
          </div>
        </template>
      </UTable>
    </div>

    <!-- Testnet Details -->
    <div class="not-prose overflow-x-auto">
      <UTable
        :columns="columns"
        :rows="testnetDetails"
        class="min-w-full divide-y divide-gray-200 rounded-lg border border-gray-200 dark:divide-gray-700 dark:border-gray-700"
        :ui="{
          table: 'w-full table-auto',
          thead: 'bg-gray-50 dark:bg-gray-800',
          tbody: 'divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900',
          td: { base: 'whitespace-nowrap px-6 py-4' },
          tr: { base: 'transition-colors hover:bg-gray-50 dark:hover:bg-gray-800' },
          th: {
            base: 'px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400',
          },
        }"
      >
        <template #value-data="{ row }">
          <div class="flex items-center">
            <CopyableUrl
              v-if="row.isCopyable"
              :url="row.value"
            />
            <code
              v-else-if="row.isCode"
              class="rounded bg-gray-100 px-2 py-1 font-mono text-xs text-gray-900 dark:bg-gray-700 dark:text-gray-100"
            >
              {{ row.value }}
            </code>
            <a
              v-else-if="row.isLink"
              :href="row.value"
              target="_blank"
              rel="noopener noreferrer"
              class="text-primary hover:text-primary-dark transition-colors"
            >
              {{ row.value }}
            </a>
            <span
              v-else
              class="text-sm text-gray-900 dark:text-gray-100"
            >
              {{ row.value }}
            </span>
          </div>
        </template>
      </UTable>
    </div>
  </div>
</template>

<script setup lang="ts">
interface NetworkDetail {
  property: string;
  value: string;
  isCopyable?: boolean;
  isCode?: boolean;
  isLink?: boolean;
}

const columns = [
  {
    key: 'property',
    label: 'Property',
  },
  {
    key: 'value',
    label: 'Value',
  },
];

const mainnetDetails: NetworkDetail[] = [
  { property: 'Network Name', value: 'ZKsync Era Mainnet', isCode: true },
  { property: 'RPC URL', value: 'https://mainnet.era.zksync.io', isCopyable: true },
  { property: 'WebSocket URL', value: 'wss://mainnet.era.zksync.io/ws', isCopyable: true },
  { property: 'Chain ID', value: '324', isCode: true },
  { property: 'Currency Symbol', value: 'ETH', isCode: true },
  { property: 'Block Explorer URL', value: 'https://explorer.zksync.io', isLink: true },
  {
    property: 'Explorer Verification API',
    value: 'https://zksync2-mainnet-explorer.zksync.io/contract_verification',
    isCopyable: true,
  },
];

const testnetDetails: NetworkDetail[] = [
  { property: 'Network Name', value: 'ZKsync Era Sepolia', isCode: true },
  { property: 'RPC URL', value: 'https://sepolia.era.zksync.dev', isCopyable: true },
  { property: 'WebSocket URL', value: 'wss://sepolia.era.zksync.dev/ws', isCopyable: true },
  { property: 'Chain ID', value: '300', isCode: true },
  { property: 'Currency Symbol', value: 'ETH', isCode: true },
  { property: 'Block Explorer URL', value: 'https://sepolia.explorer.zksync.io', isLink: true },
  {
    property: 'Explorer Verification API',
    value: 'https://explorer.sepolia.era.zksync.dev/contract_verification',
    isCopyable: true,
  },
];
</script>
