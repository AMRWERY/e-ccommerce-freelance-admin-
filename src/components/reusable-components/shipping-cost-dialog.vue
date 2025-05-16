<template>
    <div>
        <div v-if="isDialogOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">            <div class="w-full max-w-2xl p-6 bg-white rounded-lg" style="height: 408px;">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-semibold">{{ countryName }}</h3>
                    <button @click="close" class="text-gray-500 hover:text-gray-700">
                        <iconify-icon icon="mdi:close" width="24" height="24" />
                    </button>
                </div>

                <div class="space-y-4 overflow-y-auto h-[calc(408px-88px)] pr-2 scrollbar-hide">
                    <!-- Add Governorate Button -->
                    <div class="pb-4 border-b">
                        <button v-if="!showAddGovernorate" @click="showAddGovernorate = true"
                            class="flex items-center gap-2 text-blue-600 hover:text-blue-800">
                            <iconify-icon icon="mdi:plus" width="20" height="20" />
                            {{ $t('btn.add_governorate') }}
                        </button>

                        <!-- Add Governorate Form -->
                        <div v-else class="flex items-center gap-4">
                            <input v-model="newGovernorateTitle" :placeholder="$t('form.governorate_en')"
                                class="flex-1 px-2 py-1 border rounded" type="text">
                            <input v-model="newGovernorateTitleAr" :placeholder="$t('form.governorate_ar')"
                                class="flex-1 px-2 py-1 border rounded" type="text">
                            <input v-model.number="newGovernorateCost" :placeholder="$t('form.cost')"
                                class="w-24 px-2 py-1 border rounded" type="number">
                            <div class="flex gap-2">
                                <button @click="addNewGovernorate" class="p-1 text-green-600 hover:text-green-800">
                                    <iconify-icon icon="mdi:check" width="20" height="20" />
                                </button>
                                <button @click="cancelAddGovernorate" class="p-1 text-red-600 hover:text-red-800">
                                    <iconify-icon icon="mdi:close" width="20" height="20" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Existing Governorates -->
                    <div v-for="(governorate, index) in governorates" :key="index" class="flex items-center gap-4">
                        <template v-if="governorate.editing">
                            <input v-model="governorate.title" class="flex-1 px-2 py-1 border rounded"
                                :placeholder="$t('form.governorate_en')">
                            <input v-model="governorate.titleAr" class="flex-1 px-2 py-1 border rounded"
                                :placeholder="$t('form.governorate_ar')">
                        </template>
                        <template v-else>
                            <span class="flex-1">{{ localeTitle(governorate) }}</span>
                        </template>
                        <input v-model.number="governorate.cost" type="number" :disabled="!governorate.editing"
                            class="w-24 px-2 py-1 border rounded" @keyup.enter="saveGovernorate(governorate)">
                        <div class="flex gap-1">
                            <button @click="handleEditAction(governorate)"
                                class="p-1 text-blue-600 hover:text-blue-800">
                                <iconify-icon :icon="governorate.editing ? 'mdi:content-save' : 'mdi:pencil'" width="20"
                                    height="20" />
                            </button>

                            <button @click="deleteGovernorate(governorate)" class="p-1 text-red-600 hover:text-red-800">
                                <iconify-icon icon="mdi:delete" width="20" height="20" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Toast Component -->
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
        // Store original values when entering edit mode
        governorate.originalTitle = governorate.title;
        governorate.originalTitleAr = governorate.titleAr;
        governorate.originalCost = governorate.cost;
        governorate.editing = true;
    }
};

const saveGovernorate = async (governorate) => {
    try {
        await shippingStore.updateGovernorate(
            props.countryCode,
            {
                originalTitle: governorate.originalTitle,
                newData: {
                    title: governorate.title,
                    titleAr: governorate.titleAr,
                    cost: Number(governorate.cost)
                }
            }
        );
        governorate.originalCost = governorate.cost;
        governorate.editing = false;
        triggerToast({
            message: t('toast.shipping_cost_updated'),
            type: 'success',
            icon: 'material-symbols:check-circle',
        });
    } catch (error) {
        governorate.title = governorate.originalTitle;
        governorate.titleAr = governorate.originalTitleAr;
        governorate.cost = governorate.originalCost;
        triggerToast({
            message: t('toast.update_error'),
            type: 'error',
            icon: 'material-symbols:error-rounded',
        });
    }
};

// const saveGovernorate = async (governorate) => {
//     try {
//         const numericCost = Number(governorate.cost);
//         await shippingStore.updateGovernorateCost(
//             props.countryCode,
//             governorate.title,
//             numericCost
//         );
//         governorate.originalCost = numericCost;
//         governorate.editing = false;
//         triggerToast({
//             message: t('toast.shipping_cost_updated'),
//             type: 'success',
//             icon: 'material-symbols:check-circle',
//         });
//     } catch (error) {
//         governorate.cost = governorate.originalCost;
//         triggerToast({
//             message: t('toast.update_error'),
//             type: 'error',
//             icon: 'material-symbols:error-rounded',
//         });
//     }
// };

const close = () => {
    emit('close');
};

const showAddGovernorate = ref(false);
const newGovernorateTitle = ref('');
const newGovernorateTitleAr = ref('');
const newGovernorateCost = ref(0);

const addNewGovernorate = async () => {
    try {
        if (!newGovernorateTitle.value || !newGovernorateTitleAr.value || !newGovernorateCost.value) {
            triggerToast({
                message: t('toast.fill_all_fields'),
                type: 'error',
                icon: 'material-symbols:error-rounded',
            });
            return;
        }
        await shippingStore.addGovernorate(props.countryCode, {
            title: newGovernorateTitle.value,
            titleAr: newGovernorateTitleAr.value,
            cost: Number(newGovernorateCost.value)
        });
        governorates.value = shippingStore.getGovernorates(props.countryCode).map(g => ({
            ...g,
            editing: false,
            originalCost: g.cost
        }));
        triggerToast({
            message: t('toast.governorate_added'),
            type: 'success',
            icon: 'material-symbols:check-circle',
        });
        // Reset form
        cancelAddGovernorate();
    } catch (error) {
        console.error('Error adding governorate:', error);
        triggerToast({
            message: t('toast.add_error'),
            type: 'error',
            icon: 'material-symbols:error-rounded',
        });
    }
};

const cancelAddGovernorate = () => {
    showAddGovernorate.value = false;
    newGovernorateTitle.value = '';
    newGovernorateTitleAr.value = '';
    newGovernorateCost.value = 0;
};

const deleteGovernorate = async (governorate) => {
    try {
        await shippingStore.deleteGovernorate(
            props.countryCode,
            governorate.title
        );
        governorates.value = governorates.value.filter(g => g.title !== governorate.title);
        triggerToast({
            message: t('toast.governorate_deleted'),
            type: 'success',
            icon: 'material-symbols:check-circle',
        });
    } catch (error) {
        console.error('Delete error:', error);
        triggerToast({
            message: t('toast.delete_error'),
            type: 'error',
            icon: 'material-symbols:error-rounded',
        });
    }
};
</script>

<style scoped>
.scrollbar-hide {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;     /* Firefox */
}

.scrollbar-hide::-webkit-scrollbar {
    display: none;  /* Chrome, Safari and Opera */
}
</style>