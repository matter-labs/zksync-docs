<script setup lang="ts">
const { data: navigation } = await useAsyncData('navigation', () =>
  fetchContentNavigation(queryContent('external-node').only(['_path', 'title']).find())
);

const contentNavigation = (navigation.value && (navigation.value[0].children ?? [])) || [];
</script>

<template>
  <UContainer>
    <UPage>
      <template #left>
        <UAside>
          <UNavigationTree
            :links="mapContentNavigation(contentNavigation)"
            default-open
            :multiple="false"
          />
        </UAside>
      </template>
      <slot />
    </UPage>
  </UContainer>
</template>
