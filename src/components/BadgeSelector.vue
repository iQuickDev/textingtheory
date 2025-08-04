<script setup lang="ts">

import { ref, defineEmits, watch, defineProps } from 'vue';
import { getOrderedBadges, type Badge } from '../types/Badge';

const orderedBadges = getOrderedBadges();

const emit = defineEmits(['select']);

const props = defineProps<{ selectedBadge?: Badge | null }>();

const selected = ref<Badge | null>(null);
watch(() => props.selectedBadge, (newVal) => {
  selected.value = newVal ?? null;
});

function selectBadge(badge: Badge) {
  selected.value = badge;
  emit('select', badge);
}
</script>

<template>
  <div class="flex flex-row space-x-2 md:grid md:grid-cols-3 md:space-x-0 md:gap-2 md:overflow-x-visible">
    <div
      v-for="badge in orderedBadges"
      :key="badge.key"
      @click="selectBadge(badge)"
      class="cursor-pointer border-2 border-transparent rounded-lg p-2 flex flex-col items-center justify-center text-center transition-colors duration-200 select-none min-w-[96px] min-h-[120px] md:min-w-0"
      :class="props.selectedBadge && props.selectedBadge.key === badge.key ? 'bg-blue-500' : ''"
    >
      <img :src="badge.image" :alt="badge.name" class="w-14 h-14 object-contain mb-3" />
      <span class="block text-sm">{{ badge.name }}</span>
    </div>
  </div>
</template>