<template>
    <div>
        <div v-if="isOpen"
            class="overflow-y-auto overflow-x-hidden fixed top-0 end-0 start-0 z-50 flex justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
            <!-- Overlay -->
            <div class="fixed inset-0 transition-opacity bg-black/50"></div>
            <div class="relative w-full max-w-2xl max-h-full p-4">
                <div class="relative flex flex-col h-full bg-white rounded-lg shadow-md">
                    <div class="flex items-center justify-between p-2 border-b border-gray-200 rounded-t md:p-3">
                        <h3 class="text-xl font-semibold text-gray-900">
                            {{ isEdit ? $t('form.edit_category') : $t('form.add_category') }}
                        </h3>
                        <button type="button"
                            class="inline-flex items-center justify-center w-8 h-8 text-sm text-gray-400 bg-transparent rounded-lg hover:bg-gray-200 hover:text-gray-900 ms-auto"
                            @click="closeDialog">
                            <iconify-icon icon="material-symbols:close-small-rounded" width="24"
                                height="24"></iconify-icon>
                            <span class="sr-only">Close modal</span>
                        </button>
                    </div>

                    <div class="p-4 space-y-4 md:p-5">
                        <div class="mb-4">
                            <dynamic-inputs :label="t('form.category_title_en')"
                                :placeholder="t('form.enter_category_title')" type="text" name="category"
                                :rules="'required|alpha_spaces'" :required="true" prefixIcon="material-symbols:category"
                                v-model="newCategoryTitle" />
                        </div>

                        <div class="mb-4">
                            <dynamic-inputs :label="t('form.category_title_ar')"
                                :placeholder="t('form.enter_category_title_ar')" type="text" name="category_title_ar"
                                :rules="'required|alpha_spaces'" :required="true" prefixIcon="material-symbols:category"
                                v-model="newCategoryTitleAr" />
                        </div>

                        <div class="mb-4">
                            <label class="block mb-2 text-sm font-medium text-gray-700">
                                {{ $t('form.images') }}
                            </label>
                            <div class="mx-auto mt-3">
                                <div class="flex flex-col items-center">
                                    <div v-if="imagePreview.imageUrl1" class="relative mb-2 w-28 h-28">
                                        <img :src="imagePreview.imageUrl1"
                                            class="object-cover w-full h-full rounded-lg" />
                                        <button type="button" @click="removeImagePreview('imageUrl1')"
                                            class="absolute p-0.5 text-white bg-red-500 rounded-full -top-2 -end-2 hover:bg-red-600 flex items-center">
                                            <iconify-icon icon="material-symbols:close-small-rounded" width="20"
                                                height="20"></iconify-icon>
                                        </button>
                                    </div>
                                    <div v-else
                                        class="p-4 mb-2 border border-indigo-500 rounded-lg shadow-md w-28 h-28 bg-gray-50">
                                        <label for="imageUrl1"
                                            class="flex flex-col items-center justify-center h-full gap-2 cursor-pointer">
                                            <iconify-icon icon="material-symbols:photo" width="30" height="30"
                                                class="text-indigo-600"></iconify-icon>
                                            <p class="font-medium text-center text-gray-600">{{
                                                $t('form.upload_file')
                                            }}</p>
                                        </label>
                                    </div>
                                    <input id="imageUrl1" type="file" class="hidden" accept="image/*"
                                        @change="handleSingleImageUpload($event, 'imageUrl1')" />
                                </div>
                            </div>
                        </div>

                        <div class="flex items-center justify-end">
                            <button type="submit" :disabled="loading" @click="handleSubmit"
                                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                                <div class="flex items-center justify-center" v-if="loading">
                                    <span class="text-center me-2">{{ $t('btn.please_wait') }}...</span>
                                    <iconify-icon icon="line-md:loading-loop" width="24" height="24"></iconify-icon>
                                </div>
                                <span v-else>
                                    {{ isEdit ? $t('btn.edit_category') : $t('btn.add_category') }}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
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
const categoriesStore = useCategoriesStore();
const loading = ref(false);
const { showToast, toastMessage, toastType, toastIcon, triggerToast } = useToast();

const props = defineProps({
    isDialogOpen: {
        type: Boolean,
        default: false
    },
    categoryId: {
        type: String,
        default: null
    }
});

const emit = defineEmits(['close', 'success']);

const isOpen = computed({
    get: () => props.isDialogOpen,
    set: (value) => emit("update:isOpen", value),
});

const newCategoryTitle = ref('');
const newCategoryTitleAr = ref('');

const imageFiles = ref({
    imageUrl1: null,
});

const imagePreview = ref({
    imageUrl1: '',
});

// Watch for category ID changes to load data for editing
watch(() => props.categoryId, async (newId) => {
    if (newId && newId !== 'add-category') {
        await categoriesStore.fetchCategoryDetails(newId);
        const category = categoriesStore.currentCategory;
        if (category) {
            newCategoryTitle.value = category.title;
            newCategoryTitleAr.value = category.titleAr;
            imagePreview.value.imageUrl1 = category.imgOne || '';
        }
    } else {
        resetForm();
    }
});

const isEdit = computed(() => props.categoryId && props.categoryId !== 'add-category');

const closeDialog = () => {
    resetForm();
    emit('close');
};

const handleSubmit = async () => {
    if (!newCategoryTitle.value || !newCategoryTitleAr.value) {
        triggerToast({
            message: t('toast.fill_all_fields'),
            type: 'error',
            icon: 'material-symbols:error-rounded',
        });
        return;
    }
    loading.value = true;
    try {
        if (isEdit.value) {
            await categoriesStore.updateCategory(
                props.categoryId,
                {
                    title: newCategoryTitle.value,
                    titleAr: newCategoryTitleAr.value,
                },
                imageFiles.value.imageUrl1
            );
            triggerToast({
                message: t('toast.category_updated_successfully'),
                type: 'success',
                icon: 'material-symbols:check-circle',
            });
        } else {
            await categoriesStore.addCategory(
                newCategoryTitle.value,
                newCategoryTitleAr.value,
                imageFiles.value.imageUrl1
            );
            triggerToast({
                message: t('toast.category_added_successfully'),
                type: 'success',
                icon: 'material-symbols:check-circle',
            });
        }
        emit('success');
        closeDialog();
    } catch (error) {
        console.error('Operation error:', error);
        triggerToast({
            message: t('toast.error_occurred'),
            type: 'error',
            icon: 'material-symbols:error-rounded',
        });
    } finally {
        loading.value = false;
    }
};

const resetForm = () => {
    newCategoryTitle.value = '';
    newCategoryTitleAr.value = '';
    imageFiles.value = {
        imageUrl1: null,
    };
    imagePreview.value = {
        imageUrl1: '',
    };
};

const removeImagePreview = (imageKey) => {
    imagePreview.value[imageKey] = '';
    imageFiles.value[imageKey] = null;
    const fileInput = document.getElementById(imageKey);
    if (fileInput) fileInput.value = '';
    triggerToast({
        message: t('toast.successfully_remove_img'),
        type: 'success',
        icon: 'material-symbols:check-circle',
    });
};

const handleSingleImageUpload = (event, imageKey) => {
    const file = event.target.files[0];
    if (!file) {
        triggerToast({
            message: t('toast.failed_upload_img'),
            type: 'error',
            icon: 'material-symbols:error-rounded',
        });
        return;
    }
    imageFiles.value[imageKey] = file;
    const reader = new FileReader();
    reader.onload = (e) => {
        imagePreview.value[imageKey] = e.target.result;
        triggerToast({
            message: t('toast.successfully_upload_img'),
            type: 'success',
            icon: 'material-symbols:check-circle',
        });
    };
    reader.onerror = () => {
        triggerToast({
            message: t('toast.failed_upload_img'),
            type: 'error',
            icon: 'material-symbols:error-rounded',
        });
        imageFiles.value[imageKey] = null;
    };
    reader.readAsDataURL(file);
};
</script>