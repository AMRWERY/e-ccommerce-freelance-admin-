<template>
    <div>
        <div v-flowbite>
            <div class="flex items-center justify-between my-10 flex-nowrap">
                <p class="text-3xl font-semibold text-gray-700">{{ $t('dashboard.products_stocks') }}</p>
                <div class="flex items-center justify-center gap-4 ms-auto">
                    <button @click="exportToExcel" data-tooltip-target="tooltip-default" data-tooltip-placement="bottom"
                        class="inline-flex items-center px-5 py-2.5 text-blue-700 border border-blue-700 rounded-lg hover:bg-blue-100">
                        <iconify-icon icon="tabler:file-excel" width="24" height="24"></iconify-icon>
                    </button>
                    <div id="tooltip-default" role="tooltip"
                        class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-xs opacity-0 tooltip dark:bg-gray-700">
                        {{ $t('tooltip.download_excel') }}
                        <div class="tooltip-arrow" data-popper-arrow></div>
                    </div>

                    <router-link to="" role="button" @click="openAddProductDialog"
                        class="text-white bg-[#3b5998] hover:bg-[#3b5998]/90 focus:ring-4 focus:outline-none focus:ring-[#3b5998]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2">
                        <iconify-icon icon="ic:baseline-plus" width="24" height="24"></iconify-icon>
                        {{ $t('btn.add_product') }}
                    </router-link>

                    <!-- product-form-dialog component -->
                    <product-form-dialog :is-dialog-open="isDialogOpen" :product-id="selectedProductId"
                        @close="handleDialogClose" />
                </div>
            </div>

            <div class="flex justify-start pb-4 mb-4">
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
                                    <span class="font-semibold text-red-700">{{ $t('dashboard.out_of_stock') }}</span>
                                </template>
                            </td>
                            <td class="px-6 py-4">
                                <div class="flex gap-3">
                                    <button role="button" @click.stop="openEditDialog(product.id)"
                                        class="font-medium text-blue-600 hover:underline">{{ $t('btn.edit') }}</button>
                                    <button role="button">
                                        <span class="flex items-center" @click.stop="openDeleteDialog(product)">
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
const { t } = useI18n()
const productStore = useProductsStore()
const { showToast, toastMessage, toastType, toastIcon, triggerToast } = useToast();

onMounted(() => {
    productStore.fetchProducts()
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

//currency composable
const { currencyLocale } = useCurrencyLocale();

// useExcelExport composable
const { exportDataToExcel } = useExcelExport();

const exportToExcel = () => {
    const options = {
        filename: 'products_export.xlsx',
        sheetName: 'Products',
        headers: [
            { label: "#", key: "id" },
            { label: "Product Image", key: "imageUrl1", mapper: (item) => "" }, // Empty for image path
            { label: "Product Name", key: "title", mapper: (item) => $i18n.locale === 'ar' ? item.titleAr : item.title },
            { label: "Target Market", key: "targetMarket" },
            {
                label: "Price",
                key: "discountedPrice",
                type: "n",
                numberFormat: "$#,##0.00",
                cellStyle: { font: { color: { rgb: "00AA00" }, bold: true } }
            },
            { label: "Discount (%)", key: "discount" },
            { label: "Stock", key: "numberOfStock" }
        ],
        columnWidths: [5, 15, 25, 20, 15, 15, 10]
    };
    exportDataToExcel(productStore.products, options);
};
</script>