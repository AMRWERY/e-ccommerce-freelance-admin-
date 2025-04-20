<template>
    <div>
        <div v-flowbite>
            <div class="flex items-center justify-between my-10 flex-nowrap">
                <p class="text-3xl font-semibold text-gray-700">{{ $t('dashboard.categories') }}</p>
                <div class="flex items-center justify-center gap-4" v-if="!showSkeleton">
                    <button @click="openAddDialog" v-if="hasPermission('categories', 'add')"
                        class="text-white bg-[#3b5998] hover:bg-[#3b5998]/90 focus:ring-4 focus:outline-none focus:ring-[#3b5998]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2">
                        <iconify-icon icon="ic:baseline-plus" width="24" height="24" class="me-2"></iconify-icon>
                        {{ $t('btn.add_category') }}
                    </button>
                </div>
            </div>

            <!-- category-form-dialog component -->
            <category-form-dialog :is-dialog-open="isDialogOpen" :category-id="selectedCategoryId"
                @close="handleDialogClose" @success="handleSuccess" />

            <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
                <div class="flex justify-start pb-4 mb-4" v-if="!showSkeleton">
                    <label for="table-search" class="sr-only">Search</label>
                    <div class="relative mt-1">
                        <div class="absolute inset-y-0 flex items-center pointer-events-none end-0 pe-3">
                            <iconify-icon icon="material-symbols-light:search" width="20" height="20"
                                class="text-gray-500"></iconify-icon>
                        </div>
                        <input type="text" id="table-search" v-model="searchTerm"
                            class="block pt-2 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                            :placeholder="$t('form.search_categories')">
                    </div>
                </div>

                <template v-if="showSkeleton">
                    <!-- tableSkeletonLoader component -->
                    <table-skeleton-loader :headers="skeletonHeaders" :rows="5" />
                </template>

                <template v-else>
                    <table class="w-full text-sm text-gray-500 text-start">
                        <thead class="text-xs text-gray-700 capitalize bg-gray-50">
                            <tr>
                                <th scope="col" class="px-6 py-3">#</th>
                                <th scope="col" class="px-6 py-3">{{ $t('dashboard.image') }}</th>
                                <th scope="col" class="px-6 py-3">{{ $t('dashboard.category_name') }}</th>
                                <th scope="col" class="px-6 py-3"></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="categoriesStore.paginatedCategories.length === 0">
                                <td colspan="4" class="px-6 py-4 text-center">
                                    <!-- no-data-message component -->
                                    <no-data-message :message="$t('no_data.no_categories_found')"
                                        icon="tabler:category-off" />
                                </td>
                            </tr>
                            <tr class="bg-white border-b border-gray-200 hover:bg-gray-50"
                                v-for="(category, index) in categoriesStore.paginatedCategories" :key="category.id">
                                <td class="px-6 py-4">
                                    {{ (categoriesStore.currentPage - 1) * categoriesStore.categoriesPerPage + index + 1
                                    }}
                                </td>
                                <td class="px-6 py-4">
                                    <img :src="category.imgOne" :alt="category.title"
                                        class="object-cover w-12 h-12 rounded-lg">
                                </td>
                                <td class="px-6 py-4 font-medium text-gray-900">
                                    {{ $i18n.locale ===
                                        'ar' ? category.titleAr :
                                        category.title }}
                                </td>
                                <td class="flex items-center justify-center px-6 py-4 space-s-5" v-flowbite>
                                    <button @click="openEditDialog(category)" v-if="hasPermission('categories', 'edit')"
                                        class="flex items-center justify-center font-medium text-blue-600 hover:text-blue-800"
                                        data-tooltip-target="tooltip-edit-category">
                                        <iconify-icon icon="material-symbols:edit" width="24" height="24" />
                                    </button>
                                    <div id="tooltip-edit-category" role="tooltip"
                                        class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-xs opacity-0 tooltip dark:bg-gray-700">
                                        {{ $t('tooltip.edit_category') }}
                                        <div class="tooltip-arrow" data-popper-arrow></div>
                                    </div>

                                    <button @click="openDeleteDialog(category.id)"
                                        v-if="hasPermission('categories', 'delete')"
                                        class="flex items-center justify-center font-medium text-red-600 hover:text-red-800"
                                        data-tooltip-target="tooltip-delete-category">
                                        <iconify-icon icon="material-symbols:delete-forever" width="24" height="24" />
                                    </button>
                                    <div id="tooltip-delete-category" role="tooltip"
                                        class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-xs opacity-0 tooltip dark:bg-gray-700">
                                        {{ $t('tooltip.delete_category') }}
                                        <div class="tooltip-arrow" data-popper-arrow></div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </template>
            </div>

            <!-- Pagination -->
            <pagination-controls v-if="!showSkeleton && categoriesStore.paginatedCategories.length > 0"
                :current-page="categoriesStore.currentPage" :total-pages="categoriesStore.totalPages"
                @page-change="categoriesStore.changePage" />

            <!-- delete-dialog component -->
            <delete-dialog v-model="showDeleteDialog" :message="$t('dashboard.delete_confirmation_category')"
                @confirm="handleDelete" />
        </div>

        <!-- Toast notifications -->
        <div class="fixed z-50 pointer-events-none bottom-5 start-5 w-96">
            <div class="pointer-events-auto">
                <dynamic-toast v-if="showToast" :message="toastMessage" :toastType="toastType" :duration="5000"
                    :toastIcon="toastIcon" @toastClosed="showToast = false" />
            </div>
        </div>
    </div>
</template>

<script setup>
const { t } = useI18n();
const categoriesStore = useCategoriesStore();
const authStore = useAuthStore();
const { showToast, toastMessage, toastType, toastIcon, triggerToast } = useToast();
const showSkeleton = ref(true);

const user = computed(() => authStore.user);

const { hasPermission } = usePermissions(user);

// Dialog control
const isDialogOpen = ref(false);
const selectedCategoryId = ref(null);
const showDeleteDialog = ref(false);
const searchTerm = ref('');

// Watch for search term changes
watch(searchTerm, (newTerm) => {
    categoriesStore.setSearchTerm(newTerm);
});

// Fetch categories on mount with loading delay
onMounted(async () => {
    showSkeleton.value = true;
    const startTime = Date.now();
    try {
        await categoriesStore.fetchCategories();
    } catch (error) {
        console.error('Error fetching categories:', error);
    } finally {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(3000 - elapsed, 0);
        setTimeout(() => {
            showSkeleton.value = false;
        }, remaining);
    }
});

const openAddDialog = () => {
    selectedCategoryId.value = 'add-category';
    isDialogOpen.value = true;
};

const openEditDialog = (category) => {
    selectedCategoryId.value = category.id;
    isDialogOpen.value = true;
};

const openDeleteDialog = (categoryId) => {
    selectedCategoryId.value = categoryId;
    showDeleteDialog.value = true;
};

const handleDialogClose = () => {
    isDialogOpen.value = false;
    selectedCategoryId.value = null;
};

const handleSuccess = async () => {
    showSkeleton.value = true;
    const startTime = Date.now();
    try {
        await categoriesStore.fetchCategories();
    } finally {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(3000 - elapsed, 0);
        setTimeout(() => {
            showSkeleton.value = false;
        }, remaining);
    }
};

const handleDelete = async () => {
    try {
        await categoriesStore.deleteCategory(selectedCategoryId.value);
        triggerToast({
            message: t('toast.category_deleted_successfully'),
            type: 'success',
            icon: 'material-symbols:check-circle',
        });
        showSkeleton.value = true;
        const startTime = Date.now();
        await categoriesStore.fetchCategories();
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(3000 - elapsed, 0);
        setTimeout(() => {
            showSkeleton.value = false;
        }, remaining);
    } catch (error) {
        triggerToast({
            message: t('toast.category_deletion_failed'),
            type: 'error',
            icon: 'material-symbols:error-rounded',
        });
    } finally {
        showDeleteDialog.value = false;
        selectedCategoryId.value = null;
    }
};

// Skeleton headers
const skeletonHeaders = [
    { label: '#', loaderWidth: 'w-8' },
    { label: 'Image', type: 'image' },
    { label: 'Category Name', loaderWidth: 'w-32' },
    { label: 'Actions', type: 'action' }
];
</script>