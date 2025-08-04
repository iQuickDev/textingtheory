<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { type Badge } from '../types/Badge';
import { onBeforeUnmount } from 'vue';

// Accept selectedBadge and imageUrl as props from parent
const props = defineProps<{ selectedBadge: Badge | null, imageUrl: string | null }>();

// Use the imageUrl prop for display
const imageUrl = ref<string | null>(props.imageUrl);

// Watch for prop changes
watch(() => props.imageUrl, (newVal) => {
  imageUrl.value = newVal;
});

// Multiple badge overlays
type BadgeOverlay = {
    id: number;
    badge: Badge;
    x: number;
    y: number;
    width: number;
    height: number;
    aspectRatio: number;
    dragging: boolean;
    resizing: boolean;
    offsetX: number;
    offsetY: number;
};

const overlays = ref<BadgeOverlay[]>([]);
const activeOverlayId = ref<number | null>(null);


// Dragging logic for overlays
function startDrag(e: MouseEvent, overlay: BadgeOverlay)
{
    overlay.dragging = true;
    overlay.offsetX = e.offsetX;
    overlay.offsetY = e.offsetY;
    activeOverlayId.value = overlay.id;
    window.addEventListener('mousemove', onDrag);
    window.addEventListener('mouseup', stopDrag);
}
function onDrag(e: MouseEvent)
{
    const overlay = overlays.value.find(o => o.id === activeOverlayId.value);
    if (!overlay || !overlay.dragging) return;
    const container = document.getElementById('image-container');
    if (!container) return;
    const rect = container.getBoundingClientRect();
    let newX = e.clientX - rect.left - overlay.offsetX;
    let newY = e.clientY - rect.top - overlay.offsetY;
    // Clamp so badge stays within image
    newX = Math.max(0, Math.min(newX, rect.width - overlay.width));
    newY = Math.max(0, Math.min(newY, rect.height - overlay.height));
    overlay.x = newX;
    overlay.y = newY;
}
function stopDrag()
{
    const overlay = overlays.value.find(o => o.id === activeOverlayId.value);
    if (overlay) overlay.dragging = false;
    activeOverlayId.value = null;
    window.removeEventListener('mousemove', onDrag);
    window.removeEventListener('mouseup', stopDrag);
}

// Resizing logic for overlays (bottom-right corner)
function startResize(e: MouseEvent, overlay: BadgeOverlay)
{
    overlay.resizing = true;
    overlay.offsetX = e.clientX;
    overlay.offsetY = e.clientY;
    activeOverlayId.value = overlay.id;
    window.addEventListener('mousemove', onResize);
    window.addEventListener('mouseup', stopResize);
    e.stopPropagation();
}
function onResize(e: MouseEvent)
{
    const overlay = overlays.value.find(o => o.id === activeOverlayId.value);
    if (!overlay || !overlay.resizing) return;
    const container = document.getElementById('image-container');
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const dx = e.clientX - overlay.offsetX;
    // Keep aspect ratio: use dx for width, and set height accordingly
    let newWidth = Math.max(24, overlay.width + dx);
    let newHeight = Math.max(24, newWidth / (overlay.aspectRatio || 1));
    // Clamp so badge doesn't go out of image bounds
    newWidth = Math.min(newWidth, rect.width - overlay.x);
    newHeight = Math.min(newHeight, rect.height - overlay.y);
    overlay.width = newWidth;
    overlay.height = newHeight;
    overlay.offsetX = e.clientX;
    overlay.offsetY = e.clientY;
}
function stopResize()
{
    const overlay = overlays.value.find(o => o.id === activeOverlayId.value);
    if (overlay) overlay.resizing = false;
    activeOverlayId.value = null;
    window.removeEventListener('mousemove', onResize);
    window.removeEventListener('mouseup', stopResize);
}

// Add touch event handlers for mobile support
function startTouchDrag(e: TouchEvent, overlay: BadgeOverlay) {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    overlay.dragging = true;
    overlay.offsetX = touch.clientX - overlay.x;
    overlay.offsetY = touch.clientY - overlay.y;
    activeOverlayId.value = overlay.id;
    window.addEventListener('touchmove', onTouchDrag, { passive: false });
    window.addEventListener('touchend', stopTouchDrag);
}
function onTouchDrag(e: TouchEvent) {
    if (e.touches.length !== 1) return;
    const overlay = overlays.value.find(o => o.id === activeOverlayId.value);
    if (!overlay || !overlay.dragging) return;
    const container = document.getElementById('image-container');
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const touch = e.touches[0];
    let newX = touch.clientX - rect.left - overlay.offsetX;
    let newY = touch.clientY - rect.top - overlay.offsetY;
    newX = Math.max(0, Math.min(newX, rect.width - overlay.width));
    newY = Math.max(0, Math.min(newY, rect.height - overlay.height));
    overlay.x = newX;
    overlay.y = newY;
    e.preventDefault();
}
function stopTouchDrag() {
    const overlay = overlays.value.find(o => o.id === activeOverlayId.value);
    if (overlay) overlay.dragging = false;
    activeOverlayId.value = null;
    window.removeEventListener('touchmove', onTouchDrag);
    window.removeEventListener('touchend', stopTouchDrag);
}

// Touch resizing
function startTouchResize(e: TouchEvent, overlay: BadgeOverlay) {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    overlay.resizing = true;
    overlay.offsetX = touch.clientX;
    overlay.offsetY = touch.clientY;
    activeOverlayId.value = overlay.id;
    window.addEventListener('touchmove', onTouchResize, { passive: false });
    window.addEventListener('touchend', stopTouchResize);
    e.stopPropagation();
}
function onTouchResize(e: TouchEvent) {
    if (e.touches.length !== 1) return;
    const overlay = overlays.value.find(o => o.id === activeOverlayId.value);
    if (!overlay || !overlay.resizing) return;
    const container = document.getElementById('image-container');
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const touch = e.touches[0];
    const dx = touch.clientX - overlay.offsetX;
    let newWidth = Math.max(24, overlay.width + dx);
    let newHeight = Math.max(24, newWidth / (overlay.aspectRatio || 1));
    newWidth = Math.min(newWidth, rect.width - overlay.x);
    newHeight = Math.min(newHeight, rect.height - overlay.y);
    overlay.width = newWidth;
    overlay.height = newHeight;
    overlay.offsetX = touch.clientX;
    overlay.offsetY = touch.clientY;
    e.preventDefault();
}
function stopTouchResize() {
    const overlay = overlays.value.find(o => o.id === activeOverlayId.value);
    if (overlay) overlay.resizing = false;
    activeOverlayId.value = null;
    window.removeEventListener('touchmove', onTouchResize);
    window.removeEventListener('touchend', stopTouchResize);
}

function deleteOverlay(id: number)
{
    overlays.value = overlays.value.filter(o => o.id !== id);
}

const imageUploadBtn = ref<HTMLElement | null>(null);
onMounted(() => {
    if (imageUploadBtn.value) {
        const input = document.getElementById('image-upload');
        if (input) {
            (imageUploadBtn.value as any).onclick = () => input.click();
        }
    }
});

// Global image paste support
onMounted(() => {
  window.addEventListener('paste', handlePaste);
});
onBeforeUnmount(() => {
  window.removeEventListener('paste', handlePaste);
});

function handlePaste(e: ClipboardEvent) {
  if (!e.clipboardData) return;
  const items = e.clipboardData.items;
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item.kind === 'file' && item.type.startsWith('image/')) {
      const file = item.getAsFile();
      if (file) {
        imageUrl.value = URL.createObjectURL(file);
        // Clear overlays and badge selection
        overlays.value = [];
        setTimeout(() => emit('update:selectedBadge', null), 0);
        break;
      }
    }
  }
}

// Add onImageContainerClick to handle badge placement
function onImageContainerClick(e: MouseEvent) {
    // Only respond if the click target is the container itself (not a badge overlay)
    if ((e.target as HTMLElement).id === 'image-container') {
        if (props.selectedBadge) {
            const container = e.target as HTMLElement;
            const rect = container.getBoundingClientRect();
            const defaultSize = 64;
            const x = e.clientX - rect.left - defaultSize / 2;
            const y = e.clientY - rect.top - defaultSize / 2;
            // Try to get the image's natural aspect ratio
            const img = new window.Image();
            img.src = props.selectedBadge.image;
            img.onload = () => {
                const aspectRatio = img.naturalWidth && img.naturalHeight ? img.naturalWidth / img.naturalHeight : 1;
                overlays.value.push({
                    id: Date.now() + Math.random(),
                    badge: props.selectedBadge!,
                    x,
                    y,
                    width: defaultSize,
                    height: defaultSize,
                    aspectRatio,
                    dragging: false,
                    resizing: false,
                    offsetX: 0,
                    offsetY: 0,
                });
                // Deselect badge after placing
                // Use nextTick to emit after overlays update
                setTimeout(() => emit('update:selectedBadge', null), 0);
            };
            if (!img.complete) {
                overlays.value.push({
                    id: Date.now() + Math.random(),
                    badge: props.selectedBadge!,
                    x,
                    y,
                    width: defaultSize,
                    height: defaultSize,
                    aspectRatio: 1,
                    dragging: false,
                    resizing: false,
                    offsetX: 0,
                    offsetY: 0,
                });
                setTimeout(() => emit('update:selectedBadge', null), 0);
            }
        } else {
            activeOverlayId.value = null;
        }
    } else {
        // Clicked on overlay or controls, do not add badge, but unfocus any active overlay
        activeOverlayId.value = null;
    }
}

// Accept a resetBadges event from parent
const emit = defineEmits(['update:selectedBadge']);

// Expose a resetBadges method to parent
function resetBadges() {
  overlays.value = [];
}

// Expose exportImage method to parent
function exportImage() {
  if (!imageUrl.value) return;
  const container = document.getElementById('image-container');
  if (!container) return;
  const rect = container.getBoundingClientRect();
  const width = rect.width;
  const height = rect.height;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Draw the base image
  const baseImg = new window.Image();
  baseImg.crossOrigin = 'anonymous';
  baseImg.src = imageUrl.value;
  baseImg.onload = () => {
    ctx.drawImage(baseImg, 0, 0, width, height);
    // Draw overlays
    let loaded = 0;
    if (overlays.value.length === 0) finish();
    overlays.value.forEach((overlay) => {
      const badgeImg = new window.Image();
      badgeImg.crossOrigin = 'anonymous';
      badgeImg.src = overlay.badge.image;
      badgeImg.onload = () => {
        ctx.drawImage(
          badgeImg,
          overlay.x,
          overlay.y,
          overlay.width,
          overlay.height
        );
        loaded++;
        if (loaded === overlays.value.length) finish();
      };
      badgeImg.onerror = () => {
        loaded++;
        if (loaded === overlays.value.length) finish();
      };
    });
    function finish() {
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'annotated-image.png';
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }, 100);
      }, 'image/png');
    }
  };
}
defineExpose({ resetBadges, exportImage });

</script>

<template>
    <div class="w-full h-full flex flex-col md:flex-row overflow-hidden bg-gray-900 text-gray-100">
        <!-- Main image area -->
        <div class="flex-1 flex h-full flex-col items-center justify-center bg-gray-900">
            <div v-if="imageUrl" id="image-container"
                class="relative w-full h-full max-w-full flex items-center justify-center md:mt-16"
                @click="onImageContainerClick"
            >
                <img :src="imageUrl" alt="Preview"
                    class="block max-w-full h-auto w-auto mx-auto select-none"
                    style="z-index:0; pointer-events:none; user-select:none;"
                    draggable="false"
                    tabindex="-1"
                />
                <template v-for="overlay in overlays" :key="overlay.id">
                    <div class="group" :style="{
                        position: 'absolute',
                        left: overlay.x + 'px',
                        top: overlay.y + 'px',
                        width: overlay.width + 'px',
                        height: overlay.height + 'px',
                        cursor: overlay.dragging ? 'grabbing' : 'grab',
                        zIndex: 10,
                    }" 
                    @mousedown="(e) => startDrag(e, overlay)"
                    @touchstart.stop.prevent="(e) => startTouchDrag(e, overlay)"
                    style="touch-action: none; -webkit-user-drag: none; user-select: none;"
                >
                        <!-- Delete button -->
                        <button
                            class="absolute -top-2 -right-2 z-20 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center group-hover:opacity-100 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity border-2 border-white shadow select-none"
                            style="font-size: 0.9rem; user-select:none;" @mousedown.stop @click.stop="deleteOverlay(overlay.id)"
                            aria-label="Delete badge"
                            tabindex="-1"
                        >
                            ×
                        </button>
                        <img :src="overlay.badge.image" :alt="overlay.badge.name"
                            :style="{ width: '100%', height: '100%', pointerEvents: 'none', userSelect: 'none' }" />
                        <!-- Resize handle -->
                        <div class="absolute right-0 bottom-0 w-4 h-4 bg-blue-500 rounded-full border-2 border-white cursor-se-resize group-hover:opacity-100 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                            style="z-index:20;"
                            @mousedown.stop="(e) => startResize(e, overlay)"
                            @touchstart.stop.prevent="(e) => startTouchResize(e, overlay)"
                        ></div>
                    </div>
                </template>
            </div>
            <div v-else class="flex items-center justify-center w-full h-full text-gray-400 text-xl rounded shadow md:mt-16" style="aspect-ratio: 1/1;">
                Select an image to begin
            </div>
        </div>

    </div>
</template>
