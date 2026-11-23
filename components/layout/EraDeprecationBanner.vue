<script setup lang="ts">
import { withoutTrailingSlash } from 'ufo';

// The banner shows on every page of the ZKsync Era and EraVM sections,
// including pages added to them later, and nowhere else.
const eraSections = ['/zksync-network/zksync-era', '/zksync-protocol/era-vm'];

const route = useRoute();
const visible = computed(() => {
  const path = withoutTrailingSlash(route.path);
  return eraSections.some((section) => path === section || path.startsWith(`${section}/`));
});
</script>

<template>
  <UAlert
    v-if="visible"
    class="mt-8"
    icon="i-heroicons-exclamation-triangle"
    color="amber"
    variant="subtle"
    title="The ZKsync Era documentation is deprecated"
  >
    <template #description>
      The ZKsync Era and EraVM documentation is no longer maintained. New ZKsync chains, including Prividium chains, run
      on ZKsync OS instead of EraVM. For more information, see the
      <NuxtLink
        to="https://www.zksync.io/blog/eravm-security-update"
        class="font-semibold underline"
        >EraVM security update</NuxtLink
      >. For current documentation, see
      <NuxtLink
        to="/zksync-network/zksync-os"
        class="font-semibold underline"
        >ZKsync OS</NuxtLink
      >
      and the
      <NuxtLink
        to="https://docs.prividium.zksync.io/"
        class="font-semibold underline"
        >Prividium documentation</NuxtLink
      >.
    </template>
  </UAlert>
</template>
