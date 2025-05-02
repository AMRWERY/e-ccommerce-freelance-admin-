<template>
    <div>
        <div class="flex items-center justify-between my-10 flex-nowrap">
            <p class="text-3xl font-semibold text-gray-700">{{ $t('dashboard.users_ratings') }}</p>
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
                            <th scope="col" class="w-[8%] px-6 py-3 whitespace-nowrap">
                                {{ $t('dashboard.product_img') }}
                            </th>
                            <th scope="col" class="w-[17%] px-6 py-3 whitespace-nowrap">
                                {{ $t('dashboard.product_name') }}
                            </th>
                            <th scope="col" class="w-[6%] px-6 py-3">
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr class="bg-white border-b border-gray-200 hover:bg-gray-50"
                            v-for="(product, index) in productStore.paginatedProducts" :key="product.id">
                            <td class="w-4 p-4">
                                <div class="flex items-center">
                                    {{ (productStore.currentPage -
                                        1) *
                                        productStore.productsPerPage +
                                        index +
                                        1 }}
                                </div>
                            </td>
                            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                <img :src="product.imageUrl1" alt="product-logo"
                                    class="object-cover w-12 h-12 rounded-lg">
                            </th>
                            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                {{ $i18n.locale ===
                                    'ar' ? product.titleAr :
                                    product.title }}
                            </th>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="flex items-center justify-center px-6 py-4 space-s-5" v-flowbite>
                                    <button role="button" @click.stop="openEditDialog(product.id)"
                                        class="flex items-center justify-center font-medium text-blue-600 hover:text-blue-800"
                                        data-tooltip-target="tooltip-show-reviews">
                                        <iconify-icon icon="mdi:eye-outline" width="24" height="24" />
                                    </button>
                                    <div id="tooltip-show-reviews" role="tooltip"
                                        class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-xs opacity-0 tooltip dark:bg-gray-700">
                                        {{ $t('tooltip.show_reviews') }}
                                        <div class="tooltip-arrow" data-popper-arrow></div>
                                    </div>
                                </div>
                            </td>
                        </tr>

                        <!-- users-ratings-dialog component -->
                        <users-ratings-dialog :is-dialog-open="isDialogVisible" :product-id="selectedProductId"
                            @update:is-dialog-open="handleDialogClose" />
                    </tbody>
                </table>
            </template>
        </div>

        <!-- paginationControls component -->
        <pagination-controls v-if="!showSkeleton && productStore.paginatedProducts.length > 0"
            :current-page="productStore.currentPage" :total-pages="productStore.totalPages"
            @page-change="productStore.changePage" />
    </div>
</template>

<script setup>
const productStore = useProductsStore();
const showSkeleton = ref(true);

onMounted(async () => {
    const startTime = Date.now();
    showSkeleton.value = true;
    try {
        await productStore.fetchProducts();
    } catch (error) {
        console.error('Error initializing:', error);
    } finally {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(3000 - elapsed, 0);
        setTimeout(() => {
            showSkeleton.value = false;
        }, remaining);
    }
});

const isDialogVisible = ref(false);
const selectedProductId = ref(null);

const openEditDialog = (productId) => {
    selectedProductId.value = productId;
    isDialogVisible.value = true;
};

const handleDialogClose = (newValue) => {
    isDialogVisible.value = newValue;
    if (!newValue) selectedProductId.value = null;
};

const skeletonHeaders = [
    { label: '#', loaderWidth: 'w-8' },
    { label: 'Product Image', type: 'image' },
    { label: 'Product Name', loaderWidth: 'w-32' },
    { label: 'Actions', type: 'action' }
];
</script>