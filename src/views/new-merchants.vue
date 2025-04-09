<template>
    <div>
        <div v-flowbite>
            <div class="flex items-center justify-between my-10 flex-nowrap">
                <p class="text-3xl font-semibold text-gray-700">Merchants</p>
                <div class="flex items-center justify-center gap-4">
                    <select v-model="newMerchantStore.selectedStatus"
                        @change="newMerchantStore.setStatusFilter(newMerchantStore.selectedStatus)"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5">
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>
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
                            placeholder="Search for merchants...">
                    </div>
                </div>

                <table class="w-full text-sm text-gray-500 text-start">
                    <thead class="text-xs text-gray-700 capitalize bg-gray-50">
                        <tr>
                            <th scope="col" class="px-6 py-3">#</th>
                            <th scope="col" class="px-6 py-3">Merchant Logo</th>
                            <th scope="col" class="px-6 py-3">Merchant Name</th>
                            <th scope="col" class="px-6 py-3">Email</th>
                            <th scope="col" class="px-6 py-3">Username</th>
                            <th scope="col" class="px-6 py-3">Merchant ID</th>
                            <th scope="col" class="px-6 py-3">Status</th>
                            <th scope="col" class="px-6 py-3"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="bg-white border-b border-gray-200 hover:bg-gray-50"
                            v-for="(merchant, index) in newMerchantStore.paginatedMerchants" :key="merchant.id">
                            <td class="w-4 p-4">
                                <div class="flex items-center">
                                    {{ (newMerchantStore.currentPage - 1) * newMerchantStore.merchantsPerPage + index +
                                    1 }}
                                </div>
                            </td>
                            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                <img :src="merchant.imageUrl || '/default-market.png'" alt="merchant-logo"
                                    class="object-cover w-12 h-12 rounded-lg">
                            </th>
                            <td class="px-6 py-4">{{ merchant.name }}</td>
                            <td class="px-6 py-4">{{ merchant.email }}</td>
                            <td class="px-6 py-4">{{ merchant.username }}</td>
                            <td class="px-6 py-4">{{ merchant.marketId }}</td>
                            <td class="px-6 py-4">
                                <span :class="{
                                    'px-2.5 py-0.5 rounded-full text-xs font-medium': true,
                                    'bg-yellow-100 text-yellow-800': merchant.status === 'pending',
                                    'bg-green-100 text-green-800': merchant.status === 'approved',
                                    'bg-red-100 text-red-800': merchant.status === 'rejected'
                                }">
                                    {{ merchant.status }}
                                </span>
                            </td>
                            <td class="px-6 py-4">
                                <div class="flex gap-4" v-if="merchant.status === 'pending'">
                                    <button @click="handleAccept(merchant.id)"
                                        class="font-medium text-blue-600 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                                        :disabled="loadingMerchant === merchant.id">
                                        <span v-if="loadingMerchant === merchant.id && loadingAction === 'accept'"
                                            class="flex items-center">
                                            <iconify-icon icon="line-md:loading-loop" width="20" height="20"
                                                class="me-1"></iconify-icon>
                                            Accepting...
                                        </span>
                                        <span v-else>Accept</span>
                                    </button>
                                    <button @click="handleReject(merchant.id)"
                                        class="font-medium text-red-600 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                                        :disabled="loadingMerchant === merchant.id">
                                        <span v-if="loadingMerchant === merchant.id && loadingAction === 'reject'"
                                            class="flex items-center">
                                            <iconify-icon icon="line-md:loading-loop" width="20" height="20"
                                                class="me-1"></iconify-icon>
                                            Rejecting...
                                        </span>
                                        <span v-else>Reject</span>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- pagination -->
            <div class="flex items-end justify-end mt-12">
                <div class="flex items-center px-4 py-3" v-if="newMerchantStore.paginatedMerchants.length > 0">
                    <div class="flex mt-3 space-s-1 ms-auto">
                        <button role="button" @click="newMerchantStore.changePage(newMerchantStore.currentPage - 1)"
                            :disabled="newMerchantStore.currentPage === 1"
                            class="flex items-center justify-center bg-gray-100 rounded-md shrink-0 w-9 h-9 disabled:opacity-50">
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
import { ref, onMounted } from 'vue';
import { useNewMerchantStore } from '@/stores/newMerchantStore';

const newMerchantStore = useNewMerchantStore();
const loadingMerchant = ref(null);
const loadingAction = ref(null);

const handleAccept = async (merchantId) => {
    loadingMerchant.value = merchantId;
    loadingAction.value = 'accept';
    try {
        await newMerchantStore.acceptMerchant(merchantId);
    } finally {
        loadingMerchant.value = null;
        loadingAction.value = null;
    }
};

const handleReject = async (merchantId) => {
    loadingMerchant.value = merchantId;
    loadingAction.value = 'reject';
    try {
        await newMerchantStore.rejectMerchant(merchantId);
    } finally {
        loadingMerchant.value = null;
        loadingAction.value = null;
    }
};

onMounted(() => {
    newMerchantStore.fetchAllMerchants();
});
</script>