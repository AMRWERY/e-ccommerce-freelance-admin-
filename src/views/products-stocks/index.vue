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
                        v-if="userRole?.role !== 'market_owner' && hasPermission('products', 'add')"
                        class="text-white bg-[#3b5998] hover:bg-[#3b5998]/90 focus:ring-4 focus:outline-none focus:ring-[#3b5998]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2">
                        <iconify-icon icon="ic:baseline-plus" width="24" height="24"></iconify-icon>
                        {{ $t('btn.add_product') }}
                    </router-link>

                    <!-- product-form-dialog component -->
                    <product-form-dialog :is-dialog-open="isDialogOpen" :product-id="selectedProductId"
                        @close="handleDialogClose" @success="handleProductSuccess" />
                </div>
            </div>

            <div class="flex justify-start pb-4 mb-4" v-if="!showSkeleton">
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
                    <table class="w-full text-sm text-gray-500 table-auto text-start">
                        <thead class="text-xs text-gray-700 capitalize bg-gray-50">
                            <tr>
                                <th scope="col" class="w-[4%] px-6 py-3">
                                    <input type="checkbox" v-model="selectAll"
                                        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500">
                                </th>
                                <th scope="col" class="w-[4%] px-6 py-3">
                                    #
                                </th>
                                <th scope="col" class="w-[8%] px-6 py-3 whitespace-nowrap">
                                    {{ $t('dashboard.product_img') }}
                                </th>
                                <th scope="col" class="w-[17%] px-6 py-3 whitespace-nowrap">
                                    {{ $t('dashboard.product_name') }}
                                </th>
                                <th scope="col" class="w-[10%] px-6 py-3 whitespace-nowrap">
                                    {{ $t('dashboard.category') }}
                                </th>
                                <th scope="col" class="w-[10%] px-6 py-3 whitespace-nowrap">
                                    {{ $t('dashboard.product_code') }}
                                </th>
                                <th scope="col" class="w-[20%] px-6 py-3 whitespace-nowrap">
                                    {{ $t('dashboard.target_market') }}
                                </th>
                                <th scope="col" class="w-[10%] px-6 py-3 whitespace-nowrap">
                                    {{ $t('dashboard.price') }}
                                </th>
                                <th scope="col" class="w-[8%] px-6 py-3 whitespace-nowrap">
                                    {{ $t('dashboard.discount') }}
                                </th>
                                <th scope="col" class="w-[12%] px-6 py-3 whitespace-nowrap">
                                    {{ $t('dashboard.commission') }}
                                </th>
                                <th scope="col" class="w-[8%] px-6 py-3 whitespace-nowrap">
                                    {{ $t('dashboard.hot_deal') }}
                                </th>
                                <th scope="col" class="w-[12%] px-6 py-3 whitespace-nowrap">
                                    {{ $t('dashboard.availability') }}
                                </th>
                                <th scope="col" class="w-[6%] px-6 py-3">
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
                                <td class="px-6 py-4">
                                    <input type="checkbox" v-model="selectedProducts" :value="product.id"
                                        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500">
                                </td>
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
                                    {{ product.categoryId ? (locale === 'ar' ?
                                        categoriesStore.getCategoryById(product.categoryId)?.titleAr :
                                        categoriesStore.getCategoryById(product.categoryId)?.title) :
                                        $t('dashboard.no_category') }}
                                </td>
                                <td class="px-6 py-4 font-semibold whitespace-nowrap">
                                    {{ product.productCode }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center gap-2">
                                        <img src="/ksa-flag.svg" alt="ksa-flag" class="w-5 h-4"
                                            v-if="product.targetMarket === 'Saudi Arabia'">
                                        <img src="/egypt-flag.svg" alt="egypt-flag" class="w-5 h-4"
                                            v-else-if="product.targetMarket === 'Egypt'">
                                        <div class="flex items-center justify-center gap-2" v-else>
                                            <img src="/ksa-flag.svg" alt="ksa-flag" class="w-5 h-4">
                                            <img src="/egypt-flag.svg" alt="egypt-flag" class="w-5 h-4" />
                                        </div>
                                        <span v-if="product.targetMarket !== 'All'">
                                            {{ $i18n.locale ===
                                                'ar' ? product.targetMarketAr :
                                                product.targetMarket }}
                                        </span>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex flex-col">
                                        <p class="text-lg font-semibold text-gray-900">
                                            {{ $n(parseFloat(product.discountedPrice), 'currency',
                                                currencyLocale(product.targetMarket)) }}
                                        </p>
                                        <p class="text-lg text-gray-500 line-through">
                                            {{ $n(parseFloat(product.originalPrice), 'currency',
                                                currencyLocale(product.targetMarket)) }}
                                        </p>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <template v-if="product.discount > 0">
                                        {{ product.discount }}%
                                    </template>
                                    <template v-else>
                                        {{ $t('dashboard.no_discount') }}
                                    </template>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <template v-if="product.commission">
                                        {{ product.commission }}%
                                    </template>
                                    <template v-else>
                                        {{ $t('dashboard.no_commission') }}
                                    </template>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center">
                                        <div v-if="product.isHotDeal" class="flex items-center text-red-600">
                                            <iconify-icon icon="material-symbols:local-fire-department" width="24"
                                                height="24" />
                                        </div>
                                        <div v-else class="flex items-center text-gray-400">
                                            <iconify-icon icon="material-symbols:thermostat" width="24" height="24" />
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <template v-if="product.numberOfStock > 0 && product.availability === 'in_stock'">
                                        <span class="font-semibold text-blue-700">{{ product.numberOfStock }}</span> {{
                                            $t('dashboard.pieces') }}
                                    </template>
                                    <template v-else>
                                        <span class="font-semibold text-red-700">{{ $t('dashboard.out_of_stock')
                                            }}</span>
                                    </template>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex gap-3">
                                        <div v-if="userRole?.role === 'market_owner'" class="flex items-center gap-1">
                                            <!-- Loading State -->
                                            <button v-if="loadingProductId === product.id"
                                                class="flex items-center gap-1 font-semibold text-green-600 hover:text-green-700 hover:underline"
                                                disabled>
                                                <iconify-icon icon="line-md:loading-loop" width="20" height="20"
                                                    class="text-green-600" />
                                                {{ $t('btn.order_now') }}
                                            </button>

                                            <!-- Completed State with Check and Close Icons -->
                                            <template v-else-if="completedProductIds.has(product.id)">
                                                <div class="flex items-center justify-center space-s-4">
                                                    <button @click.stop="handleCloseClick(product)"
                                                        class="flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-700"
                                                        data-tooltip-target="tooltip-order-now">
                                                        <iconify-icon icon="material-symbols:edit-square" width="20"
                                                            height="20" />
                                                    </button>
                                                    <div id="tooltip-order-now" role="tooltip"
                                                        class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-xs opacity-0 tooltip dark:bg-gray-700">
                                                        {{ $t('tooltip.order_now') }}
                                                        <div class="tooltip-arrow" data-popper-arrow></div>
                                                    </div>

                                                    <iconify-icon icon="material-symbols:check-circle" width="20"
                                                        height="20" class="text-green-600" />

                                                    <button @click.stop="resetOrderButton(product.id)"
                                                        class="flex items-center gap-1 font-semibold text-gray-600 hover:text-gray-700"
                                                        data-tooltip-target="tooltip-cancel-order">
                                                        <iconify-icon icon="material-symbols:close" width="20"
                                                            height="20" />
                                                    </button>
                                                    <div id="tooltip-cancel-order" role="tooltip"
                                                        class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-xs opacity-0 tooltip dark:bg-gray-700">
                                                        {{ $t('tooltip.cancel_order') }}
                                                        <div class="tooltip-arrow" data-popper-arrow></div>
                                                    </div>
                                                </div>
                                            </template>

                                            <!-- Initial State -->
                                            <button v-else role="button" @click.stop="openOrderDialog(product)"
                                                class="flex items-center gap-1 font-semibold text-green-600 hover:text-green-700 hover:underline">
                                                <iconify-icon icon="material-symbols:shopping-cart-checkout" width="20"
                                                    height="20" />
                                                {{ $t('btn.order_now') }}
                                            </button>
                                        </div>
                                        <div class="flex items-center justify-center px-6 py-4 space-s-5">
                                            <button role="button" @click.stop="openEditDialog(product.id)"
                                                v-if="hasPermission('products', 'edit')"
                                                class="flex items-center justify-center font-medium text-blue-600 hover:text-blue-800"
                                                data-tooltip-target="tooltip-edit-product">
                                                <iconify-icon icon="material-symbols:edit" width="24" height="24" />
                                            </button>
                                            <div id="tooltip-edit-product" role="tooltip"
                                                class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-xs opacity-0 tooltip dark:bg-gray-700">
                                                {{ $t('tooltip.edit_product') }}
                                                <div class="tooltip-arrow" data-popper-arrow></div>
                                            </div>

                                            <button role="button"
                                                v-if="userRole?.role === 'admin' || hasPermission('products', 'delete')">
                                                <span class="flex items-center font-semibold text-red-600"
                                                    @click.stop="openDeleteDialog(product)"
                                                    data-tooltip-target="tooltip-delete-product">
                                                    <iconify-icon icon="material-symbols:delete" width="20" height="20"
                                                        class="me-1"></iconify-icon>
                                                </span>
                                            </button>
                                            <div id="tooltip-delete-product" role="tooltip"
                                                class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-xs opacity-0 tooltip dark:bg-gray-700">
                                                {{ $t('tooltip.delete_product') }}
                                                <div class="tooltip-arrow" data-popper-arrow></div>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                            </tr>

                            <!-- delete-dialog component -->
                            <delete-dialog v-model="showDeleteDialog"
                                :message="$t('dashboard.delete_confirmation_product')" @confirm="handleDelete" />

                            <!-- order-now-dialog component -->
                            <order-now-dialog v-model:isDialogOpen="showOrderDialog" :product="selectedProduct"
                                @order-placed="handleOrderPlaced" />
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
const merchantsOrdersStore = useMerchantsOrdersStore()
const productStore = useProductsStore();
const categoriesStore = useCategoriesStore();
const { t, locale } = useI18n()
const { userRole } = useUserRole()
const { showToast, toastMessage, toastType, toastIcon, triggerToast } = useToast();
const showSkeleton = ref(true);

onMounted(async () => {
    const startTime = Date.now();
    showSkeleton.value = true;
    try {
        // First fetch categories
        await categoriesStore.fetchCategories();
        // Then fetch products
        await productStore.fetchProducts();
        // Then initialize merchant store if user is a market owner
        if (userRole?.role === 'market_owner') {
            await merchantsOrdersStore.initializeStore({
                role: userRole.role,
                email: userRole.email
            });
        }
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

const selectedProducts = ref([]);
const allSelected = ref(false);

// Add these computed properties
const selectAll = computed({
    get: () => allSelected.value,
    set: (value) => {
        allSelected.value = value;
        if (value) {
            const pageIds = productStore.paginatedProducts.map(p => p.id);
            selectedProducts.value = [...new Set([...selectedProducts.value, ...pageIds])];
        } else {
            const pageIds = productStore.paginatedProducts.map(p => p.id);
            selectedProducts.value = selectedProducts.value.filter(id => !pageIds.includes(id));
        }
    }
});

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
            label: t('dashboard.product_code'),
            key: "productCode",
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
            key: "discount",
            mapper: (item) => item.discount ? `${item.discount}%` : t('dashboard.no_discount')
        },
        {
            label: t('dashboard.commission'),
            key: "Commission",
            mapper: (item) => item.commission ? `${item.commission}%` : t('dashboard.no_commission')
        },
        {
            label: t('dashboard.hot_deal'),
            key: "isHotDeal",
            mapper: (item) => item.isHotDeal ? t('dashboard.hot_deal') : t('dashboard.regular_product')
        },
        {
            label: t('dashboard.availability'),
            key: "numberOfStock"
        }
    ],
    columnWidths: [5, 15, 25, 20, 15, 15, 15, 15, 10]
});

const handleExport = () => {
    const dataToExport = selectedProducts.value.length > 0
        ? productStore.products.filter(p => selectedProducts.value.includes(p.id))
        : productStore.products;
    exportDataToExcel(dataToExport, excelConfig.value);
    // Clear selection after export if needed
    selectedProducts.value = [];
};

const authStore = useAuthStore();
const user = computed(() => authStore.user);

//usePermissions composables
const { hasPermission } = usePermissions(user);

const showOrderDialog = ref(false)
const selectedProduct = ref(null)
const loadingProductId = ref(null)
const completedProductIds = ref(new Set())

const openOrderDialog = (product) => {
    if (!product) return
    loadingProductId.value = product.id
    triggerToast({
        message: t('toast.product_selected'),
        type: 'info',
        icon: 'material-symbols:info'
    })
    setTimeout(() => {
        loadingProductId.value = null
        completedProductIds.value.add(product.id)
    }, 3000)
}

const handleCloseClick = (product) => {
    selectedProduct.value = product
    showOrderDialog.value = true
}

const resetOrderButton = (productId) => {
    completedProductIds.value.delete(productId)
}

const handleOrderPlaced = async (orderData) => {
    try {
        // Ensure orderData exists
        if (!orderData) {
            throw new Error('Order data is required');
        }
        // Access the value of the computed ref
        const currentUserRole = userRole.value;
        // console.log('Current userRole value:', currentUserRole);
        // console.log('Order data before adding role:', orderData);
        if (!currentUserRole) {
            throw new Error('User role information is missing');
        }
        // Get user data from localStorage
        const userData = localStorage.getItem('user');
        if (!userData) {
            throw new Error('User data not found in localStorage');
        }
        const user = JSON.parse(userData);
        if (!user.uid) {
            throw new Error('User ID is missing from localStorage');
        }
        // Create a clean order object with only the necessary fields
        const orderWithRole = {
            ...orderData,
            merchantId: user.uid, // Set merchantId from localStorage
            merchantEmail: currentUserRole.email,
            merchantName: currentUserRole.name
        };
        // console.log('Order data with role:', orderWithRole);
        const result = await merchantsOrdersStore.createMerchantOrder(orderWithRole);
        if (result.success) {
            triggerToast({
                message: t('toast.order_created_successfully'),
                type: 'success',
                icon: 'material-symbols:check-circle'
            });
            // Reset UI states
            showOrderDialog.value = false;
            selectedProduct.value = null;
            // Refresh the products list to update stock numbers
            await productStore.fetchProducts();
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        console.error('Error creating order:', error);
        triggerToast({
            message: error.message || t('toast.order_creation_failed'),
            type: 'error',
            icon: 'material-symbols:error'
        });
    }
};

const skeletonHeaders = [
    { label: '#', loaderWidth: 'w-8' },
    { label: 'Product Image', type: 'image' },
    { label: 'Product Name', loaderWidth: 'w-32' },
    { label: 'Category', loaderWidth: 'w-24' },
    { label: 'Product code', loaderWidth: 'w-24' },
    { label: 'Target Market', loaderWidth: 'w-24' },
    { label: 'Price', loaderWidth: 'w-24' },
    { label: 'Discount', loaderWidth: 'w-24' },
    { label: 'Commission', loaderWidth: 'w-24' },
    { label: 'Hot Deal', loaderWidth: 'w-24' },
    { label: 'Availability', loaderWidth: 'w-24' },
    { label: 'Actions', type: 'action' }
];
</script>