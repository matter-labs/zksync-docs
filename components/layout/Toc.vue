<script setup lang="ts">
import type { ParsedContent } from '@nuxt/content/types';

const { toc } = useAppConfig();

const props = defineProps<{
  page: ParsedContent;
}>();

const links = computed(() =>
  [
    toc?.bottom?.edit && {
      icon: 'i-heroicons-pencil-square',
      label: 'Edit this page',
      to: `${toc.bottom.edit}/${props.page?.value?._file}`,
      target: '_blank',
    },
    toc?.bottom?.feedback && {
      icon: 'i-heroicons-chat-bubble-oval-left-ellipsis',
      label: 'Share feedback',
      to: `${toc.bottom.feedback}&title=Feedback for ${props.page?.value?.title}&body=Page: ${props.page?.value?._path}`,
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
