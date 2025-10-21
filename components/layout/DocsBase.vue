<script setup lang="ts">
import type { NavItem } from '@nuxt/content/types';
import { withoutTrailingSlash } from 'ufo';

const route = useRoute();
const category = useCategory();
const navigation = inject<Ref<NavItem[]>>('navigation', ref([]));
const { data: page } = await useAsyncData(route.path, async () => await queryContent(route.path).findOne());

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true });
}

const { data: surround } = await useAsyncData(
  `${route.path}-surround`,
  async () =>
    await queryContent()
      .where({
        _partial: false,
        _extension: 'md',
        navigation: { $ne: false },
      })
      .only(['title', 'description', '_path'])
      .findSurround(withoutTrailingSlash(route.path))
);

const { seo } = useAppConfig();
useSeoMeta({
  title: page.value.title,
  ogTitle: `${page.value.title} - ${seo?.siteName}`,
  description: page.value.description,
  ogDescription: page.value.description,
  twitterDescription: page.value.description,
});

defineOgImage({
  component: 'OgImageZK',
  title: page.value.title,
  description: page.value.description,
});

const breadcrumb = computed(() => {
  const crumbs = mapContentNavigation(findPageBreadcrumb(navigation!.value, page.value)).map(({ label, to }) => ({
    label,
    to,
  }));
  // removes the link to the current page, unnecessary
  delete crumbs[crumbs.length - 1].to;

  return crumbs;
});
</script>

<template>
  <UPage v-if="page">
    <article>
      <span
        id="docsearch-lv0"
        hidden
        >{{ category }}</span
      >
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
    </article>
    <template
      v-if="page.toc !== false"
      #right
    >
      <LayoutToc :page />
    </template>
  </UPage>
</template>
