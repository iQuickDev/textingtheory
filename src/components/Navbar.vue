<script setup lang="ts">
import { ref } from 'vue';
const emit = defineEmits(['select-image', 'reset-badges', 'export-image']);
// No props needed for imageUrl
const fileInput = ref<HTMLInputElement | null>(null);
function openFileDialog()
{
  fileInput.value?.click();
}
function onFileChange(event: Event)
{
  const files = (event.target as HTMLInputElement).files;
  if (files && files[0])
  {
    emit('select-image', files[0]);
  }
}
</script>

<template>
  <div
    class="w-full flex flex-row flex-wrap gap-2 items-center mb-4 md:mb-0 md:absolute md:top-0 md:left-0 bg-gray-800/80 md:backdrop-blur-sm md:p-4 md:rounded-t md:shadow p-2">
    <div class="flex-1 flex items-center hidden sm:block">
      <h1 class="font-bold text-3xl">Texting Theory Image Editor</h1>
    </div>
    <div class="flex gap-2 items-center justify-center">
      <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onFileChange" />
      <button @click="openFileDialog"
        class="p-2 bg-gray-700 text-gray-100 rounded shadow hover:bg-gray-600 transition-colors">
        Select Image
      </button>
      <button @click="$emit('reset-badges')"
        class="p-2 bg-yellow-500 text-white rounded shadow hover:bg-yellow-600 transition-colors">
        Reset Badges
      </button>
      <button @click="$emit('export-image')"
        class="p-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition-colors">
        Export Image
      </button>
    </div>
  </div>
</template>
