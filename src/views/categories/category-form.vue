<template>
    <div>
        <div class="max-w-2xl px-8 py-6 mx-auto my-8 bg-white border rounded-lg">
            <h2 class="mb-4 text-2xl font-medium text-center">
                {{ isEdit ? $t('form.edit_category') : $t('form.add_category') }}
            </h2>

            <form @submit.prevent="handleSubmit">
                <div class="mb-4">
                    <dynamic-inputs :label="t('form.category_title')" :placeholder="t('form.enter_your_category_title')"
                        type="text" :name="t('form.category_title')" :rules="'required'" :required="true"
                        prefixIcon="tabler:brand-producthunt" />
                </div>

                <div class="mb-4">
                    <dynamic-inputs :label="t('form.category_title_ar')"
                        :placeholder="t('form.enter_your_category_title_ar')" type="text"
                        :name="t('form.category_title_ar')" :rules="'required'" :required="true"
                        prefixIcon="tabler:brand-producthunt" />
                </div>

                <div class="mb-4">
                    <div class="mx-auto overflow-hidden rounded-lg">
                        <div class="md:flex">
                            <div class="w-full">
                                <div
                                    class="relative flex items-center justify-center h-48 bg-gray-100 border-2 border-blue-700 border-dashed rounded-lg">
                                    <div class="absolute">
                                        <div class="flex flex-col items-center">
                                            <iconify-icon icon="material-symbols:imagesmode" width="70" height="70"
                                                class="text-gray-500"></iconify-icon>
                                            <span class="block font-normal text-gray-400">{{
                                                $t('form.attach_your_file_here') }}</span>
                                        </div>
                                    </div>
                                    <input type="file" class="w-full h-full opacity-0" multiple>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- <div class="flex items-center justify-center mb-4 space-s-6">
                    <div v-if="category.imgOne" class="mt-4 border border-gray-200">
                        <img :src="category.imgOne" class="w-48 h-32 rounded-lg">
                    </div>
                </div> -->

                <div>
                    <button type="submit"
                        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center block w-full">
                        <div class="flex items-center justify-center" v-if="loading">
                            <span class="text-center me-2">{{ $t('btn.please_wait') }}...</span>
                            <i class="fa-solid fa-spinner fa-spin-pulse"></i>
                        </div>
                        <span v-else>
                            {{ isEdit ? $t('btn.edit_category') : $t('btn.add_category') }}
                        </span>
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
const { t } = useI18n()
const route = useRoute();
const loading = ref(false);
const isEdit = ref(false);
const categoryId = ref(null);

onMounted(async () => {
    if (route.name === 'edit-category') {
        isEdit.value = true;
        categoryId.value = route.params.id;

        // Fetch existing category data
        // const response = await fetch(`/api/categories/${categoryId.value}`);
        // category.value = await response.json();
    }
});

const handleSubmit = () => {
    console.log('form submitted!')
}
</script>