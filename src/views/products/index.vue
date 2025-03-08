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

                    <router-link to="/add-product" role="button"
                        class="text-white bg-[#3b5998] hover:bg-[#3b5998]/90 focus:ring-4 focus:outline-none focus:ring-[#3b5998]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#3b5998]/55 me-2">
                        <iconify-icon icon="ic:baseline-plus" width="24" height="24" aria-hidden="true"></iconify-icon>
                        Add Product
                    </router-link>
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
                            <td class="px-6 py-4">
                                <router-link to="/edit-product/2"
                                    class="font-medium text-blue-600 hover:underline">Edit</router-link>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup>
import { utils, write } from 'xlsx';
import { saveAs } from 'file-saver';

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

const exportToExcel = () => {
    // Create header row with styling
    const header = [
        { v: '#', s: { font: { bold: true, color: { rgb: 'FFFFFF' } }, fill: { fgColor: { rgb: '4F81BD' } } } },
        { v: 'Product Name', s: { font: { bold: true, color: { rgb: 'FFFFFF' } }, fill: { fgColor: { rgb: '4F81BD' } } } },
        { v: 'Color', s: { font: { bold: true, color: { rgb: 'FFFFFF' } }, fill: { fgColor: { rgb: '4F81BD' } } } },
        { v: 'Category', s: { font: { bold: true, color: { rgb: 'FFFFFF' } }, fill: { fgColor: { rgb: '4F81BD' } } } },
        { v: 'Price', s: { font: { bold: true, color: { rgb: 'FFFFFF' } }, fill: { fgColor: { rgb: '4F81BD' } } } }
    ];

    // Create data rows with styling
    const dataRows = products.value.map(product => [
        { v: product.id, s: { alignment: { horizontal: 'center' } } },
        { v: product.name, s: { font: { name: 'Arial', sz: 12 } } },
        { v: product.color, s: { fill: { fgColor: { rgb: 'F2F2F2' } } } },
        { v: product.category },
        {
            v: product.price,
            t: 'n', // Number type
            z: '$#,##0.00', // Currency format
            s: { font: { color: { rgb: '00AA00' }, bold: true } }
        }
    ]);

    // Create worksheet
    const worksheet = utils.aoa_to_sheet([header, ...dataRows]);

    // Set column widths
    worksheet['!cols'] = [
        { wch: 5 },  // #
        { wch: 25 }, // Product Name
        { wch: 15 }, // Color
        { wch: 20 }, // Category
        { wch: 15 }  // Price
    ];

    // Create workbook
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Products");

    // Generate Excel file
    const excelBuffer = write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    saveAs(blob, 'styled_products.xlsx');
};
</script>