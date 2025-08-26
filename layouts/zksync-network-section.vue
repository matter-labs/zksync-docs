<script setup lang="ts">
import type { NavItem } from '@nuxt/content/types';

const navigation = inject<Ref<NavItem[]>>('navigation', ref([]));
const navTree = computed(() => navigation!.value.find((nav) => nav._path === '/zksync-network')?.children || []);
</script>

<template>
  <UContainer>
    <UPage>
      <template #left>
        <UAside>
          <UNavigationTree
            :links="mapContentNavigation(navTree)"
            default-open
            :multiple="false"
          />
        </UAside>
      </template>
      <slot />
    </UPage>
  </UContainer>
</template>
