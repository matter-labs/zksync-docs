<script setup lang="ts">
import type { ParsedContent } from '@nuxt/content/dist/runtime/types';

const { seo } = useAppConfig();

const { data: navigation } = await useAsyncData('navigation', () => fetchContentNavigation());
provide('navigation', navigation);

const { data: files } = useLazyFetch<ParsedContent[]>('/api/search.json', {
  default: () => [],
  server: false,
});

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'theme-color', content: '#F2F2F2' },
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico', sizes: '48x48' },
    { rel: 'icon', href: '/zksync-icon_150.svg', sizes: 'any', type: 'image/svg+xml' },
    { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
  ],
  script: [
    {
      children: `
      (function() {
        // Cookbook Onboard (AI Assistant). API key is public so it's fine to just hardcode it here.
        var COOKBOOK_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NWNlNzUwZmZiMDBlZWUyNThjNmUxMjkiLCJpYXQiOjE3MDgwMjkxOTksImV4cCI6MjAyMzYwNTE5OX0.vrpJUZNG2jBFegOyENxgLJfStfyP7R1sQYE_I4XNo40";

        document.addEventListener('DOMContentLoaded', function() {
          var element = document.getElementById('__cookbook');
          if (!element) {
            element = document.createElement('div');
            element.id = '__cookbook';
            element.dataset.apiKey = COOKBOOK_API_KEY;
            document.body.appendChild(element);
          }

          var script = document.getElementById('__cookbook-script');
          if (!script) {
            script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@cookbookdev/docsbot/dist/standalone/index.cjs.js';
            script.id = '__cookbook-script';
            script.defer = true;
            document.body.appendChild(script);
          }
        });
      })();
  `,
      key: 'a',
    },
  ],
  htmlAttrs: {
    lang: 'en',
  },
});

useSeoMeta({
  titleTemplate: `%s - ${seo?.siteName}`,
  ogSiteName: seo?.siteName,
  ogUrl: 'https://docs.zksync.io',
  ogImageAlt: 'Hyperscaling Ethereum with ZK tech.',
  ogDescription:
    'ZKsync Docs bring you all information you need about our protocol, APIs, SDKs, ZK Stack, and ZK chains. Start with our guides and tutorials, or go deep into our architecture and protocol specification.',
  description:
    'ZKsync Docs bring you all information you need about our protocol, APIs, SDKs, ZK Stack, and ZK chains. Start with our guides and tutorials, or go deep into our architecture and protocol specification.',
  twitterDescription:
    'ZKsync Docs bring you all information you need about our protocol, APIs, SDKs, ZK Stack, and ZK chains. Start with our guides and tutorials, or go deep into our architecture and protocol specification.',
  twitterTitle: `%s`,
  twitterCard: 'summary_large_image',
  twitterSite: '@zksync',
  twitterCreator: '@zkSyncDevs',
  twitterImageAlt: 'Hyperscaling Ethereum with ZK tech.',
});
</script>

<template>
  <div>
    <NuxtPwaManifest />
    <NuxtLoadingIndicator />

    <HeaderComponent :search="true" />

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
