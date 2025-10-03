<script setup lang="ts">
const { data: page } = await useAsyncData('index', () => queryContent('/').findOne());

const { seo } = useAppConfig();

useSeoMeta({
  titleTemplate: '',
  title: page.value?.title,
  ogTitle: page.value?.title,
  description: page.value?.description,
  ogDescription: page.value?.description,
});

defineOgImage({
  component: 'OgImageZK',
  props: {
    title: seo?.siteName,
    description: 'Access detailed guides, references and resources that will help you build with ZKsync Era.',
  },
});
</script>

<template>
  <div v-if="page">
    <IconOrbit class="mb-8 hidden md:block" />

    <ULandingHero
      v-if="page.hero"
      v-bind="page.hero"
      class="hero-compact"
    >
      <ClientOnly>
        <vue-particles
          id="tsparticles"
          url="particles.json"
          style="z-index: -10"
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
      :title="page.stackfeatures.title"
      :links="page.stackfeatures.links"
      class="py-16 pb-32 sm:py-12 sm:pb-24"
    >
      <UPageGrid>
        <ULandingCard
          v-for="(item, index) of page.stackfeatures.items"
          :key="index"
          v-bind="item"
        />
      </UPageGrid>
    </ULandingSection>

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

<style scoped>
.hero-compact {
  padding-top: 1rem !important;
  padding-bottom: 1rem !important;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
}

/* Override ULandingHero internal spacing */
.hero-compact :deep(.container) {
  padding-top: 1rem !important;
  padding-bottom: 1rem !important;
}

/* Reduce spacing around hero content */
.hero-compact :deep(.text-center) {
  margin-top: 0 !important;
  margin-bottom: 1rem !important;
}

/* Reduce button spacing */
.hero-compact :deep(.mt-8) {
  margin-top: 1rem !important;
}

.hero-compact :deep(.mt-6) {
  margin-top: 0.75rem !important;
}

/* Enhanced button styling */
.hero-compact :deep(.btn-primary) {
  transition: all 0.3s ease;
}

.hero-compact :deep(.btn-outline) {
  border: 2px solid rgb(59, 130, 246);
  color: rgb(59, 130, 246);
  background: transparent;
  transition: all 0.3s ease;
}

.hero-compact :deep(.btn-outline:hover) {
  background: rgb(59, 130, 246);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
}

.hero-compact :deep(.btn-primary:hover) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
}
</style>
