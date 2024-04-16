<script setup lang="ts">
const query = queryContent({
  _partial: false,
  where: [
    {
      _path: { $contains: '/zk-stack' },
    },
  ],
});

const { data: navigation } = await useAsyncData('zk-stack-navigation', () => fetchContentNavigation(query));
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
