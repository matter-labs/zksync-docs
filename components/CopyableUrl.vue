<template>
  <div class="flex min-w-0 items-center gap-2">
    <span class="min-w-0 flex-1 select-all truncate font-mono text-sm text-gray-900 dark:text-gray-100">
      {{ url }}
    </span>
    <button
      class="flex-shrink-0 rounded p-1 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
      :title="copied ? 'Copied!' : 'Copy to clipboard'"
      @click="copyToClipboard"
    >
      <UIcon
        :name="copied ? 'i-heroicons-check-20-solid' : 'i-heroicons-clipboard-document-20-solid'"
        :class="
          copied ? 'text-green-500' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
        "
        class="h-4 w-4"
      />
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  url: string;
}

const props = defineProps<Props>();
const copied = ref(false);

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(props.url);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (err) {
    console.error('Failed to copy: ', err);
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = props.url;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  }
};
</script>
