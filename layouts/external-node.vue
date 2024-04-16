<script setup lang="ts">
const query = queryContent({
  _partial: false,
  where: [
    {
      _path: { $contains: '/external-node' },
    },
  ],
});

const { data: navigation } = await useAsyncData('external-node-navigation', () => fetchContentNavigation(query));
</script>

<template>
  <UContainer>
    <UPage>
      <template #left>
        <UAside>
          <UNavigationTree
            :links="mapContentNavigation(navigation || [])"
            default-open
            :multiple="false"
          />
        </UAside>
      </template>
      <slot />
    </UPage>
  </UContainer>
</template>
