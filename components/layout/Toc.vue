<script setup lang="ts">
import type { ParsedContent } from '@nuxt/content/types';

const { toc } = useAppConfig();

const props = defineProps<{
  page: ParsedContent;
}>();

const links = computed(() =>
  [
    {
      icon: 'i-heroicons-pencil-square',
      label: 'Edit this page',
      to: `https://github.com/matter-labs/zksync-docs/edit/staging/content/${props.page?._file}`,
      target: '_blank',
    },
    {
      icon: 'i-heroicons-chat-bubble-oval-left-ellipsis',
      label: 'Share feedback',
      to: `https://github.com/matter-labs/zksync-docs/issues/new?labels=feedback%2Ctriage&projects=&template=feedback.yml&title=%5BFeedback%5D%3A+&page=https://docs.zksync.io${props.page?._path}`,
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
