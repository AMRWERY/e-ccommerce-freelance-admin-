<template>
    <div>
        <div v-flowbite>
            <div class="flex items-center justify-between my-10 flex-nowrap">
                <p class="text-3xl font-semibold text-gray-700">{{ $t('dashboard.employees') }}</p>
                <div class="flex items-center justify-center gap-4 ms-auto" v-if="!showSkeleton">
                    <!-- product-form-dialog component -->
                    <!-- <product-form-dialog :is-dialog-open="isDialogOpen" :product-id="selectedProductId"
                        @close="handleDialogClose" @success="handleProductSuccess" /> -->
                </div>
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
                                </th>
                            </tr>
                        </thead>

                        <tbody v-if="employeesStore.paginatedEmployees.length === 0">
                            <tr>
                                <td colspan="10" class="p-4 text-center">
                                    <!-- NoDataMessage component -->
                                    <No-data-message :message="$t('no_data.no_employees_found')"
                                        icon="tabler:package-off" />
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
                                    {{ employee.createdAt }}
                                </td>
                                <!-- <td class="px-6 py-4">
                                    <div class="flex gap-3">
                                        <button role="button" @click.stop="openEditDialog(product.id)"
                                            class="font-semibold text-blue-600 hover:underline">{{ $t('btn.edit')
                                            }}</button>
                                        <button role="button" v-if="userRole?.role !== 'employee'">
                                            <span class="flex items-center font-semibold text-red-600"
                                                @click.stop="openDeleteDialog(product)">
                                                <iconify-icon icon="material-symbols:delete" width="20" height="20"
                                                    class="me-1"></iconify-icon>
                                                {{ $t('btn.delete') }}
                                            </span>
                                        </button>
                                    </div>
                                </td> -->
                            </tr>

                            <!-- delete-dialog component -->
                            <!-- <delete-dialog v-model="showDeleteDialog"
                                :message="$t('dashboard.delete_confirmation_product')" @confirm="handleDelete" /> -->
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
const employeesStore = useEmployeesStore()
const { showToast, toastMessage, toastType, toastIcon, triggerToast } = useToast();
const showSkeleton = ref(true);

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

const skeletonHeaders = [
    { label: '#', loaderWidth: 'w-8' },
    { label: 'Employee Name', loaderWidth: 'w-32' },
    { label: 'Employee Email', loaderWidth: 'w-24' },
    { label: 'Created At', loaderWidth: 'w-24' },
    { label: 'Actions', type: 'action' }
];
</script>