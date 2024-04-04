<template>
  <a
    :href="href"
    :target="target"
    :rel="rel"
    class="inline"
  >
    {{ text }}
    <UIcon
      name="i-heroicons-arrow-top-right-on-square-16-solid"
      class="-mb-0.5"
    />
  </a>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

export interface Props {
  text: string;
  href: string;
  target?: string;
  rel?: string;
}

withDefaults(defineProps<Props>(), {
  text: '',
  href: '',
  target: '_blank',
  rel: 'noopener noreferrer',
});
</script>
