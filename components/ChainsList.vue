<script setup lang="ts">
import chainsData from '~/data/chains.json';

interface Chain {
  name: string;
  chainId: number;
  icon: string; // URL to chain logo image
  isTestnet: boolean;
  documentationURL: string;
  explorerURL?: string;
  baseToken: string;
  pubdataMode: string;
  dataAvailability: string;
  onGateway?: boolean;
}

const showTestnets = ref(false);

const filteredChains = computed(() => {
  return chainsData.filter((chain: Chain) => showTestnets.value || !chain.isTestnet);
});

const mainnetChains = computed(() => chainsData.filter((chain: Chain) => !chain.isTestnet));
const testnetChains = computed(() => chainsData.filter((chain: Chain) => chain.isTestnet));

const columns = [
  {
    key: 'name',
    label: 'Chain Name',
  },
  {
    key: 'chainId',
    label: 'Chain ID',
  },
  {
    key: 'baseToken',
    label: 'Base Token',
  },
  {
    key: 'links',
    label: 'Links',
  },
  {
    key: 'onGateway',
    label: 'On Gateway',
  },
  {
    key: 'dataAvailability',
    label: 'Data Availability',
  },
];
</script>

<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
          Showing {{ filteredChains.length }} chains ({{ mainnetChains.length }} mainnet{{
            showTestnets ? `, ${testnetChains.length} testnet` : ''
          }})
        </span>
      </div>
      <div class="flex items-center space-x-3">
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Mainnets only</span>
        <UToggle v-model="showTestnets" />
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Include testnets</span>
      </div>
    </div>

    <!-- Chain List Table -->
    <div class="not-prose overflow-x-auto">
      <UTable
        :columns="columns"
        :rows="filteredChains"
        class="min-w-full divide-y divide-gray-200 rounded-lg border border-gray-200 dark:divide-gray-700 dark:border-gray-700"
        :ui="{
          table: 'w-full table-auto',
          thead: 'bg-gray-50 dark:bg-gray-800',
          trow: 'transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 whitespace-nowrap px-6 py-4',
          tbody: 'divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900',
          td: { base: 'whitespace-nowrap px-6 py-8' },
          tr: { base: 'transition-colors hover:bg-gray-50 dark:hover:bg-gray-800' },
          th: {
            base: 'px-6 py-3 text-left text-xs font-medium uppercase tracking-wider',
          },
        }"
      >
        <template #name-data="{ row }">
          <div class="flex min-w-0 items-center gap-2 truncate">
            <img
              :src="row.icon"
              :alt="`${row.name} logo`"
              class="mr-3 h-6 w-6 rounded-full object-cover"
            />
            <div class="text-sm font-medium text-gray-900 dark:text-gray-100">
              {{ row.name }}
            </div>
          </div>
        </template>

        <template #chainId-data="{ row }">
          <div class="flex items-center justify-center gap-2">
            <span
              class="rounded bg-gray-100 px-2 py-1 font-mono text-xs text-gray-900 dark:bg-gray-700 dark:text-gray-100"
            >
              {{ row.chainId }}
            </span>
          </div>
        </template>

        <template #baseToken-data="{ row }">
          <div>
            <span class="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {{ row.baseToken }}
            </span>
          </div>
        </template>

        <template #dataAvailability-data="{ row }">
          <div>
            <span
              :class="{
                'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200':
                  row.dataAvailability === 'Ethereum',
                'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200': row.dataAvailability === 'Avail',
                'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200':
                  row.dataAvailability === 'EigenLayer',
                'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200': row.dataAvailability === 'NoDA',
              }"
              class="inline-flex rounded-full px-2 py-1 text-xs font-medium"
            >
              {{ row.dataAvailability }}
            </span>
          </div>
        </template>

        <template #onGateway-data="{ row }">
          <div
            v-if="row.onGateway"
            class="flex justify-center"
          >
            <UIcon
              name="i-heroicons-check-circle-16-solid"
              class="h-5 w-5 text-green-600"
            />
          </div>
        </template>

        <template #links-data="{ row }">
          <div class="flex items-center space-x-3">
            <NuxtLink
              :to="row.documentationURL"
              class="text-primary hover:text-primary-dark inline-flex items-center transition-colors"
              :title="`View ${row.name} Documentation`"
            >
              <UIcon
                name="i-heroicons-document-text-20-solid"
                class="h-5 w-5"
              />
            </NuxtLink>
            <a
              v-if="row.explorerURL"
              :href="row.explorerURL"
              target="_blank"
              rel="noopener noreferrer"
              class="text-primary hover:text-primary-dark inline-flex items-center transition-colors"
              :title="`View ${row.name} Explorer`"
            >
              <UIcon
                name="i-heroicons-magnifying-glass-20-solid"
                class="h-5 w-5"
              />
            </a>
          </div>
        </template>
      </UTable>
    </div>
  </div>
</template>
