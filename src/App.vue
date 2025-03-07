<template>
  <div>
    <!-- Overlay Component -->
    <overlay :visible="localeStore.isOverlayVisible" />

    <div :dir="isRTL ? 'rtl' : 'ltr'" :class="{ 'rtl': isRTL, 'ltr': !isRTL }">
      <router-view v-slot="{ Component }">
        <transition name="fade">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </div>
</template>

<script setup>
const localeStore = useLocaleStore();
const { locale } = useI18n();

const isRTL = computed(() => {
  return locale.value === 'ar';
});
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>