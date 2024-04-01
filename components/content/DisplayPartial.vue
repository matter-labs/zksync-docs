<script setup lang="ts">
defineProps<{
  partial: string;
}>();
</script>

<template>
  <ContentQuery
    v-slot="{ data }"
    path="_partials"
    find="one"
    :where="{ _partial: true, title: { $icontains: partial } }"
  >
    <ContentRenderer :value="data" />
  </ContentQuery>
</template>
