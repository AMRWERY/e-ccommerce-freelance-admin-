<template>
    <div>
        <div v-flowbite>
            <div class="flex items-center justify-between my-10 flex-nowrap">
                <p class="text-3xl font-semibold text-gray-700">Products</p>
                <div class="flex items-center justify-center gap-4">
                    <button @click="exportToExcel" data-tooltip-target="tooltip-default" data-tooltip-placement="bottom"
                        class="inline-flex items-center px-5 py-2.5 text-blue-700 border border-blue-700 rounded-lg hover:bg-blue-100">
                        <iconify-icon icon="tabler:file-excel" width="24" height="24"></iconify-icon>
                    </button>
                    <div id="tooltip-default" role="tooltip"
                        class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-xs opacity-0 tooltip dark:bg-gray-700">
                        Export Excel
                        <div class="tooltip-arrow" data-popper-arrow></div>
                    </div>

                    <!-- product-form-dialog component -->
                    <product-form-dialog  />
                </div>
            </div>
            <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
                <div class="flex justify-end pb-4">
                    <label for="table-search" class="sr-only">Search</label>
                    <div class="relative mt-1">
                        <div class="absolute inset-y-0 flex items-center pointer-events-none end-0 pe-3">
                            <iconify-icon icon="material-symbols-light:search" width="20" height="20"
                                class="text-gray-500" aria-hidden="true"></iconify-icon>
                        </div>
                        <input type="text" id="table-search"
                            class="block pt-2 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Search for items...">
                    </div>
                </div>

                <table class="w-full text-sm text-gray-500 text-start">
                    <thead class="text-xs text-gray-700 capitalize bg-gray-50">
                        <tr>
                            <th scope="col" class="px-6 py-3">
                                #
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Product name
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Color
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Category
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Price
                            </th>
                            <th scope="col" class="px-6 py-3">
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="bg-white border-b border-gray-200 hover:bg-gray-50" v-for="product in products"
                            :key="product.id">
                            <td class="w-4 p-4">
                                <div class="flex items-center">
                                    {{ product.id }}
                                </div>
                            </td>
                            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                {{ product.name }}
                            </th>
                            <td class="px-6 py-4">
                                {{ product.color }}
                            </td>
                            <td class="px-6 py-4">
                                {{ product.category }}
                            </td>
                            <td class="px-6 py-4">
                                ${{ product.price }}
                            </td>
                            <td class="flex items-center justify-center px-6 py-4 space-s-4">
                                <router-link to="" role="button"
                                    class="font-medium text-blue-600 hover:underline">Edit</router-link>
                                <router-link to="" role="button" @click="openDeleteDialog(product.id)"
                                    class="font-medium text-red-600">
                                    <iconify-icon icon="material-symbols:delete-forever" width="24"
                                        height="24"></iconify-icon>
                                </router-link>
                            </td>
                        </tr>

                        <!-- delete-dialog component -->
                        <delete-dialog v-model="showDeleteDialog"
                            :message="`You are about to delete product #${selectedProductId}. This action cannot be undone.`"
                            @confirm="handleDelete" />
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup>
const products = ref([
    {
        id: 1,
        name: 'Microsoft Surface Pro',
        color: 'White',
        category: 'Laptop PC',
        price: 1999
    },
    {
        id: 2,
        name: 'MacBook Pro',
        color: 'Space Gray',
        category: 'Laptop',
        price: 2499
    }
]);

const showDeleteDialog = ref(false);
const selectedProductId = ref(null);

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