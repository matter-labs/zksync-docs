<script setup lang="ts">
import type { ParsedContent } from '@nuxt/content/dist/runtime/types';

provideHeadlessUseId(() => useId());

const { seo } = useAppConfig();
const route = useRoute();

const { data: navigation } = await useAsyncData('navigation', () => fetchContentNavigation());
const { data: files } = useLazyFetch<ParsedContent[]>('/api/search.json', {
  default: () => [],
  server: false,
});

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    {
      name: 'keywords',
      content:
        'Documentation, Developers, Era, ZKsync, ZK Stack, Matter Labs, rollup, ZK rollup, zero confirmation, ZKP, zero-knowledge proofs, Ethereum, crypto, blockchain, permissionless, L2, secure payments, scalable',
    },
    {
      name: 'description',
      content:
        'ZKsync Docs bring you all information you need about our protocol, APIs, SDKs, ZK Stack, and hyperchains. Start with our guides and tutorials, or go deep into our architecture and protocol specification.',
    },
    { name: 'author', content: 'https://matter-labs.io' },
  ],
  link: [{ rel: 'icon', href: '/favicon.ico' }],
  htmlAttrs: {
    lang: 'en',
  },
});

useSeoMeta({
  titleTemplate: `%s - ${seo?.siteName}`,
  ogSiteName: seo?.siteName,
  ogUrl: 'https://docs.zksync.io/',
  ogImage: 'https://docs.zksync.io/social-card.png',
  ogImageAlt: 'ZKsync — Accelerating the mass adoption of crypto for personal sovereignty.',
  ogDescription:
    'ZKsync Docs bring you all information you need about our protocol, APIs, SDKs, ZK Stack, and hyperchains. Start with our guides and tutorials, or go deep into our architecture and protocol specification.',
  twitterImage: 'https://docs.zksync.io/social-card.png',
  twitterCard: 'summary_large_image',
  twitterSite: '@zksync',
  twitterCreator: '@the_matter_labs',
  twitterImageAlt: 'ZKsync — Accelerating the mass adoption of crypto for personal sovereignty.',
});

provide('navigation', navigation);

const links = computed(() => {
  return [
    {
      label: 'Build',
      to: '/build',
      active: route.path.startsWith('/build'),
    },
    {
      label: 'ZK Stack',
      to: '/zk-stack',
      active: route.path.startsWith('/zk-stack'),
    },
    {
      label: 'External Node',
      to: '/external-node',
      active: route.path.startsWith('/external-node'),
    },
    {
      label: 'Ecosystem',
      to: '/ecosystem',
      active: route.path.startsWith('/ecosystem'),
    },
    {
      label: 'Cookbook',
      to: 'https://community-cookbook-staging.web.app/',
    },
  ];
});
</script>

<template>
  <div>
    <NuxtLoadingIndicator />

    <HeaderComponent :links />

    <UMain>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </UMain>

    <FooterComponent />

    <ClientOnly>
      <LazyUContentSearch
        :files="files"
        :navigation="navigation || []"
      />
    </ClientOnly>

    <UNotifications />
  </div>
</template>
