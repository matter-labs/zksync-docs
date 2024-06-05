<script setup lang="ts">
const { data: page } = await useAsyncData('index', () => queryContent('/').findOne());

useSeoMeta({
  titleTemplate: '',
  title: page.value?.title,
  ogTitle: page.value?.title,
  description: page.value?.description,
  ogDescription: page.value?.description,
});
</script>

<template>
  <div v-if="page">
    <ULandingHero
      v-if="page.hero"
      v-bind="page.hero"
    >
      <ClientOnly>
        <vue-particles
          id="tsparticles"
          url="particles.json"
        />
      </ClientOnly>
      <template #headline>
        <UBadge
          v-if="page.hero.headline"
          variant="subtle"
          size="lg"
          class="relative rounded-full font-semibold"
        >
          <NuxtLink
            :to="page.hero.headline.to"
            target="_blank"
            class="focus:outline-none"
            tabindex="-1"
          >
            <span
              class="absolute inset-0"
              aria-hidden="true"
            />
          </NuxtLink>

          {{ page.hero.headline.label }}

          <UIcon
            v-if="page.hero.headline.icon"
            :name="page.hero.headline.icon"
            class="pointer-events-none ml-1 h-4 w-4"
          />
        </UBadge>
      </template>

      <template #title>
        <MDC :value="page.hero.title" />
      </template>
    </ULandingHero>

    <ULandingSection
      :title="page.features.title"
      :links="page.features.links"
      class="py-16 sm:py-12"
    >
      <UPageGrid>
        <ULandingCard
          v-for="(item, index) of page.features.items"
          :key="index"
          v-bind="item"
        />
      </UPageGrid>
    </ULandingSection>

    <ULandingSection
      :title="page.community.title"
      :links="page.community.links"
      class="py-16 pb-32 sm:py-12 sm:pb-24"
    >
      <UPageGrid>
        <ULandingCard
          v-for="(item, index) of page.community.items"
          :key="index"
          v-bind="item"
        />
      </UPageGrid>
    </ULandingSection>
  </div>
</template>
