<script setup lang="ts">
import { ref } from 'vue';
import { type Badge } from './types/Badge';
import ImagePreview from './components/ImagePreview.vue';
import BadgeSelector from './components/BadgeSelector.vue';
import Navbar from './components/Navbar.vue';

const selectedBadge = ref<Badge | null>(null);
const imageUrl = ref<string | null>(null);
const imageFile = ref<File | null>(null);

// Reference to ImagePreview for calling resetBadges
const imagePreviewRef = ref();

function handleSelectImage(file: File) {
  imageFile.value = file;
  imageUrl.value = URL.createObjectURL(file);
}

function handleBadgeSelect(badge: Badge) {
  selectedBadge.value = badge;
}

function handleResetBadges() {
  imagePreviewRef.value?.resetBadges();
}

function handleExportImage() {
  imagePreviewRef.value?.exportImage();
}
</script>

<template>
  <div class="min-h-[95vh] w-full bg-gray-900 text-gray-100 flex flex-col overflow-hidden">
    <Navbar @select-image="handleSelectImage" @reset-badges="handleResetBadges" @export-image="handleExportImage" />
    <div class="flex-1 flex flex-col md:flex-row overflow-hidden">
      <div class="flex-1 flex items-center justify-center overflow-hidden">
        <ImagePreview ref="imagePreviewRef" :selected-badge="selectedBadge" :image-url="imageUrl" @update:selectedBadge="selectedBadge = $event" />
      </div>
      <!-- BadgeSelector as sidebar on md+ screens, hidden on small screens -->
      <div class="hidden md:block md:w-96 bg-gray-800 border-l border-gray-700 p-4 overflow-y-auto mt-16 max-h-[95vh]">
        <BadgeSelector @select="handleBadgeSelect" :selected-badge="selectedBadge ?? undefined" />
      </div>
    </div>
    <!-- BadgeSelector as bottom bar on small screens, hidden on md+ -->
    <div class="block md:hidden w-full bg-gray-800 border-t border-gray-700 p-2 overflow-x-auto">
      <BadgeSelector @select="handleBadgeSelect" :selected-badge="selectedBadge ?? undefined" />
    </div>
  </div>
</template>

<style scoped></style>
