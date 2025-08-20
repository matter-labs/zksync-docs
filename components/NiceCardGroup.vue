<script setup lang="ts">
interface Props {
  cols?: 1 | 2 | 3 | 4;
}

const props = withDefaults(defineProps<Props>(), {
  cols: 2,
});

const gridClass = computed(() => {
  const colsMap = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };
  return `grid gap-6 ${colsMap[props.cols]}`;
});
</script>

<template>
  <div :class="gridClass">
    <slot />
  </div>
</template>
