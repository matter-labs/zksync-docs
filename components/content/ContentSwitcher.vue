<script setup lang="ts">
defineProps<{
  items: ContentSwitcherItem[];
}>();
const selectedIndex = ref(0);

function onTabChange(index: number) {
  selectedIndex.value = index;
}
const route = useRoute();
// This splits the path into segments and takes the first one
// TODO: This is a temporary solution, we need to find a better way to get the base path
const basePath = route.path.split('/')[1];
</script>

<template>
  <div>
    <UTabs
      :items="items"
      :ui="{ list: { width: 'w-auto' } }"
      @change="onTabChange"
    />
    <div
      v-for="(item, index) in items"
      v-show="selectedIndex === index"
      :key="item.partial"
    >
      <ContentQuery
        v-slot="{ data }"
        :path="basePath"
        find="one"
        :where="{ _partial: true, _path: { $icontains: item.partial } }"
      >
        <ContentRenderer :value="data" />
      </ContentQuery>
    </div>
    <UDivider />
  </div>
</template>
