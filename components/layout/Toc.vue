<script setup lang="ts">
import type { ParsedContent } from '@nuxt/content/types';
import { useRoute } from 'vue-router';

const { toc } = useAppConfig();

const props = defineProps<{
  page: ParsedContent;
}>();

// calculate the current full URL to use in links below
const route = useRoute();
const currentUrl = computed(() => {
  if (import.meta.client) {
    return `${window.location.origin}${route.fullPath}`;
  }
  // Fallback for SSR/CI: just use the path
  return route.fullPath;
});

const links = computed(() =>
  [
    {
      icon: 'i-heroicons-pencil-square',
      label: 'Edit this page',
      to: `https://github.com/matter-labs/zksync-docs/edit/main/content/${props.page?._file}`,
      target: '_blank',
    },
    {
      icon: 'i-heroicons-envelope',
      label: 'Share feedback',
      to: `https://github.com/matter-labs/zksync-docs/issues/new?labels=feedback%2Ctriage&projects=&template=feedback.yml&title=%5BFeedback%5D%3A+&page=https://docs.zksync.io${props.page?._path}`,
      target: '_blank',
    },
    {
      icon: 'i-heroicons-chat-bubble-left-right',
      label: 'Open in ChatGPT',
      to: `https://chatgpt.com/?q=Read%20${currentUrl.value}%20and%20all%20its%20subpages%20and%20answer%20questions%20about%20the%20content.`,
      target: '_blank',
    },
    {
      icon: 'i-heroicons-chat-bubble-bottom-center-text',
      label: 'Open in Claude',
      to: `https://claude.ai/new?q=Read%20${currentUrl.value}%20and%20all%20its%20subpages%20and%20answer%20questions%20about%20the%20content.`,
      target: '_blank',
    },
    ...(toc?.bottom?.links || []),
  ].filter(Boolean)
);
</script>

<template>
  <UContentToc
    :title="toc?.title"
    :links="page.body?.toc?.links"
  >
    <template
      v-if="toc?.bottom"
      #bottom
    >
      <div
        class="hidden space-y-6 lg:block"
        :class="{ '!mt-6': page.body?.toc?.links?.length }"
      >
        <UDivider
          v-if="page.body?.toc?.links?.length"
          type="dashed"
        />

        <UPageLinks
          :title="toc.bottom.title"
          :links="links"
        />
      </div>
    </template>
  </UContentToc>
</template>
