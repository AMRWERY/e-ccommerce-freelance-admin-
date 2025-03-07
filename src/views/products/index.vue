<template>
    <div>
        <div v-flowbite>
            <div class="flex items-center justify-between my-10 flex-nowrap">
                <p class="text-3xl font-semibold text-gray-700">Products</p>
                <router-link to="/add-product" role="button"
                    class="text-white bg-[#3b5998] hover:bg-[#3b5998]/90 focus:ring-4 focus:outline-none focus:ring-[#3b5998]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#3b5998]/55 me-2 mb-2">
                    <iconify-icon icon="ic:baseline-plus" width="24" height="24" aria-hidden="true"></iconify-icon>
                    Add Product
                </router-link>
            </div>
            <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
                <div class="pb-4 bg-white">
                    <label for="table-search" class="sr-only">Search</label>
                    <div class="relative mt-1">
                        <div class="absolute inset-y-0 flex items-center pointer-events-none start-0 ps-3">
                            <iconify-icon icon="material-symbols-light:search" width="24" height="24"
                                class="text-gray-500" aria-hidden="true"></iconify-icon>
                        </div>
                        <input type="text" id="table-search"
                            class="block pt-2 text-sm text-gray-900 border border-gray-300 rounded-lg ps-10 w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Search for items">
                    </div>
                </div>
                <table class="w-full text-sm text-gray-500 text-start">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50">
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
                        <tr class="bg-white border-b border-gray-200 hover:bg-gray-50">
                            <td class="w-4 p-4">
                                <div class="flex items-center">
                                    1
                                </div>
                            </td>
                            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                Apple MacBook Pro 17"
                            </th>
                            <td class="px-6 py-4">
                                Silver
                            </td>
                            <td class="px-6 py-4">
                                Laptop
                            </td>
                            <td class="px-6 py-4">
                                $2999
                            </td>
                            <td class="px-6 py-4">
                                <router-link to="/edit-product/1"
                                    class="font-medium text-blue-600 hover:underline">Edit</router-link>
                            </td>
                        </tr>
                        <tr class="bg-white border-b border-gray-200 hover:bg-gray-50">
                            <td class="w-4 p-4">
                                <div class="flex items-center">
                                    2
                                </div>
                            </td>
                            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                Microsoft Surface Pro
                            </th>
                            <td class="px-6 py-4">
                                White
                            </td>
                            <td class="px-6 py-4">
                                Laptop PC
                            </td>
                            <td class="px-6 py-4">
                                $1999
                            </td>
                            <td class="px-6 py-4">
                                <router-link to="/edit-product/2"
                                    class="font-medium text-blue-600 hover:underline">Edit</router-link>
                            </td>
                        </tr>
                        <tr class="bg-white border-b border-gray-200 hover:bg-gray-50">
                            <td class="w-4 p-4">
                                <div class="flex items-center">
                                    3
                                </div>
                            </td>
                            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                Magic Mouse 2
                            </th>
                            <td class="px-6 py-4">
                                Black
                            </td>
                            <td class="px-6 py-4">
                                Accessories
                            </td>
                            <td class="px-6 py-4">
                                $99
                            </td>
                            <td class="px-6 py-4">
                                <router-link to="/edit-product/3"
                                    class="font-medium text-blue-600 hover:underline">Edit</router-link>
                            </td>
                        </tr>
                        <tr class="bg-white border-b border-gray-200 hover:bg-gray-50">
                            <td class="w-4 p-4">
                                <div class="flex items-center">
                                    4
                                </div>
                            </td>
                            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                Apple Watch
                            </th>
                            <td class="px-6 py-4">
                                Silver
                            </td>
                            <td class="px-6 py-4">
                                Accessories
                            </td>
                            <td class="px-6 py-4">
                                $179
                            </td>
                            <td class="px-6 py-4">
                                <router-link to="/edit-product/4"
                                    class="font-medium text-blue-600 hover:underline">Edit</router-link>
                            </td>
                        </tr>
                        <tr class="bg-white border-b border-gray-200 hover:bg-gray-50">
                            <td class="w-4 p-4">
                                <div class="flex items-center">
                                    5
                                </div>
                            </td>
                            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                iPad
                            </th>
                            <td class="px-6 py-4">
                                Gold
                            </td>
                            <td class="px-6 py-4">
                                Tablet
                            </td>
                            <td class="px-6 py-4">
                                $699
                            </td>
                            <td class="px-6 py-4">
                                <router-link to="/edit-product/5"
                                    class="font-medium text-blue-600 hover:underline">Edit</router-link>
                            </td>
                        </tr>
                        <tr class="bg-white hover:bg-gray-50">
                            <td class="w-4 p-4">
                                <div class="flex items-center">
                                    6
                                </div>
                            </td>
                            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                Apple iMac 27"
                            </th>
                            <td class="px-6 py-4">
                                Silver
                            </td>
                            <td class="px-6 py-4">
                                PC Desktop
                            </td>
                            <td class="px-6 py-4">
                                $3999
                            </td>
                            <td class="px-6 py-4">
                                <router-link to="/edit-product/6"
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

</script>