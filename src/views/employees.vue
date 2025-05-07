<template>
    <div>
        <div>
            <div class="flex items-center justify-between my-10 flex-nowrap">
                <p class="text-3xl font-semibold text-gray-700">{{ $t('dashboard.employees') }}</p>
                <div class="flex items-center justify-center gap-4 ms-auto" v-if="!showSkeleton">
                    <!-- permissions-dialog  component -->
                    <permissions-dialog v-model:isDialogOpen="showPermissionsDialog" :user-id="selectedEmployeeId"
                        @saved="handlePermissionsSaved" />
                </div>

                <button @click="openAddDialog" v-if="!showSkeleton"
                    class="text-white bg-[#3b5998] hover:bg-[#3b5998]/90 focus:ring-4 focus:outline-none focus:ring-[#3b5998]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2">
                    <iconify-icon icon="ic:baseline-plus" width="24" height="24" class="me-2"></iconify-icon>
                    {{ $t('btn.add_employee') }}
                </button>

                <!-- add-employee component -->
                <add-employee v-model="showAddDialog" @success="handleEmployeeAdded" />
            </div>

            <div class="flex justify-start pb-4 mb-4" v-if="!showSkeleton">
                <label for="table-search" class="sr-only">Search</label>
                <div class="relative mt-1">
                    <div class="absolute inset-y-0 flex items-center pointer-events-none end-0 pe-3">
                        <iconify-icon icon="material-symbols-light:search" width="20" height="20"
                            class="text-gray-500"></iconify-icon>
                    </div>
                    <input type="text" id="table-search" v-model="searchEmployee"
                        class="block pt-2 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                        :placeholder="$t('form.search_for_employee')">
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
                                    {{ $t('dashboard.employee_name') }}
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    {{ $t('dashboard.employee_email') }}
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    {{ $t('dashboard.created_at') }}
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    {{ $t('dashboard.status') }}
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    {{ $t('dashboard.permissions') }}
                                </th>
                                <th scope="col" class="px-6 py-3">
                                </th>
                            </tr>
                        </thead>

                        <tbody v-if="employeesStore.paginatedEmployees.length === 0">
                            <tr>
                                <td colspan="10" class="p-4 text-center">
                                    <!-- NoDataMessage component -->
                                    <No-data-message :message="$t('no_data.no_employees_found')"
                                        icon="mdi:person-group" />
                                </td>
                            </tr>
                        </tbody>

                        <tbody>
                            <tr class="bg-white border-b border-gray-200 hover:bg-gray-50"
                                v-for="(employee, index) in employeesStore.paginatedEmployees" :key="employee.id">
                                <td class="w-4 p-4">
                                    <div class="flex items-center">
                                        {{ (employeesStore.currentPage -
                                            1) *
                                            employeesStore.employeesPerPage +
                                            index +
                                            1 }}
                                    </div>
                                </td>
                                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                    {{ employee.firstName }} {{ employee.lastName }}
                                </th>
                                <td class="px-6 py-4">
                                    {{ employee.email }}
                                </td>
                                <td class="px-6 py-4">
                                    {{ formatDate(employee.createdAt) }}
                                </td>
                                <td class="px-6 py-4">
                                    <div class="inline-flex px-3 py-1 text-xs font-medium rounded-full" :class="{
                                        'bg-green-100 text-green-800': !employee.isBlocked,
                                        'bg-red-100 text-red-800': employee.isBlocked
                                    }">
                                        <span class="inline-flex items-center">
                                            <iconify-icon :icon="employee.isBlocked ? 'mdi:cancel' : 'mdi:check-circle'"
                                                width="24" height="24" class="me-1.5"></iconify-icon>
                                            {{ employee.isBlocked ? $t('dashboard.blocked') : $t('dashboard.active') }}
                                        </span>
                                    </div>
                                </td>
                                <td class="px-6 py-4">
                                    <router-link to="" role="button" class="font-medium text-blue-600 hover:underline"
                                        @click="openPermissionsDialog(employee)">
                                        <iconify-icon icon="line-md:loading-loop" width="20" height="20"
                                            v-if="isEditing(employee.id)"></iconify-icon>
                                        <span v-else>{{ $t('btn.edit') }}</span>
                                    </router-link>
                                </td>
                                <td class="p-4">
                                    <div class="flex items-center justify-center space-s-5" v-flowbite>
                                        <button @click="toggleBlockEmployee(employee.id)"
                                            v-if="hasPermission('employees', 'block') || hasPermission('employees', 'unblock')"
                                            class="flex items-center justify-center w-8 h-8 rounded"
                                            :class="employee.isBlocked ? 'text-green-500 hover:text-green-700' : 'text-yellow-500 hover:text-yellow-600'"
                                            data-tooltip-target="tooltip-block-employee">
                                            <div v-if="blockingEmployee === employee.id"
                                                class="flex items-center justify-center">
                                                <iconify-icon icon="line-md:loading-loop" width="20" height="20"
                                                    class="me-1"></iconify-icon>
                                            </div>
                                            <iconify-icon :icon="employee.isBlocked ? 'mdi:cancel' : 'mdi:check-circle'"
                                                width="24" height="24" class="me-1.5" v-else></iconify-icon>
                                        </button>
                                        <div id="tooltip-block-employee" role="tooltip"
                                            class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-xs opacity-0 tooltip dark:bg-gray-700">
                                            {{ employee.isBlocked ? $t('tooltip.unblock') : $t('tooltip.block') }}
                                            <div class="tooltip-arrow" data-popper-arrow></div>
                                        </div>

                                        <button @click.stop="openDeleteDialog(employee)"
                                            v-if="hasPermission('employees', 'delete')"
                                            class="flex items-center justify-center w-8 h-8 text-red-500 rounded hover:text-red-600"
                                            data-tooltip-target="tooltip-delete-employee">
                                            <iconify-icon icon="line-md:loading-loop" width="20" height="20"
                                                class="text-red-500"
                                                v-if="removingEmployee === employee.id"></iconify-icon>
                                            <iconify-icon icon="material-symbols:delete" width="20" height="20"
                                                class="me-1" v-else></iconify-icon>
                                        </button>
                                        <div id="tooltip-delete-employee" role="tooltip"
                                            class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-xs opacity-0 tooltip dark:bg-gray-700">
                                            {{ $t('tooltip.delete_employee') }}
                                            <div class="tooltip-arrow" data-popper-arrow></div>
                                        </div>
                                    </div>
                                </td>
                            </tr>

                            <!-- delete-dialog component -->
                            <delete-dialog v-model="showDeleteDialog"
                                :message="$t('dashboard.delete_confirmation_employee')"
                                @confirm="removeEmployee(selectedEmployeeId)" />
                        </tbody>
                    </table>
                </template>
            </div>

            <!-- paginationControls component -->
            <pagination-controls v-if="!showSkeleton && employeesStore.paginatedEmployees.length > 0"
                :current-page="employeesStore.currentPage" :total-pages="employeesStore.totalPages"
                @page-change="employeesStore.changePage" />
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
const employeesStore = useEmployeesStore()
const { showToast, toastMessage, toastType, toastIcon, triggerToast } = useToast();
const showSkeleton = ref(true);
const removingEmployee = ref(null);
const blockingEmployee = ref(null);
const showDeleteDialog = ref(false);
const selectedEmployeeId = ref(null);
const deletingEmployees = ref({});
const showPermissionsDialog = ref(false);
const editingUserId = ref(null);
const showAddDialog = ref(false);

const openAddDialog = () => {
    showAddDialog.value = true;
};

const handleEmployeeAdded = () => {
    employeesStore.fetchEmployees();
};

onMounted(async () => {
    const startTime = Date.now();
    await employeesStore.fetchEmployees()
    const elapsed = Date.now() - startTime;
    const remaining = Math.max(3000 - elapsed, 0);
    setTimeout(() => {
        showSkeleton.value = false;
    }, remaining);
})

const searchEmployee = computed({
    get: () => employeesStore.searchEmployeesByEmail,
    set: (value) => employeesStore.setSearchTerm(value)
});

const removeEmployee = async (userId) => {
    if (!userId) return;
    try {
        deletingEmployees.value[userId] = true;
        await employeesStore.deleteEmployees(userId);
        triggerToast({
            message: t('toast.employee_deleted_successfully'),
            type: 'success',
            icon: 'mdi-check-circle',
        });
        await employeesStore.fetchEmployees();
    } catch (error) {
        console.error("Error removing employee:", error);
        triggerToast({
            message: t('toast.failed_to_delete_employee'),
            type: 'error',
            icon: 'mdi:alert-circle',
        });
    } finally {
        deletingEmployees.value[userId] = false;
        selectedEmployeeId.value = null;
        showDeleteDialog.value = false;
    }
};

const toggleBlockEmployee = (userId) => {
    if (!userId) return;
    blockingEmployee.value = userId;
    setTimeout(() => {
        employeesStore.toggleBlockEmployee(userId)
            .then(() => {
                const user = employeesStore.paginatedEmployees.find(u => u.id === userId);
                const message = user?.isBlocked
                    ? t('toast.employee_blocked_successfully')
                    : t('toast.employee_unblocked_successfully');
                triggerToast({
                    message,
                    type: 'success',
                    icon: 'mdi-check-circle',
                });
            })
            .catch((error) => {
                console.error("Error toggling user block status:", error);
                triggerToast({
                    message: t('toast.failed_to_update_employee'),
                    type: 'error',
                    icon: 'mdi:alert-circle',
                });
            })
            .finally(() => {
                blockingEmployee.value = null;
            });
    }, 3000);
};

const openDeleteDialog = (user) => {
    selectedEmployeeId.value = user.id;
    showDeleteDialog.value = true;
};

const formatDate = (date) => {
    if (!date) return '';
    // Handle Firestore Timestamp
    const jsDate = date?.toDate ? date.toDate() : new Date(date);
    return `${jsDate.getDate()}/${jsDate.getMonth() + 1}/${jsDate.getFullYear()}`;
};

const isEditing = (userId) => editingUserId.value === userId;

const openPermissionsDialog = (employee) => {
    editingUserId.value = employee.id,
        setTimeout(() => {
            selectedEmployeeId.value = employee.id
            showPermissionsDialog.value = true
            editingUserId.value = null
        }, 3000)
}

const handlePermissionsSaved = () => {
    employeesStore.fetchEmployees();
    triggerToast({
        message: t('toast.permissions_updated_successfully'),
        type: 'success',
        icon: 'mdi-check-circle',
    });
};
const authStore = useAuthStore();
const user = computed(() => authStore.user);

//usePermissions composables
const { hasPermission } = usePermissions(user);

const skeletonHeaders = [
    { label: '#', loaderWidth: 'w-8' },
    { label: 'Employee Name', loaderWidth: 'w-32' },
    { label: 'Employee Email', loaderWidth: 'w-24' },
    { label: 'Created At', loaderWidth: 'w-24' },
    { label: 'Permissions', loaderWidth: 'w-24' },
    { label: 'Actions', type: 'action' }
];
</script>