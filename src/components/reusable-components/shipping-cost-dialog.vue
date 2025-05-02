<template>
    <div>
        <div v-if="isDialogOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div class="w-full max-w-xl p-6 bg-white rounded-lg">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-semibold">{{ countryName }}</h3>
                    <button @click="close" class="text-gray-500 hover:text-gray-700">
                        <iconify-icon icon="mdi:close" width="24" height="24" />
                    </button>
                </div>

                <div class="space-y-4">
                    <div v-for="(governorate, index) in governorates" :key="index" class="flex items-center gap-4">
                        <span class="flex-1">{{ localeTitle(governorate) }}</span>
                        <input v-model.number="governorate.cost" type="number" :disabled="!governorate.editing"
                            class="w-24 px-2 py-1 border rounded" @keyup.enter="saveGovernorate(governorate)">
                        <button @click="handleEditAction(governorate)" class="p-1 text-blue-600 hover:text-blue-800">
                            <iconify-icon :icon="governorate.editing ? 'mdi:content-save' : 'mdi:pencil'" width="20"
                                height="20" />
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- dynamic-toast component  -->
        <div
            class="fixed z-50 pointer-events-none bottom-5 start-5 sm:w-96 w-full max-w-[calc(100%-2rem)] mx-2 sm:mx-0">
            <div class="pointer-events-auto">
                <dynamic-toast v-if="showToast" :message="toastMessage" :toastType="toastType" :duration="5000"
                    :toastIcon="toastIcon" @toastClosed="showToast = false" />
            </div>
        </div>
    </div>
</template>

<script setup>
const { t } = useI18n();
const { showToast, toastMessage, toastType, toastIcon, triggerToast } = useToast();

const props = defineProps({
    isDialogOpen: Boolean,
    countryCode: String
});

const emit = defineEmits(['close', 'update-cost']);

const shippingStore = useShippingStore();
const governorates = ref([]);

const countryName = computed(() => {
    return props.countryCode === 'eg' ? t('countries.egypt') : t('countries.ksa');
});

const localeTitle = (governorate) => {
    return useI18n().locale.value === 'ar' ? governorate.titleAr : governorate.title;
};

watch(() => props.countryCode, async (code) => {
    if (code) {
        await shippingStore.fetchShippingCosts();
        governorates.value = shippingStore.getGovernorates(code).map(g => ({
            ...g,
            editing: false,
            originalCost: g.cost
        }));
    }
});

const handleEditAction = (governorate) => {
    if (governorate.editing) {
        saveGovernorate(governorate);
    } else {
        governorate.editing = true;
    }
};

const saveGovernorate = async (governorate) => {
    try {
        const numericCost = Number(governorate.cost);
        await shippingStore.updateGovernorateCost(
            props.countryCode,
            governorate.title,
            numericCost
        );
        governorate.originalCost = numericCost;
        governorate.editing = false;
        triggerToast({
            message: t('toast.shipping_cost_updated'),
            type: 'success',
            icon: 'material-symbols:check-circle',
        });
    } catch (error) {
        governorate.cost = governorate.originalCost;
        triggerToast({
            message: t('toast.update_error'),
            type: 'error',
            icon: 'material-symbols:error-rounded',
        });
    }
};

const close = () => {
    emit('close');
};
</script>