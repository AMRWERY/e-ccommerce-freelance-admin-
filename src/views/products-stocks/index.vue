<template>
    <div>
        <div v-flowbite>
            <div class="flex items-center justify-between my-10 flex-nowrap">
                <p class="text-3xl font-semibold text-gray-700">{{ $t('dashboard.products_stocks') }}</p>
                <div class="flex items-center justify-center gap-4">
                    <button @click="exportToExcel" data-tooltip-target="tooltip-default" data-tooltip-placement="bottom"
                        class="inline-flex items-center px-5 py-2.5 text-blue-700 border border-blue-700 rounded-lg hover:bg-blue-100">
                        <iconify-icon icon="tabler:file-excel" width="24" height="24"></iconify-icon>
                    </button>
                    <div id="tooltip-default" role="tooltip"
                        class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-xs opacity-0 tooltip dark:bg-gray-700">
                        {{ $t('tooltip.download_excel') }}
                        <div class="tooltip-arrow" data-popper-arrow></div>
                    </div>

                    <!-- product-form-dialog component -->
                    <product-form-dialog />
                </div>
            </div>

            <div class="flex justify-end pb-4">
                <label for="table-search" class="sr-only">Search</label>
                <div class="relative mt-1">
                    <div class="absolute inset-y-0 flex items-center pointer-events-none end-0 pe-3">
                        <iconify-icon icon="material-symbols-light:search" width="20" height="20"
                            class="text-gray-500"></iconify-icon>
                    </div>
                    <input type="text" id="table-search"
                        class="block pt-2 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                        :placeholder="$t('form.search_for_items')">
                </div>
            </div>

            <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table class="w-full text-sm text-gray-500 text-start">
                    <thead class="text-xs text-gray-700 capitalize bg-gray-50">
                        <tr>
                            <th scope="col" class="px-6 py-3">
                                #
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Product img
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Product name
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Target Market
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Price
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Discount
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Availability
                            </th>
                            <th scope="col" class="px-6 py-3">
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
                            <td class="px-6 py-4">
                                {{ product.targetMarket }}
                            </td>
                            <td class="px-6 py-4">
                                <div class="flex flex-col">
                                    <p class="text-sm font-semibold text-gray-900">
                                        {{ product.discountedPrice }}egp
                                    </p>
                                    <p class="text-xs text-gray-500 line-through">
                                        {{ product.originalPrice }}egp
                                    </p>
                                </div>
                            </td>
                            <td class="px-6 py-4">
                                {{ product.discount }}%
                            </td>
                            <td class="px-6 py-4">
                                {{ product.numberOfStock }}
                            </td>
                            <td class="px-6 py-4">
                                <div class="flex gap-3">
                                    <router-link to="" role="button"
                                        class="font-medium text-blue-600 hover:underline">Edit</router-link>
                                    <!-- <span class="flex items-center">
                                        <iconify-icon icon="line-md:loading-loop" width="20" height="20"
                                            class="me-1"></iconify-icon>
                                        Deleting...
                                    </span> -->
                                    <span class="flex items-center" @click="openDeleteDialog(product.id)">
                                        <iconify-icon icon="material-symbols:delete" width="20" height="20"
                                            class="me-1"></iconify-icon>
                                        Delete
                                    </span>
                                </div>
                            </td>
                        </tr>

                        <!-- delete-dialog component -->
                        <delete-dialog v-model="showDeleteDialog"
                            :message="`You are about to delete product #${selectedProductId}. This action cannot be undone.`"
                            @confirm="handleDelete" />
                    </tbody>
                </table>
            </div>

            <!-- pagination -->
            <div class="flex items-end justify-end mt-12">
                <div class="flex items-center px-4 py-3" v-if="productStore.paginatedProducts.length > 0">
                    <div class="flex mt-3 space-s-1 ms-auto">
                        <button role="button" @click="productStore.changePage(productStore.currentPage - 1)"
                            :disabled="productStore.currentPage === 1"
                            class="flex items-center justify-center bg-gray-100 rounded-md shrink-0 w-9 h-9 disabled:opacity-50">
                            <iconify-icon icon="material-symbols:keyboard-arrow-left" width="24" height="24"
                                class="text-gray-400 rtl:rotate-180"></iconify-icon>
                        </button>
                        <button v-for="page in productStore.totalPages" :key="page"
                            @click="newMerchantStore.changePage(page)" :class="{
                                'bg-slate-300 text-gray-800': page === productStore.currentPage,
                                'bg-slate-100 text-gray-600': page !== productStore.currentPage,
                            }"
                            class="flex items-center justify-center shrink-0 border hover:border-blue-500 cursor-pointer text-base font-medium text-spate-900 px-[13px] h-9 rounded-md">
                            {{ page }}
                        </button>
                        <button role="button" @click="productStore.changePage(productStore.currentPage + 1)"
                            :disabled="productStore.currentPage === productStore.totalPages"
                            class="flex items-center justify-center border rounded-md cursor-pointer shrink-0 hover:border-blue-500 w-9 h-9 disabled:opacity-50">
                            <iconify-icon icon="material-symbols:keyboard-arrow-right" width="24" height="24"
                                class="text-gray-400 rtl:rotate-180"></iconify-icon>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const productStore = useProductsStore()

onMounted(() => {
    productStore.fetchProducts()
});

const showDeleteDialog = ref(false);
const selectedProductId = ref(null);

const openDeleteDialog = (productId) => {
    selectedProductId.value = productId;
    showDeleteDialog.value = true;
};

const handleDelete = async () => {
    try {
        // Call your delete API here using selectedProductId.value
        products.value = products.value.filter(p => p.id !== selectedProductId.value);
    } catch (error) {
        console.error('Delete failed:', error);
    } finally {
        selectedProductId.value = null;
    }
};

// useExcelExport composable
const { exportDataToExcel } = useExcelExport();

const exportToExcel = () => {
    exportDataToExcel(products.value, { filename: 'my_products.xlsx' });
};
</script>