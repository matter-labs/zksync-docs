<script setup lang="ts">
const { data: navigation } = await useAsyncData('external-node-navigation', () => {
  const query = queryContent({
    _partial: false,
    _extension: 'md',
    where: [
      {
        _path: { $contains: 'external-node' },
      },
    ],
  });

  return fetchContentNavigation(query);
});
const navTree = (navigation.value && navigation.value[0] && navigation.value[0].children) || [];
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
