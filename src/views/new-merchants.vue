<template>
    <div>
        <div v-flowbite>
            <div class="flex items-center justify-between my-10 flex-nowrap">
                <p class="text-3xl font-semibold text-gray-700">Merchants</p>
                <div class="flex items-center justify-center gap-4">
                    <!-- will handle filterations here -->
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
                                Merchant Logo
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Merchant Name
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Username
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Merchant ID
                            </th>
                            <th scope="col" class="px-6 py-3">
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="bg-white border-b border-gray-200 hover:bg-gray-50"
                            v-for="(merchant, index) in newMerchantStore.paginatedMerchants" :key="merchant.id">
                            <td class="w-4 p-4">
                                <div class="flex items-center">
                                    {{ (newMerchantStore.currentPage -
                                        1) *
                                        newMerchantStore.merchantsPerPage +
                                        index +
                                        1 }}
                                </div>
                            </td>
                            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                <img :src="merchant.imageUrl" alt="merchant-logo" class="w-12 h-12 rounded-lg">
                            </th>
                            <td class="px-6 py-4">
                                {{ merchant.name }}
                            </td>
                            <td class="px-6 py-4">
                                {{ merchant.username }}
                            </td>
                            <td class="px-6 py-4">
                                {{ merchant.marketId }}
                            </td>
                            <td class="flex items-center justify-center px-6 py-4 space-s-4">
                                <router-link to="" role="button"
                                    class="font-medium text-blue-600 hover:underline">Edit</router-link>
                                <!-- <router-link to="" role="button" @click="openDeleteDialog(merchant.id)"
                                    class="font-medium text-red-600">
                                    <iconify-icon icon="material-symbols:delete-forever" width="24"
                                        height="24"></iconify-icon>
                                </router-link> -->
                            </td>
                        </tr>

                        <!-- delete-dialog component -->
                        <!-- <delete-dialog v-model="showDeleteDialog"
                            :message="`You are about to delete product #${selectedProductId}. This action cannot be undone.`"
                            @confirm="handleDelete" /> -->
                    </tbody>
                </table>
            </div>

            <div class="mt-12">
                <!-- pagination -->
                <div class="flex items-center px-4 py-3" v-if="newMerchantStore.paginatedMerchants.length > 0">
                    <div class="flex mt-3 space-s-1 ms-auto">
                        <button role="button" @click="newMerchantStore.changePage(newMerchantStore.currentPage - 1)"
                            disabled="newMerchantStore.currentPage === 1"
                            class="flex items-center justify-center bg-gray-100 rounded-md shrink-0 w-9 h-9">
                            <iconify-icon icon="material-symbols:keyboard-arrow-left" width="24" height="24"
                                class="text-gray-400 rtl:rotate-180"></iconify-icon>
                        </button>
                        <button v-for="page in newMerchantStore.totalPages" :key="page"
                            @click="newMerchantStore.changePage(page)" :class="{
                                'bg-slate-300 text-gray-800': page === newMerchantStore.currentPage,
                                'bg-slate-100 text-gray-600': page !== newMerchantStore.currentPage,
                            }"
                            class="flex items-center justify-center shrink-0 border hover:border-blue-500 cursor-pointer text-base font-medium text-spate-900 px-[13px] h-9 rounded-md">
                            {{ page }}
                        </button>
                        <button role="button" @click="newMerchantStore.changePage(newMerchantStore.currentPage + 1)"
                            :disabled="newMerchantStore.currentPage === newMerchantStore.totalPages"
                            class="flex items-center justify-center border rounded-md cursor-pointer shrink-0 hover:border-blue-500 w-9 h-9">
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
const newMerchantStore = useNewMerchantStore()

onMounted(() => {
    newMerchantStore.fetchAllMerchants()
})
</script>