<script setup lang="ts">
import type { NavItem } from '@nuxt/content/types';
import { withoutTrailingSlash } from 'ufo';

const route = useRoute();
const { seo } = useAppConfig();
const navigation = inject<Ref<NavItem[]>>('navigation', ref([]));
const { data: page } = await useAsyncData(route.path, () => queryContent(route.path).findOne());

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true });
}

const { data: surround }: any = await useAsyncData(`${route.path}-surround`, () =>
  queryContent()
    .where({
      _partial: false,
      _extension: 'md',
      navigation: { $ne: false },
    })
    .only(['title', 'description', '_path'])
    .findSurround(withoutTrailingSlash(route.path))
);

useSeoMeta({
  title: page.value.title,
  ogTitle: `${page.value.title} - ${seo?.siteName}`,
  description: page.value.description,
  ogDescription: page.value.description,
});

defineOgImage({
  component: 'Docs',
});

const breadcrumb = computed(() =>
  mapContentNavigation(findPageBreadcrumb(navigation!.value, page.value)).map(({ label }) => ({ label }))
);
</script>

<template>
  <UPage v-if="page">
    <UPageHeader
      :title="page.title"
      :description="page.description"
      :links="page.links"
    >
      <template #headline>
        <UBreadcrumb :links="breadcrumb" />
      </template>
    </UPageHeader>

    <UPageBody prose>
      <ContentRenderer
        v-if="page.body"
        :value="page"
      />

      <hr v-if="surround?.length" />

      <UContentSurround :surround="surround" />
    </UPageBody>

    <template
      v-if="page.toc !== false"
      #right
    >
      <LayoutToc :page />
    </template>
  </UPage>
</template>
