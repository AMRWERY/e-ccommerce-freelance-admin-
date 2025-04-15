<template>
    <div>
        <router-link to="" class="font-semibold text-white me-4" role="button" v-if="localeStore.isRTL">
            <span class="w-5" @click="setLocale('en')">
                En
            </span>
        </router-link>
        <router-link to="" class="font-semibold text-white me-4" role="button" v-else>
            <span class="w-5" @click="setLocale('ar')">
                العربية
            </span>
        </router-link>
    </div>
</template>

<script setup>
const { locale } = useI18n();
const localeStore = useLocaleStore();

// onMounted(() => {
//     locale.value = localeStore.locale;
// });

const setLocale = (value) => {
    locale.value = value;
    localeStore.updateLocale(value);
};

computed(() => {
    const storedLocale = localeStore.locale;
    setLocale(storedLocale);
});

watchEffect(() => {
    locale.value = localeStore.locale;
});
</script>