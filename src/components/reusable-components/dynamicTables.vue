<template>
    <div>
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
                        <img :src="category.img" alt="category-img" class="w-16 h-8 rounded-lg">
                    </td>
                    <td class="flex items-center justify-center px-6 py-4 space-s-4">
                        <router-link :to="{ name: 'edit-category', params: { id: category.id } }"
                            class="font-medium text-blue-600 hover:underline">Edit</router-link>
                        <router-link to="" role="button" @click="openDeleteDialog(category.id)" v-if="hasPermission('earnings', 'delete') || hasPermission('earnings-form-marketing', 'delete')"
                            class="font-medium text-red-600">
                            <iconify-icon icon="material-symbols:delete-forever" width="24" height="24"></iconify-icon>
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

const authStore = useAuthStore();
const user = computed(() => authStore.user);

//usePermissions composables
const { hasPermission } = usePermissions(user);
</script>