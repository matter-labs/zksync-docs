<script setup lang="ts">
const { data: page } = await useAsyncData('index', () => queryContent('/').findOne());

useSeoMeta({
  titleTemplate: '',
  title: page.value?.title,
  ogTitle: page.value?.title,
  description: page.value?.description,
  ogDescription: page.value?.description,
});

const particlesLoaded = async (container: unknown) => {
  console.log('Particles container loaded', container);
};
</script>

<template>
  <div v-if="page">
    <div>
      <vue-particles
        id="tsparticles"
        :options="{
          fpsLimit: 120,
          interactivity: {
            events: {
              onClick: {
                enable: true,
                mode: 'push',
              },
              onHover: {
                enable: true,
                mode: 'repulse',
              },
            },
            modes: {
              bubble: {
                distance: 400,
                duration: 2,
                opacity: 0.8,
                size: 40,
              },
              push: {
                quantity: 4,
              },
              repulse: {
                distance: 50,
                duration: 0.4,
              },
            },
          },
          particles: {
            color: {
              value: '#8b8ccf',
            },
            links: {
              color: '#8b8ccf',
              distance: 150,
              enable: true,
              opacity: 0.5,
              width: 1,
            },
            move: {
              direction: 'none',
              enable: true,
              outModes: 'bounce',
              random: false,
              speed: 0.5,
              straight: false,
            },
            number: {
              density: {
                enable: true,
              },
              value: 80,
            },
            opacity: {
              value: 0.5,
            },
            shape: {
              type: 'circle',
            },
            size: {
              value: { min: 1, max: 5 },
            },
          },
          detectRetina: true,
        }"
        @particles-loaded="particlesLoaded"
      />
      <ULandingHero
        v-if="page.hero"
        v-bind="page.hero"
      >
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
    </div>

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
