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
</script>

<template>
  <div>
    <HeaderComponent :links="unref(computed(() => headerLinks()))" />

    <UMain>
      <UContainer>
        <UPage>
          <div
            v-if="error.statusCode === 404"
            class="flex flex-col items-center justify-center py-16"
          >
            <h1 class="mb-4 text-4xl font-bold">Page Not Found</h1>
            <p class="mb-8 text-2xl">Looks like this page didn’t make it through the prover.</p>

            <h2 class="mb-4 text-xl">Here are some other pages you might be interested in:</h2>
            <div class="mb-8 w-full max-w-4xl space-y-6">
              <NiceCardGroup>
                <NiceCard
                  title="Quickstart"
                  icon="i-heroicons-code-bracket-solid"
                  to="/zksync-era/guides/quick-start"
                >
                  Get started building applications on ZKsync with our quickstart guide.
                </NiceCard>
                <NiceCard
                  title="ZKsync Stack"
                  icon="i-heroicons-server-solid"
                  to="/zk-stack/running/quickstart"
                >
                  Learn how to run your own ZKsync chain with our operator quickstart guide.
                </NiceCard>
              </NiceCardGroup>

              <NiceCardGroup>
                <NiceCard
                  title="ZKsync Airbender"
                  icon="i-heroicons-rocket-launch-solid"
                  to="/zksync-protocol/zksync-airbender/overview"
                >
                  Explore the fastest RISC-V prover powering the next-generation of ZKsync chains.
                </NiceCard>
                <NiceCard
                  title="Community Tutorials"
                  icon="i-heroicons-academic-cap-solid"
                  to="https://code.zksync.io/"
                >
                  Discover community-driven guides and tutorials for building on ZKsync.
                </NiceCard>
              </NiceCardGroup>
            </div>

            <NuxtLink
              to="/"
              class="rounded-md border border-gray-300 px-6 py-2 transition-colors hover:bg-gray-100"
            >
              Return to Home
            </NuxtLink>
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
