<template>
  <div>
    <transition name="overlay-fade">
      <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
        <div class="flex items-center justify-center">
          <div class="flex justify-center text-5xl text-gray-300 align-center">
            <iconify-icon icon="svg-spinners:pulse-rings-multiple" width="300" height="300"></iconify-icon>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
defineProps(['visible']);
</script>

<style scoped>
.overlay-fade-enter-active,
.overlay-fade-leave-active {
  transition: opacity 0.5s;
}

.overlay-fade-enter-from,
.overlay-fade-leave-to {
  opacity: 0;
}

.overlay-fade-enter-to,
.overlay-fade-leave-from {
  opacity: 1;
}
</style>