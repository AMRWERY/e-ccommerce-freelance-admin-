<template>
    <div>
        <div v-flowbite>
            <div class="flex items-center justify-between my-10 flex-nowrap">
                <p class="text-3xl font-semibold text-gray-700">{{ $t('dashboard.users') }}</p>
            </div>

            <div class="flex justify-start pb-4 mb-4" v-if="!showSkeleton">
                <label for="table-search" class="sr-only">Search</label>
                <div class="relative mt-1">
                    <div class="absolute inset-y-0 flex items-center pointer-events-none end-0 pe-3">
                        <iconify-icon icon="material-symbols-light:search" width="20" height="20"
                            class="text-gray-500"></iconify-icon>
                    </div>
                    <input type="text" id="table-search" v-model="searchUser"
                        class="block pt-2 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                        :placeholder="$t('form.search_for_users')">
                </div>
            </div>

            <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
                <template v-if="showSkeleton">
                    <!-- tableSkeletonLoader component -->
                    <table-skeleton-loader :headers="skeletonHeaders" :rows="4" />
                </template>

                <template v-else>
                    <table class="w-full text-sm text-gray-500 text-start">
                        <thead class="text-xs text-gray-700 capitalize bg-gray-50">
                            <tr>
                                <th scope="col" class="px-6 py-3">
                                    #
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    {{ $t('dashboard.email') }}
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    {{ $t('dashboard.name') }}
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    {{ $t('dashboard.role') }}
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    {{ $t('dashboard.status') }}
                                </th>
                                <th scope="col" class="px-6 py-3">
                                </th>
                            </tr>
                        </thead>

                        <tbody v-if="userStore.paginatedUsers.length === 0">
                            <tr>
                                <td colspan="10" class="p-4 text-center">
                                    <!-- NoDataMessage component -->
                                    <No-data-message :message="$t('no_data.no_users_found')"
                                        icon="tabler:package-off" />
                                </td>
                            </tr>
                        </tbody>

                        <tbody>
                            <tr class="bg-white border-b border-gray-200 hover:bg-gray-50"
                                v-for="(user, index) in userStore.paginatedUsers" :key="user.id">
                                <td class="w-4 p-4">
                                    <div class="flex items-center">
                                        {{ (userStore.currentPage -
                                            1) *
                                            userStore.usersPerPage +
                                            index +
                                            1 }}
                                    </div>
                                </td>
                                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                    {{ user.email }}
                                </th>
                                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                    {{ user.firstName }} {{ user.lastName }}
                                </th>
                                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                    {{ user.role }}
                                </th>
                                <td class="px-6 py-4">
                                    <div class="inline-flex px-3 py-1 text-xs font-medium rounded-full" :class="{
                                        'bg-green-100 text-green-800': !user.isBlocked,
                                        'bg-red-100 text-red-800': user.isBlocked
                                    }">
                                        <span class="inline-flex items-center">
                                            <iconify-icon :icon="user.isBlocked ? 'mdi:cancel' : 'mdi:check-circle'"
                                                width="24" height="24" class="me-1.5"></iconify-icon>
                                            {{ user.isBlocked ? $t('dashboard.blocked') : $t('dashboard.active') }}
                                        </span>
                                    </div>
                                </td>
                                <td class="p-4">
                                    <div class="flex items-center justify-center space-s-5">
                                        <button @click="toggleBlockUser(user.id)"
                                            v-if="hasPermission('users', 'block') || hasPermission('users', 'unblock')"
                                            class="flex items-center justify-center w-8 h-8 rounded"
                                            :class="user.isBlocked ? 'text-green-500 hover:text-green-700' : 'text-yellow-500 hover:text-yellow-600'"
                                            data-tooltip-target="tooltip-block">
                                            <div v-if="blockingUser === user.id"
                                                class="flex items-center justify-center">
                                                <iconify-icon icon="line-md:loading-loop" width="20" height="20"
                                                    class="me-1"></iconify-icon>
                                            </div>
                                            <iconify-icon :icon="user.isBlocked ? 'mdi:cancel' : 'mdi:check-circle'"
                                                width="24" height="24" class="me-1.5" v-else></iconify-icon>
                                        </button>
                                        <div id="tooltip-block" role="tooltip"
                                            class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-xs opacity-0 tooltip dark:bg-gray-700">
                                            {{ user.isBlocked ? $t('tooltip.unblock') : $t('tooltip.block') }}
                                            <div class="tooltip-arrow" data-popper-arrow></div>
                                        </div>

                                        <button @click.stop="openDeleteDialog(user)"
                                            v-if="hasPermission('users', 'delete')"
                                            class="flex items-center justify-center w-8 h-8 text-red-500 rounded hover:text-red-600" data-tooltip-target="tooltip-delete-user">
                                            <iconify-icon icon="line-md:loading-loop" width="20" height="20"
                                                class="text-red-500" v-if="removingUser === user.id"></iconify-icon>
                                            <iconify-icon icon="material-symbols:delete" width="20" height="20"
                                                class="me-1" v-else></iconify-icon>
                                        </button>
                                        <div id="tooltip-delete-user" role="tooltip"
                                            class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-xs opacity-0 tooltip dark:bg-gray-700">
                                            {{ $t('tooltip.delete_user') }}
                                            <div class="tooltip-arrow" data-popper-arrow></div>
                                        </div>
                                    </div>
                                </td>
                            </tr>

                            <!-- delete-dialog component -->
                            <delete-dialog v-model="showDeleteDialog"
                                :message="$t('dashboard.delete_confirmation_user')"
                                @confirm="removeUser(selectedUserId)" />
                        </tbody>
                    </table>
                </template>
            </div>

            <!-- paginationControls component -->
            <pagination-controls v-if="!showSkeleton && userStore.paginatedUsers.length > 0"
                :current-page="userStore.currentPage" :total-pages="userStore.totalPages"
                @page-change="userStore.changePage" />
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
const userStore = useUsersStore();
const showSkeleton = ref(true);
const removingUser = ref(null);
const blockingUser = ref(null);
const { showToast, toastMessage, toastType, toastIcon, triggerToast } = useToast();
const showDeleteDialog = ref(false);
const selectedUserId = ref(null);
const deletingUsers = ref({});

const removeUser = async (userId) => {
    if (!userId) return;
    try {
        deletingUsers.value[userId] = true;
        await userStore.deleteUser(userId);
        triggerToast({
            message: t('toast.user_deleted_successfully'),
            type: 'success',
            icon: 'mdi-check-circle',
        });
        await userStore.fetchUsers();
    } catch (error) {
        console.error("Error removing user:", error);
        triggerToast({
            message: t('toast.failed_to_delete_user'),
            type: 'error',
            icon: 'mdi:alert-circle',
        });
    } finally {
        deletingUsers.value[userId] = false;
        selectedUserId.value = null;
        showDeleteDialog.value = false;
    }
};

const toggleBlockUser = (userId) => {
    if (!userId) return;
    blockingUser.value = userId;
    setTimeout(() => {
        userStore.toggleBlockUser(userId)
            .then(() => {
                const user = userStore.paginatedUsers.find(u => u.id === userId);
                const message = user?.isBlocked
                    ? t('toast.user_blocked_successfully')
                    : t('toast.user_unblocked_successfully');
                triggerToast({
                    message,
                    type: 'success',
                    icon: 'mdi-check-circle',
                });
            })
            .catch((error) => {
                console.error("Error toggling user block status:", error);
                triggerToast({
                    message: t('toast.failed_to_update_user'),
                    type: 'error',
                    icon: 'mdi:alert-circle',
                });
            })
            .finally(() => {
                blockingUser.value = null;
            });
    }, 3000);
};

onMounted(async () => {
    await userStore.fetchUsers();
    setTimeout(() => {
        showSkeleton.value = false
    }, 3000)
});

const searchUser = computed({
    get: () => userStore.searchUserByEmail,
    set: (value) => userStore.setSearchTerm(value)
});

const openDeleteDialog = (user) => {
    selectedUserId.value = user.id;
    showDeleteDialog.value = true;
};

const authStore = useAuthStore();
const user = computed(() => authStore.user);

//usePermissions composables
const { hasPermission } = usePermissions(user);

const skeletonHeaders = [
    { label: '#', loaderWidth: 'w-8' },
    { label: 'Email', type: 'image' },
    { label: 'Name', loaderWidth: 'w-32' },
    { label: 'Role', loaderWidth: 'w-24' },
    { label: 'Status', loaderWidth: 'w-24' },
];
</script>