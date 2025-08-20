<script setup lang="ts">
import type { NuxtError } from '#app';
import { headerLinks } from './header-links';

useSeoMeta({
  title: 'Page not found',
  description: 'We are sorry but this page could not be found.',
});

defineProps({
  error: {
    type: Object as PropType<NuxtError>,
    required: true,
  },
});

useHead({
  htmlAttrs: {
    lang: 'en',
  },
});

const { data: navigation } = await useAsyncData('navigation', () => fetchContentNavigation());

provide('navigation', navigation);

const cards = [
  {
    title: 'Build Apps',
    description: 'Explore the ZKsync Network documentation.',
    to: '/zksync-era',
    icon: 'i-heroicons-rocket-launch-solid',
  },
  {
    title: 'Build Chains',
    description: 'Browse the documentation for ZKsync Stack.',
    to: '/zk-stack',
    icon: 'i-heroicons-square-3-stack-3d-16-solid',
  },
  {
    title: 'Learn About the Protocol',
    description: 'Learn about the ZKsync protocol in-depth.',
    to: '/zksync-protocol',
    icon: 'i-heroicons-book-open-solid',
  },
  {
    title: 'Step-by-step Tutorials',
    description: 'Follow along with step-by-step tutorials made by the ZKsync community.',
    to: 'https://code.zksync.io/',
    icon: 'i-heroicons-beaker-solid',
  },
];
</script>

<template>
  <div>
    <HeaderComponent :links="unref(computed(() => headerLinks()))" />

    <UMain>
      <UContainer>
        <UPage>
          <div
            v-if="error.statusCode == 404"
            class="flex min-h-screen items-center"
          >
            <UContainer>
              <div class="space-y-3 text-center">
                <UBadge
                  color="gray"
                  variant="subtle"
                  >{{ error.statusCode }} • Page not found</UBadge
                >
                <h1 class="text-4xl font-bold tracking-tight sm:text-5xl">Lost in the docs?</h1>
                <p class="text-gray-500">
                  We couldn’t find the page you were looking for. Try one of these helpful links.
                </p>
              </div>

              <UPageGrid class="mt-8 lg:!grid-cols-2 xl:!grid-cols-2 2xl:!grid-cols-2">
                <ULandingCard
                  v-for="(c, i) in cards"
                  :key="i"
                  v-bind="c"
                >
                  <template #icon>
                    <UIcon
                      :name="c.icon"
                      class="text-primary h-6 w-6"
                    />
                  </template>
                </ULandingCard>
              </UPageGrid>
            </UContainer>
          </div>
          <UPageError
            v-else
            :error="error"
          />
        </UPage>
      </UContainer>
    </UMain>

    <FooterComponent />

    <UNotifications />
  </div>
</template>
