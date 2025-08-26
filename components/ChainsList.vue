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
}

const showTestnets = ref(false);

const filteredChains = computed(() => {
  return chainsData.filter((chain: Chain) => showTestnets.value || !chain.isTestnet);
});

const mainnetChains = computed(() => chainsData.filter((chain: Chain) => !chain.isTestnet));
const testnetChains = computed(() => chainsData.filter((chain: Chain) => chain.isTestnet));
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
        <button
          :class="[
            'focus:ring-primary relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
            showTestnets ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-600',
          ]"
          type="button"
          role="switch"
          :aria-checked="showTestnets"
          aria-label="Toggle testnet visibility"
          @click="showTestnets = !showTestnets"
        >
          <span
            :class="[
              'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
              showTestnets ? 'translate-x-6' : 'translate-x-1',
            ]"
          />
        </button>
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Include testnets</span>
      </div>
    </div>

    <!-- Chain List Table -->
    <div>
      <div class="overflow-x-auto">
        <table
          class="min-w-full divide-y divide-gray-200 rounded-lg border border-gray-200 dark:divide-gray-700 dark:border-gray-700"
        >
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
              >
                Chain Name
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
              >
                Chain ID
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
              >
                Base Token
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
              >
                Data Availability
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
              >
                Links
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
            <tr
              v-for="chain in filteredChains"
              :key="chain.chainId"
              class="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <td class="whitespace-nowrap px-6 py-4">
                <div class="flex items-center">
                  <img
                    :src="chain.icon"
                    :alt="`${chain.name} logo`"
                    class="mr-3 h-6 w-6 rounded-full object-cover"
                  />
                  <div class="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {{ chain.name }}
                  </div>
                </div>
              </td>
              <td class="whitespace-nowrap px-6 py-4">
                <span
                  class="rounded bg-gray-100 px-2 py-1 font-mono text-xs text-gray-900 dark:bg-gray-700 dark:text-gray-100"
                >
                  {{ chain.chainId }}
                </span>
              </td>
              <td class="whitespace-nowrap px-6 py-4">
                <span class="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {{ chain.baseToken }}
                </span>
              </td>
              <td class="whitespace-nowrap px-6 py-4">
                <span
                  :class="{
                    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200':
                      chain.dataAvailability === 'Ethereum',
                    'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200': chain.dataAvailability === 'Avail',
                    'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200':
                      chain.dataAvailability === 'EigenLayer',
                    'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200': chain.dataAvailability === 'NoDA',
                  }"
                  class="inline-flex rounded-full px-2 py-1 text-xs font-medium"
                >
                  {{ chain.dataAvailability }}
                </span>
              </td>
              <td class="whitespace-nowrap px-6 py-4">
                <div class="flex items-center space-x-3">
                  <NuxtLink
                    :to="chain.documentationURL"
                    class="text-primary hover:text-primary-dark inline-flex items-center transition-colors"
                    :title="`View ${chain.name} Documentation`"
                  >
                    <UIcon
                      name="i-heroicons-document-text-20-solid"
                      class="h-5 w-5"
                    />
                  </NuxtLink>
                  <a
                    v-if="chain.explorerURL"
                    :href="chain.explorerURL"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-primary hover:text-primary-dark inline-flex items-center transition-colors"
                    :title="`View ${chain.name} Explorer`"
                  >
                    <UIcon
                      name="i-heroicons-magnifying-glass-20-solid"
                      class="h-5 w-5"
                    />
                  </a>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
