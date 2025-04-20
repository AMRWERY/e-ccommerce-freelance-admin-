<template>
    <div>
        <div v-flowbite>
            <div class="flex items-center justify-between my-10 flex-nowrap">
                <p class="text-3xl font-semibold text-gray-700">{{ $t('dashboard.merchants') }}</p>
                <div class="flex items-center justify-center gap-4" v-if="!showSkeleton">
                    <select v-model="newMerchantStore.selectedStatus"
                        @change="newMerchantStore.setStatusFilter(newMerchantStore.selectedStatus)"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 min-w-48">
                        <option value="all">{{ $t('dashboard.all_status') }}</option>
                        <option value="pending">{{ $t('dashboard.pending') }}</option>
                        <option value="approved">{{ $t('dashboard.approved') }}</option>
                        <option value="rejected">{{ $t('dashboard.rejected') }}</option>
                    </select>
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
                                <th scope="col" class="px-6 py-3">#</th>
                                <th scope="col" class="px-6 py-3">{{ $t('dashboard.merchant_logo') }}</th>
                                <th scope="col" class="px-6 py-3">{{ $t('dashboard.merchant_name') }}</th>
                                <th scope="col" class="px-6 py-3">{{ $t('dashboard.email') }}</th>
                                <th scope="col" class="px-6 py-3">{{ $t('dashboard.name') }}</th>
                                <th scope="col" class="px-6 py-3">{{ $t('dashboard.merchant_id') }}</th>
                                <th scope="col" class="px-6 py-3">{{ $t('dashboard.status') }}</th>
                                <th scope="col" class="px-6 py-3"></th>
                            </tr>
                        </thead>

                        <tbody v-if="newMerchantStore.paginatedMerchants === 0">
                            <tr>
                                <td colspan="10" class="p-4 text-center">
                                    <!-- NoDataMessage component -->
                                    <No-data-message :message="$t('no_data.no_merchants_found')"
                                        icon="mdi:shop-alert" />
                                </td>
                            </tr>
                        </tbody>

                        <tbody>
                            <tr class="bg-white border-b border-gray-200 hover:bg-gray-50"
                                v-for="(merchant, index) in newMerchantStore.paginatedMerchants" :key="merchant.id">
                                <td class="w-4 p-4">
                                    <div class="flex items-center">
                                        {{ (newMerchantStore.currentPage - 1) * newMerchantStore.merchantsPerPage +
                                            index +
                                            1 }}
                                    </div>
                                </td>
                                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                    <img :src="merchant.imageUrl || '/default-market.png'" alt="merchant-logo"
                                        class="object-cover w-12 h-12 rounded-lg">
                                </th>
                                <td class="px-6 py-4">{{ merchant.name }}</td>
                                <td class="px-6 py-4">{{ merchant.email }}</td>
                                <td class="px-6 py-4">{{ merchant.firstName }} {{ merchant.lastName }}</td>
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
                                    <div class="flex gap-3" v-if="merchant.status === 'pending'">
                                        <button @click="handleAccept(merchant.id)"
                                            v-if="hasPermission('new-merchants', 'approve')"
                                            class="font-medium text-blue-600 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                                            :disabled="loadingMerchant === merchant.id">
                                            <span v-if="loadingMerchant === merchant.id && loadingAction === 'accept'"
                                                class="flex items-center">
                                                <iconify-icon icon="line-md:loading-loop" width="20" height="20"
                                                    class="me-1"></iconify-icon>
                                            </span>
                                            <span v-else>{{ $t('btn.accept') }}</span>
                                        </button>
                                        <button @click="handleReject(merchant.id)"
                                            v-if="hasPermission('new-merchants', 'reject')"
                                            class="font-medium text-red-600 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                                            :disabled="loadingMerchant === merchant.id">
                                            <span v-if="loadingMerchant === merchant.id && loadingAction === 'reject'"
                                                class="flex items-center">
                                                <iconify-icon icon="line-md:loading-loop" width="20" height="20"
                                                    class="me-1"></iconify-icon>
                                            </span>
                                            <span v-else>{{ $t('btn.reject') }}</span>
                                        </button>
                                    </div>
                                    <button v-else-if="merchant.status === 'rejected'"
                                        v-if="hasPermission('new-merchants', 'delete')"
                                        @click="openDeleteDialog(merchant.id)"
                                        class="flex items-center font-medium text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                        :disabled="loadingMerchant === merchant.id">
                                        <span v-if="loadingMerchant === merchant.id && loadingAction === 'delete'"
                                            class="flex items-center">
                                            <iconify-icon icon="line-md:loading-loop" width="20" height="20"
                                                class="me-1"></iconify-icon>
                                        </span>
                                        <span v-else class="flex items-center"
                                            data-tooltip-target="tooltip-delete-merchant">
                                            <iconify-icon icon="material-symbols:delete" width="20" height="20"
                                                class="me-1"></iconify-icon>
                                            {{ $t('btn.delete') }}
                                        </span>
                                        <div id="tooltip-delete-merchant" role="tooltip"
                                            class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-xs opacity-0 tooltip dark:bg-gray-700">
                                            {{ $t('tooltip.delete_merchant') }}
                                            <div class="tooltip-arrow" data-popper-arrow></div>
                                        </div>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </template>
            </div>

            <!-- paginationControls component -->
            <pagination-controls v-if="!showSkeleton && newMerchantStore.paginatedMerchants.length > 0"
                :current-page="newMerchantStore.currentPage" :total-pages="newMerchantStore.totalPages"
                @page-change="newMerchantStore.changePage" />
        </div>

        <!-- delete-dialog component -->
        <delete-dialog v-model="showDeleteDialog"
            :message="`Are you sure you want to delete this merchant? This action cannot be undone.`"
            @confirm="handleDelete" />

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
const newMerchantStore = useNewMerchantStore();
const loadingMerchant = ref(null);
const loadingAction = ref(null);
const showDeleteDialog = ref(false);
const selectedMerchantId = ref(null);
const { showToast, toastMessage, toastType, toastIcon, triggerToast } = useToast();
const showSkeleton = ref(true);

const handleAccept = async (merchantId) => {
    loadingMerchant.value = merchantId;
    loadingAction.value = 'accept';
    try {
        await newMerchantStore.acceptMerchant(merchantId);
        triggerToast({
            message: t('toast.successfully_accept_merchant'),
            type: 'success',
            icon: 'material-symbols:check-circle',
        });
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
        triggerToast({
            message: t('toast.successfully_reject_merchant'),
            type: 'success',
            icon: 'material-symbols:check-circle',
        });
    } finally {
        loadingMerchant.value = null;
        loadingAction.value = null;
    }
};

const openDeleteDialog = (merchantId) => {
    selectedMerchantId.value = merchantId;
    showDeleteDialog.value = true;
};

const handleDelete = async () => {
    if (!selectedMerchantId.value) return;
    loadingMerchant.value = selectedMerchantId.value;
    loadingAction.value = 'delete';
    try {
        await newMerchantStore.deleteMerchant(selectedMerchantId.value);
        triggerToast({
            message: t('toast.successfully_delete_merchant'),
            type: 'success',
            icon: 'material-symbols:check-circle',
        });
        showDeleteDialog.value = false;
    } finally {
        loadingMerchant.value = null;
        loadingAction.value = null;
        selectedMerchantId.value = null;
    }
};

onMounted(async () => {
    const startTime = Date.now();
    try {
        await newMerchantStore.fetchAllMerchants();
    } finally {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(3000 - elapsed, 0);
        setTimeout(() => {
            showSkeleton.value = false;
        }, remaining);
    }
});

const authStore = useAuthStore();
const user = computed(() => authStore.user);

//usePermissions composables
const { hasPermission } = usePermissions(user);

const skeletonHeaders = [
    { label: '#', loaderWidth: 'w-8' },
    { label: 'Merchant Logo', type: 'image' },
    { label: 'Merchant Name', loaderWidth: 'w-32' },
    { label: 'Email', loaderWidth: 'w-24' },
    { label: 'Name', loaderWidth: 'w-24' },
    { label: 'Merchant ID', loaderWidth: 'w-24' },
    { label: 'Status', loaderWidth: 'w-24' },
    { label: 'Actions', type: 'action' }
];
</script>