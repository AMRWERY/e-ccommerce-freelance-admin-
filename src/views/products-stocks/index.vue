<template>
    <div>
        <div v-flowbite>
            <div class="flex items-center justify-between my-10 flex-nowrap">
                <p class="text-3xl font-semibold text-gray-700">{{ $t('dashboard.products_stocks') }}</p>
                <div class="flex items-center justify-center gap-4 ms-auto" v-if="!showSkeleton">
                    <div v-if="productStore.paginatedProducts.length > 0">
                        <!-- excelExportBtn component -->
                        <excel-export-btn :export-handler="handleExport" />
                    </div>

                    <router-link to="" role="button" @click="openAddProductDialog"
                        class="text-white bg-[#3b5998] hover:bg-[#3b5998]/90 focus:ring-4 focus:outline-none focus:ring-[#3b5998]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2">
                        <iconify-icon icon="ic:baseline-plus" width="24" height="24"></iconify-icon>
                        {{ $t('btn.add_product') }}
                    </router-link>

                    <!-- product-form-dialog component -->
                    <product-form-dialog :is-dialog-open="isDialogOpen" :product-id="selectedProductId"
                        @close="handleDialogClose" @success="handleProductSuccess" />
                </div>
            </div>

            <div class="flex justify-start pb-4 mb-4" v-if="!showSkeleton && productStore.paginatedProducts.length > 0">
                <label for="table-search" class="sr-only">Search</label>
                <div class="relative mt-1">
                    <div class="absolute inset-y-0 flex items-center pointer-events-none end-0 pe-3">
                        <iconify-icon icon="material-symbols-light:search" width="20" height="20"
                            class="text-gray-500"></iconify-icon>
                    </div>
                    <input type="text" id="table-search" v-model="searchProduct"
                        class="block pt-2 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                        :placeholder="$t('form.search_for_items')">
                </div>
            </div>

            <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
                <template v-if="showSkeleton">
                    <!-- tableSkeletonLoader component -->
                    <table-skeleton-loader :headers="skeletonHeaders" :rows="5" />
                </template>

                <template v-else>
                    <table class="w-full text-sm text-gray-500 text-start">
                        <thead class="text-xs text-gray-700 capitalize bg-gray-50">
                            <tr>
                                <th scope="col" class="px-6 py-3">
                                    #
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    {{ $t('dashboard.product_img') }}
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    {{ $t('dashboard.product_name') }}
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    {{ $t('dashboard.target_market') }}
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    {{ $t('dashboard.price') }}
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    {{ $t('dashboard.discount') }}
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    {{ $t('dashboard.availability') }}
                                </th>
                                <th scope="col" class="px-6 py-3">
                                </th>
                            </tr>
                        </thead>

                        <tbody v-if="productStore.paginatedProducts.length === 0">
                            <tr>
                                <td colspan="10" class="p-4 text-center">
                                    <!-- NoDataMessage component -->
                                    <No-data-message :message="$t('no_data.no_products_found')"
                                        icon="tabler:package-off" />
                                </td>
                            </tr>
                        </tbody>

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
                                    <div class="flex items-center gap-2">
                                        <img src="/ksa-flag.svg" alt="ksa-flag" class="w-5 h-4"
                                            v-if="product.targetMarket === 'Saudi Arabia'">
                                        <img src="/egypt-flag.svg" alt="egypt-flag" class="w-5 h-4" v-else>
                                        {{ $i18n.locale ===
                                            'ar' ? product.targetMarketAr :
                                            product.targetMarket }}
                                    </div>
                                </td>
                                <td class="px-6 py-4">
                                    <div class="flex flex-col">
                                        <p class="text-sm font-semibold text-gray-900">
                                            {{ $n(parseFloat(product.discountedPrice), 'currency', currencyLocale || {
                                                style: 'currency',
                                                currency: 'USD'
                                            }) }}
                                        </p>
                                        <p class="text-xs text-gray-500 line-through">
                                            {{ $n(parseFloat(product.originalPrice), 'currency', currencyLocale || {
                                                style: 'currency', currency:
                                                    'USD'
                                            }) }}
                                        </p>
                                    </div>
                                </td>
                                <td class="px-6 py-4">
                                    <template v-if="product.discount > 0">
                                        {{ product.discount }}%
                                    </template>
                                    <template v-else>
                                        {{ $t('dashboard.no_discount') }}
                                    </template>
                                </td>
                                <td class="px-6 py-4">
                                    <template v-if="product.numberOfStock > 0">
                                        <span class="font-semibold text-blue-700">{{ product.numberOfStock }}</span> {{
                                            $t('dashboard.pieces') }}
                                    </template>
                                    <template v-else>
                                        <span class="font-semibold text-red-700">{{ $t('dashboard.out_of_stock')
                                        }}</span>
                                    </template>
                                </td>
                                <td class="px-6 py-4">
                                    <div class="flex gap-3">
                                        <button role="button" @click.stop="openEditDialog(product.id)"
                                            class="font-semibold text-blue-600 hover:underline">{{ $t('btn.edit')
                                            }}</button>
                                        <button role="button">
                                            <span class="flex items-center font-semibold text-red-600"
                                                @click.stop="openDeleteDialog(product)">
                                                <iconify-icon icon="material-symbols:delete" width="20" height="20"
                                                    class="me-1"></iconify-icon>
                                                {{ $t('btn.delete') }}
                                            </span>
                                        </button>
                                    </div>
                                </td>
                            </tr>

                            <!-- delete-dialog component -->
                            <delete-dialog v-model="showDeleteDialog" :message="$t('dashboard.delete_confirmation')"
                                @confirm="handleDelete" />
                        </tbody>
                    </table>
                </template>
            </div>

            <!-- paginationControls component -->
            <pagination-controls v-if="!showSkeleton && productStore.paginatedProducts.length > 0"
                :current-page="productStore.currentPage" :total-pages="productStore.totalPages"
                @page-change="productStore.changePage" />
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
const { t, locale } = useI18n()
const productStore = useProductsStore()
const { showToast, toastMessage, toastType, toastIcon, triggerToast } = useToast();
const showSkeleton = ref(true);

onMounted(async () => {
    const startTime = Date.now();
    try {
        await productStore.fetchProducts();
    } finally {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(3000 - elapsed, 0);
        setTimeout(() => {
            showSkeleton.value = false;
        }, remaining);
    }
});

const isDialogOpen = ref(false);
const selectedProductId = ref(null);

const openAddProductDialog = () => {
    selectedProductId.value = null;
    isDialogOpen.value = true;
};

const openEditDialog = (productId) => {
    selectedProductId.value = productId;
    isDialogOpen.value = true;
};

const handleDialogClose = () => {
    isDialogOpen.value = false;
    selectedProductId.value = null;
};

const showDeleteDialog = ref(false);
const deletingProducts = ref({});

const openDeleteDialog = (product) => {
    selectedProductId.value = product.id;
    showDeleteDialog.value = true;
};

const handleDelete = async () => {
    if (!selectedProductId.value) return;
    deletingProducts.value[selectedProductId.value] = true;
    showDeleteDialog.value = false;
    try {
        await productStore.deleteProduct(selectedProductId.value);
        triggerToast({
            message: t('toast.product_deleted'),
            type: 'success',
            icon: 'material-symbols:check-circle',
        });
    } catch (error) {
        triggerToast({
            message: t('toast.delete_failed'),
            type: 'error',
            icon: 'material-symbols:error-rounded',
        });
    } finally {
        deletingProducts.value[selectedProductId.value] = false;
        selectedProductId.value = null;
    }
};

const searchProduct = computed({
    get: () => productStore.searchProductByTitle,
    set: (value) => productStore.setSearchTerm(value)
});

const handleProductSuccess = () => {
    productStore.currentPage = 1;
    productStore.updatePagination();
};

//currency composable
const { currencyLocale } = useCurrencyLocale();

// useExcelExport composable
const { exportDataToExcel } = useExcelExport();

const excelConfig = ref({
    filename: 'products_export.xlsx',
    sheetName: 'Products',
    headers: [
        {
            label: t('dashboard.product_name'),
            key: "title",
            mapper: (item) => locale.value === 'ar' ? item.titleAr : item.title
        },
        {
            label: t('dashboard.target_market'),
            key: "targetMarket"
        },
        {
            label: t('dashboard.price'),
            key: "discountedPrice",
            type: "n",
            numberFormat: '0',
            mapper: (item) => Math.round(parseFloat(item.discountedPrice)),
            cellStyle: { font: { color: { rgb: "00AA00" }, bold: true } }
        },
        {
            label: t('dashboard.discount'),
            key: "discount"
        },
        {
            label: t('dashboard.availability'),
            key: "numberOfStock"
        }
    ],
    columnWidths: [5, 15, 25, 20, 15, 15, 10]
});

const handleExport = () => {
    exportDataToExcel(productStore.products, excelConfig.value);
};

const skeletonHeaders = [
    { label: '#', loaderWidth: 'w-8' },
    { label: 'Product Image', type: 'image' },
    { label: 'Product Name', loaderWidth: 'w-32' },
    { label: 'Target Market', loaderWidth: 'w-24' },
    { label: 'Price', loaderWidth: 'w-24' },
    { label: 'Discount', loaderWidth: 'w-24' },
    { label: 'Availability', loaderWidth: 'w-24' },
    { label: 'Actions', type: 'action' }
];
</script>