<script setup lang="ts">
const props = defineProps<{
  labels: string[];
  icon: string;
  title: string;
}>();
</script>

<template>
  <UPageLinks
    :links="
      props.labels.map((label) => ({
        icon: props.icon,
        label,
      }))
    "
    :title="props.title"
  />
</template>
