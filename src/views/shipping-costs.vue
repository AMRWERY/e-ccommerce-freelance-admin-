<template>
    <div>
        <div v-flowbite>
            <div class="flex items-center justify-between my-10 flex-nowrap">
                <p class="text-3xl font-semibold text-gray-700">{{ $t('dashboard.shipping_costs') }}</p>
                <div class="flex items-center justify-center gap-4 ms-auto" v-if="!showSkeleton">

                    <!-- shipping-cost-dialog component -->
                    <shipping-cost-dialog :is-dialog-open="isDialogOpen" :country-code="selectedCountry"
                        @close="closeDialog" @update-cost="handleCostUpdate" />
                </div>
            </div>

            <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
                <template v-if="showSkeleton">
                    <!-- tableSkeletonLoader component -->
                    <table-skeleton-loader :headers="skeletonHeaders" :rows="5" />
                </template>

                <template v-else>
                    <table class="w-full text-sm text-gray-500 table-auto text-start">
                        <thead class="text-xs text-gray-700 capitalize bg-gray-50">
                            <tr>
                                <th scope="col" class="w-[4%] px-6 py-3">
                                    #
                                </th>
                                <th scope="col" class="w-[17%] px-6 py-3 whitespace-nowrap">
                                    {{ $t('dashboard.market') }}
                                </th>
                                <th scope="col" class="w-[6%] px-6 py-3">
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr class="bg-white border-b border-gray-200 hover:bg-gray-50"
                                v-for="(country, code, index) in markets" :key="code">
                                <td class="w-4 p-4">
                                    <div class="flex items-center">
                                        {{ index + 1 }}
                                    </div>
                                </td>

                                <td class="px-6 py-4">
                                    <div class="flex items-center gap-2">
                                        <img :src="code === 'eg' ? '/egypt-flag.svg' : '/ksa-flag.svg'" class="w-6 h-4"
                                            :alt="country.name">
                                        {{ country.name }}
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex gap-3">
                                        <div class="flex items-center justify-center px-6 py-4 space-s-5">
                                            <button role="button" @click="openEditDialog(code)"
                                                class="flex items-center justify-center font-medium text-blue-600 hover:text-blue-800"
                                                data-tooltip-target="tooltip-edit-shipping">
                                                <iconify-icon icon="material-symbols:edit" width="24" height="24" />
                                            </button>
                                            <div id="tooltip-edit-shipping" role="tooltip"
                                                class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-xs opacity-0 tooltip dark:bg-gray-700">
                                                {{ $t('tooltip.edit_shipping_cost') }}
                                                <div class="tooltip-arrow" data-popper-arrow></div>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </template>
            </div>
        </div>
    </div>
</template>

<script setup>
const showSkeleton = ref(true);

const { t } = useI18n();
const shippingStore = useShippingStore();
const isDialogOpen = ref(false);
const selectedCountry = ref('');

const markets = computed(() => ({
    eg: { code: 'eg', name: t('countries.egypt') },
    sa: { code: 'sa', name: t('countries.ksa') }
}));

const openEditDialog = (countryCode) => {
    selectedCountry.value = countryCode;
    isDialogOpen.value = true;
};

const closeDialog = () => {
    isDialogOpen.value = false;
    selectedCountry.value = '';
};

const handleCostUpdate = () => {
    shippingStore.fetchShippingCosts();
};

onMounted(async () => {
    const startTime = Date.now();
    try {
        await new Promise(resolve => setTimeout(resolve, 3000));
    } finally {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(3000 - elapsed, 0);
        setTimeout(() => showSkeleton.value = false, remaining);
    }
});

const skeletonHeaders = [
    { label: '#', loaderWidth: 'w-8' },
    { label: 'Market', loaderWidth: 'w-32' },
    { label: 'Actions', type: 'action' }
];
</script>