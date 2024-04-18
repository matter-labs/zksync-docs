<script setup lang="ts">
import type { NavItem } from '@nuxt/content/dist/runtime/types';
import type { Link } from '@nuxt/ui-pro/types';

defineProps<{
  links: Link[];
}>();

const navigation = inject<NavItem[]>('navigation', []);

const { header } = useAppConfig();
</script>

<template>
  <UHeader :links>
    <template #logo>
      <template v-if="header?.logo?.dark || header?.logo?.light">
        <UColorModeImage v-bind="{ class: 'h-6 w-auto', ...header?.logo }" />
      </template>
      <template v-else>
        Nuxt UI Pro
        <UBadge
          label="Docs"
          variant="subtle"
          class="mb-0.5"
        />
      </template>
    </template>

    <template #right>
      <UContentSearchButton
        v-if="header?.search"
        :label="undefined"
        class="lg:hidden"
      />

      <UColorModeButton v-if="header?.colorMode" />

      <template v-if="header?.links">
        <UButton
          v-for="(link, index) of header.links"
          :key="index"
          v-bind="{ color: 'gray', variant: 'ghost', ...link }"
        />
      </template>

      <UContentSearchButton class="hidden max-w-[180px] lg:flex" />
    </template>

    <template #panel>
      <UNavigationTree :links="mapContentNavigation(navigation)" />
    </template>
  </UHeader>
</template>
