<script setup lang="ts">
interface Props {
  title: string;
  icon?: string;
  to?: string;
}

defineProps<Props>();
</script>

<template>
  <div
    class="group relative overflow-hidden rounded-lg border bg-white p-6 transition-all duration-200 hover:border-gray-300 hover:shadow-lg"
  >
    <NuxtLink
      v-if="to"
      :to="to"
      class="absolute inset-0 z-10"
      :aria-label="title"
    />

    <div class="flex items-start space-x-4">
      <div
        v-if="icon"
        class="flex-shrink-0"
      >
        <UIcon
          :name="icon"
          class="text-primary h-8 w-8"
        />
      </div>

      <div class="min-w-0 flex-1">
        <h3 class="group-hover:text-primary text-lg font-semibold text-gray-900 transition-colors">
          {{ title }}
        </h3>
        <div class="mt-2 text-sm text-gray-600">
          <slot />
        </div>
      </div>

      <div
        v-if="to"
        class="flex-shrink-0"
      >
        <UIcon
          name="i-heroicons-arrow-right-20-solid"
          class="group-hover:text-primary h-5 w-5 text-gray-400 transition-colors"
        />
      </div>
    </div>
  </div>
</template>
