<script setup lang="ts">
const { data: navigation } = await useAsyncData('navigation', () =>
  fetchContentNavigation(
    queryContent('/zk-stack')
      // .where({ _path: { $contains: '/zk-stack' } })
      .only(['_path', 'title'])
      .findOne()
  )
);
console.log('NAVIGATION', navigation.value);

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
