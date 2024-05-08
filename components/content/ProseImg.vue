<template>
  <vue-easy-lightbox
    :visible="isVisible"
    :imgs="refinedSrc"
    :rotate-disabled="true"
    @hide="onHide"
  />

  <component
    :is="imgComponent"
    class="cursor-pointer dark:bg-white"
    :src="refinedSrc"
    :alt="alt"
    :width="width"
    :height="height"
    loading="lazy"
    @click="isVisible = true"
  />
</template>

<script setup lang="ts">
/**
 * This is a temporary component until the Nuxt Content release includes these changes
 */
import { withTrailingSlash, withLeadingSlash, joinURL } from 'ufo';
import { useRuntimeConfig, computed, resolveComponent } from '#imports';
import VueEasyLightbox from 'vue-easy-lightbox';

const imgComponent = useRuntimeConfig().public.mdc.useNuxtImage ? resolveComponent('NuxtImg') : 'img';

const props = defineProps({
  src: {
    type: String,
    default: '',
  },
  alt: {
    type: String,
    default: '',
  },
  width: {
    type: [String, Number],
    default: undefined,
  },
  height: {
    type: [String, Number],
    default: undefined,
  },
});

const refinedSrc = computed(() => {
  if (props.src?.startsWith('/') && !props.src.startsWith('//')) {
    const _base = withLeadingSlash(withTrailingSlash(useRuntimeConfig().app.baseURL));
    if (_base !== '/' && !props.src.startsWith(_base)) {
      return joinURL(_base, props.src);
    }
  }
  return props.src;
});

const isVisible = ref(false);
const onHide = () => (isVisible.value = false);
</script>
