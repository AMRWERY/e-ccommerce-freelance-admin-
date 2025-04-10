<template>
    <div>
        <div v-flowbite>
            <div class="flex items-center justify-between my-10 flex-nowrap">
                <p class="text-3xl font-semibold text-gray-700">Categories</p>
                <div class="flex items-center justify-center gap-4">
                    <router-link to="/categories/add" role="button"
                        class="text-white bg-[#3b5998] hover:bg-[#3b5998]/90 focus:ring-4 focus:outline-none focus:ring-[#3b5998]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#3b5998]/55 me-2">
                        <iconify-icon icon="ic:baseline-plus" width="24" height="24"></iconify-icon>
                        {{ $t('btn.add_category') }}
                    </router-link>
                </div>
            </div>
            <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
                <div class="flex justify-end pb-4">
                    <label for="table-search" class="sr-only">Search</label>
                    <div class="relative mt-1">
                        <div class="absolute inset-y-0 flex items-center pointer-events-none end-0 pe-3">
                            <iconify-icon icon="material-symbols-light:search" width="20" height="20"
                                class="text-gray-500"></iconify-icon>
                        </div>
                        <input type="text" id="table-search"
                            class="block pt-2 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Search for categories...">
                    </div>
                </div>

                <table class="w-full text-sm text-gray-500 text-start">
                    <thead class="text-xs text-gray-700 capitalize bg-gray-50">
                        <tr>
                            <th scope="col" class="px-6 py-3">
                                #
                            </th>
                            <th scope="col" class="px-6 py-3">
                                categories name
                            </th>
                            <th scope="col" class="px-6 py-3">
                                image
                            </th>
                            <th scope="col" class="px-6 py-3">
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="bg-white border-b border-gray-200 hover:bg-gray-50" v-for="category in categories"
                            :key="category.id">
                            <td class="w-4 p-4">
                                <div class="flex items-center">
                                    {{ category.id }}
                                </div>
                            </td>
                            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                {{ category.name }}
                            </th>
                            <td class="px-6 py-4">
                                <img :src="category.img" alt="category img" class="w-16 h-8 rounded-lg">
                            </td>
                            <td class="flex items-center justify-center px-6 py-4 space-s-4">
                                <router-link :to="{ name: 'edit-category', params: { id: category.id } }"
                                    class="font-medium text-blue-600 hover:underline">Edit</router-link>
                                <router-link to="" role="button" @click="openDeleteDialog(category.id)"
                                    class="font-medium text-red-600">
                                    <iconify-icon icon="material-symbols:delete-forever" width="24"
                                        height="24"></iconify-icon>
                                </router-link>
                            </td>
                        </tr>

                        <!-- delete-dialog component -->
                        <delete-dialog v-model="showDeleteDialog"
                            :message="`You are about to delete category #${selectedCategoryId}. This action cannot be undone.`"
                            @confirm="handleDelete" />

                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup>
const categories = ref([
    {
        id: 1,
        name: 'Microsoft Surface Pro',
        img: 'https://justfields.com/storage/projects/7M5rV059/1.jpg'
    },
    {
        id: 2,
        name: 'MacBook Pro',
        img: 'https://justfields.com/storage/projects/7M5rV059/2.jpg'
    }
]);

const showDeleteDialog = ref(false);
const selectedCategoryId = ref(null);

const openDeleteDialog = (categoryId) => {
    selectedCategoryId.value = categoryId;
    showDeleteDialog.value = true;
};

const handleDelete = async () => {
    try {
        // Call your delete API here using selectedCategoryId.value
        categories.value = categories.value.filter(c => c.id !== selectedCategoryId.value);
    } catch (error) {
        console.error('Delete failed:', error);
    } finally {
        selectedCategoryId.value = null;
    }
};
</script>