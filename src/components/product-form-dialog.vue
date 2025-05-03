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
                            {{ isEdit ? $t('form.edit_product') : $t('form.add_product') }}
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
                        <ol
                            class="flex items-center w-full max-w-2xl text-sm font-medium text-center text-gray-500 sm:text-base">
                            <li :class="step === 1 ? 'text-blue-600' : 'text-gray-400'"
                                class="after:border-1 flex items-center after:mx-6 after:hidden after:h-1 after:w-full after:border-b after:border-gray-200 sm:after:inline-block sm:after:content-[''] md:w-full xl:after:mx-10">
                                <span
                                    class="flex items-center after:mx-2 after:text-gray-200 after:content-['/'] sm:after:hidden">
                                    <iconify-icon icon="material-symbols:looks-one-outline" width="60"
                                        height="60"></iconify-icon>
                                </span>
                            </li>
                            <li :class="step === 2 ? 'text-blue-600' : 'text-gray-400'"
                                class="after:border-1 flex items-center after:mx-6 after:hidden after:h-1 after:w-full after:border-b after:border-gray-200 sm:after:inline-block sm:after:content-[''] md:w-full xl:after:mx-10">
                                <span
                                    class="flex items-center after:mx-2 after:text-gray-200 after:content-['/'] sm:after:hidden">
                                    <iconify-icon icon="material-symbols:looks-two-outline" width="60"
                                        height="60"></iconify-icon>
                                </span>
                            </li>
                            <li class="flex items-center shrink-0"
                                :class="step === 3 ? 'text-blue-600' : 'text-gray-400'">
                                <span
                                    class="flex items-center after:mx-2 after:text-gray-200 after:content-['/'] sm:after:hidden">
                                    <iconify-icon icon="material-symbols:looks-3-outline" width="60"
                                        height="60"></iconify-icon>
                                </span>
                            </li>
                        </ol>

                        <Transition name="fade">
                            <div v-if="step === 1">
                                <div class="mb-4">
                                    <label for="category" class="block mb-2 font-medium text-gray-700">{{
                                        $t('form.select_category') }}</label>
                                    <select id="category" v-model="formData.categoryId"
                                        class="w-full p-2 border border-gray-400 rounded-lg focus:outline-none focus:border-blue-400">
                                        <option value="" disabled>{{ $t('form.select_category') }}</option>
                                        <option v-for="category in categoriesStore.categories" :key="category.id"
                                            :value="category.id">
                                            {{ $i18n.locale === 'ar' ? category.titleAr : category.title }}
                                        </option>
                                    </select>
                                </div>

                                <div class="mb-4">
                                    <dynamic-inputs :label="t('form.product_title')"
                                        :placeholder="t('form.enter_your_product_title')" type="text"
                                        :name="t('form.product_title')" :rules="'required'" :required="true"
                                        prefixIcon="tabler:brand-producthunt" v-model="formData.title" />
                                </div>

                                <div class="mb-4">
                                    <dynamic-inputs :label="t('form.product_title_ar')"
                                        :placeholder="t('form.enter_your_product_title_ar')" type="text"
                                        :name="t('form.product_title_ar')" :rules="'required'" :required="true"
                                        prefixIcon="tabler:brand-producthunt" v-model="formData.titleAr" />
                                </div>

                                <div class="mb-4">
                                    <label class="block mb-2 text-sm font-medium text-gray-700">
                                        {{ $t('form.images') }}
                                    </label>
                                    <div class="grid grid-cols-2 gap-6 px-4 mx-auto mt-3 md:grid-cols-4 lg:px-6">
                                        <!-- img 1 -->
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

                                        <!-- img 2 -->
                                        <div class="flex flex-col items-center">
                                            <div v-if="imagePreview.imageUrl2" class="relative mb-2 w-28 h-28">
                                                <img :src="imagePreview.imageUrl2"
                                                    class="object-cover w-full h-full rounded-lg" />
                                                <button type="button" @click="removeImagePreview('imageUrl2')"
                                                    class="absolute p-0.5 text-white bg-red-500 rounded-full -top-2 -end-2 hover:bg-red-600 flex items-center">
                                                    <iconify-icon icon="material-symbols:close-small-rounded" width="20"
                                                        height="20"></iconify-icon>
                                                </button>
                                            </div>
                                            <div v-else
                                                class="p-4 mb-2 border border-indigo-500 rounded-lg shadow-md w-28 h-28 bg-gray-50">
                                                <label for="imageUrl2"
                                                    class="flex flex-col items-center justify-center h-full gap-2 cursor-pointer">
                                                    <iconify-icon icon="material-symbols:photo" width="30" height="30"
                                                        class="text-indigo-600"></iconify-icon>
                                                    <p class="font-medium text-center text-gray-600">{{
                                                        $t('form.upload_file')
                                                        }}</p>
                                                </label>
                                            </div>
                                            <input id="imageUrl2" type="file" class="hidden" accept="image/*"
                                                @change="handleSingleImageUpload($event, 'imageUrl2')" />
                                        </div>

                                        <!-- img 3 -->
                                        <div class="flex flex-col items-center">
                                            <div v-if="imagePreview.imageUrl3" class="relative mb-2 w-28 h-28">
                                                <img :src="imagePreview.imageUrl3"
                                                    class="object-cover w-full h-full rounded-lg" />
                                                <button type="button" @click="removeImagePreview('imageUrl3')"
                                                    class="absolute p-0.5 text-white bg-red-500 rounded-full -top-2 -end-2 hover:bg-red-600 flex items-center">
                                                    <iconify-icon icon="material-symbols:close-small-rounded" width="20"
                                                        height="20"></iconify-icon>
                                                </button>
                                            </div>
                                            <div v-else
                                                class="p-4 mb-2 border border-indigo-500 rounded-lg shadow-md w-28 h-28 bg-gray-50">
                                                <label for="imageUrl3"
                                                    class="flex flex-col items-center justify-center h-full gap-2 cursor-pointer">
                                                    <iconify-icon icon="material-symbols:photo" width="30" height="30"
                                                        class="text-indigo-600"></iconify-icon>
                                                    <p class="font-medium text-center text-gray-600">{{
                                                        $t('form.upload_file')
                                                        }}</p>
                                                </label>
                                            </div>
                                            <input id="imageUrl3" type="file" class="hidden" accept="image/*"
                                                @change="handleSingleImageUpload($event, 'imageUrl3')" />
                                        </div>

                                        <!-- img 4 -->
                                        <div class="flex flex-col items-center">
                                            <div v-if="imagePreview.imageUrl4" class="relative mb-2 w-28 h-28">
                                                <img :src="imagePreview.imageUrl4"
                                                    class="object-cover w-full h-full rounded-lg" />
                                                <button type="button" @click="removeImagePreview('imageUrl4')"
                                                    class="absolute p-0.5 text-white bg-red-500 rounded-full -top-2 -end-2 hover:bg-red-600 flex items-center">
                                                    <iconify-icon icon="material-symbols:close-small-rounded" width="20"
                                                        height="20"></iconify-icon>
                                                </button>
                                            </div>
                                            <div v-else
                                                class="p-4 mb-2 border border-indigo-500 rounded-lg shadow-md w-28 h-28 bg-gray-50">
                                                <label for="imageUrl4"
                                                    class="flex flex-col items-center justify-center h-full gap-2 cursor-pointer">
                                                    <iconify-icon icon="material-symbols:photo" width="30" height="30"
                                                        class="text-indigo-600"></iconify-icon>
                                                    <p class="font-medium text-center text-gray-600">{{
                                                        $t('form.upload_file')
                                                        }}</p>
                                                </label>
                                            </div>
                                            <input id="imageUrl4" type="file" class="hidden" accept="image/*"
                                                @change="handleSingleImageUpload($event, 'imageUrl4')" />
                                        </div>
                                    </div>
                                </div>

                                <div class="flex flex-wrap items-center justify-end gap-4 mt-8">
                                    <button role="button" @click="nextStep"
                                        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                                        {{ $t('btn.next_step') }}
                                    </button>
                                </div>
                            </div>
                        </Transition>

                        <Transition name="fade">
                            <div v-if="step === 2">
                                <div class="mb-4">
                                    <dynamic-inputs :label="t('form.product_description')"
                                        :placeholder="t('form.enter_your_product_description')" type="textarea"
                                        :name="t('form.product_description')" :rules="'required'" :required="true"
                                        prefixIcon="tabler:file-description" v-model="formData.description" />
                                </div>

                                <div class="mb-4">
                                    <dynamic-inputs :label="t('form.product_description_ar')"
                                        :placeholder="t('form.enter_your_product_description_ar')" type="textarea"
                                        :name="t('form.product_description_ar')" :rules="'required'" :required="true"
                                        prefixIcon="tabler:file-description" v-model="formData.descriptionAr" />
                                </div>

                                <div class="mb-4">
                                    <dynamic-inputs :label="t('form.original_price')"
                                        :placeholder="t('form.enter_original_price')" type="number"
                                        :name="t('form.original_price')" prefixIcon="mdi:money"
                                        v-model="formData.originalPrice" />
                                </div>

                                <div class="mb-4">
                                    <dynamic-inputs :label="t('form.discounted_price')"
                                        :placeholder="t('form.enter_discounted_price')" type="number"
                                        :name="t('form.discounted_price')" :rules="'required'" :required="true"
                                        prefixIcon="mdi:money" v-model="formData.discountedPrice" />
                                </div>

                                <div class="mb-4">
                                    <dynamic-inputs :label="t('form.commission')"
                                        :placeholder="t('form.enter_commission')" type="number"
                                        :name="t('form.commission')" :rules="'required'" :required="true"
                                        prefixIcon="mdi:percent" v-model="formData.commission" />
                                </div>

                                <div class="mb-4">
                                    <dynamic-inputs :label="t('form.shipping_cost')"
                                        :placeholder="t('form.enter_shipping_cost')" type="number"
                                        :name="t('form.shipping_cost')" :rules="'required'" :required="true"
                                        prefixIcon="mdi:truck-delivery" v-model="formData.shippingCost" />
                                </div>

                                <div class="mb-4">
                                    <label class="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" v-model="formData.isHotDeal" class="sr-only peer">
                                        <div
                                            class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600">
                                        </div>
                                        <span class="text-sm font-medium text-gray-900 ms-3">{{ $t('form.hot_deal')
                                            }}</span>
                                    </label>

                                    <div v-if="formData.isHotDeal"
                                        class="grid grid-cols-1 gap-4 mt-3 mb-4 md:grid-cols-2">
                                        <div>
                                            <label class="block mb-1 text-sm font-medium text-gray-700">
                                                {{ $t('form.start_date') }}
                                            </label>
                                            <!-- date-picker component -->
                                            <date-picker v-model="formData.startDate" />
                                        </div>
                                        <div>
                                            <label class="block mb-1 text-sm font-medium text-gray-700">
                                                {{ $t('form.end_date') }}
                                            </label>
                                            <!-- date-picker component -->
                                            <date-picker v-model="formData.endDate" />
                                        </div>
                                    </div>
                                </div>

                                <div class="flex flex-wrap items-center justify-end gap-4 mt-8">
                                    <button v-if="step > 1" @click="prevStep" type="button"
                                        class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5">
                                        {{ $t('btn.back') }}
                                    </button>
                                    <button role="button" @click="nextStep"
                                        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                                        {{ $t('btn.next_step') }}
                                    </button>
                                </div>
                            </div>
                        </Transition>

                        <Transition name="fade">
                            <div v-if="step === 3">
                                <div class="mb-4">
                                    <dynamic-inputs :label="t('form.discount')"
                                        :placeholder="t('form.enter_the_discount_percentage')" type="number"
                                        :name="t('form.discount')" prefixIcon="mdi:discount-circle-outline"
                                        v-model="formData.discount" />
                                </div>

                                <div class="mb-4">
                                    <label for="availability" class="block mb-2 font-medium text-gray-700">{{
                                        $t('form.availability')
                                        }}</label>
                                    <select id="availability" :name="t('form.availability')"
                                        v-model="formData.availability"
                                        class="w-full p-2 border border-gray-400 rounded-lg focus:outline-none focus:border-blue-400">
                                        <option value="" disabled>{{ $t('form.select_availability') }}</option>
                                        <option value="in_stock">{{ $t('form.in_stock') }}</option>
                                        <option value="out_of_stock">{{ $t('form.out_of_stock') }}</option>
                                    </select>
                                </div>

                                <div class="mb-4" v-if="formData.availability === 'in_stock'">
                                    <dynamic-inputs :label="t('form.number_of_stock')"
                                        :placeholder="t('form.enter_number_of_stock')" type="number" name="stock"
                                        :rules="'required|numeric'" :required="true"
                                        prefixIcon="lsicon:management-stockout-filled"
                                        v-model="formData.numberOfStock" />
                                </div>

                                <div class="mb-4" v-if="userRole?.role !== 'market_owner'">
                                    <label for="country" class="block mb-2 font-medium text-gray-700">{{
                                        $t('form.select_market_country')
                                        }}</label>
                                    <select id="country" :name="t('form.select_market_country')"
                                        v-model="selectedCountry" @change="updateMarketValues"
                                        class="w-full p-2 border border-gray-400 rounded-lg focus:outline-none focus:border-blue-400">
                                        <option value="" disabled>{{ $t('form.select_market_country') }}
                                        </option>
                                        <option v-for="country in countryOptions" :key="country.key"
                                            :value="country.key">
                                            {{ $i18n.locale === 'ar' ? country.ar : country.en }}
                                        </option>
                                    </select>
                                </div>

                                <div class="flex flex-wrap items-center justify-end gap-4 mt-8">
                                    <button @click="prevStep" type="button"
                                        class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5">
                                        {{ $t('btn.back') }}
                                    </button>
                                    <button type="submit" :disabled="loading" @click="handleSubmit"
                                        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                                        <div class="flex items-center justify-center" v-if="loading">
                                            <span class="text-center me-2">{{ $t('btn.please_wait') }}...</span>
                                            <iconify-icon icon="line-md:loading-loop" width="24"
                                                height="24"></iconify-icon>
                                        </div>
                                        <span v-else>
                                            {{ isEdit ? $t('btn.edit_product') : $t('btn.add_product') }}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </Transition>
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
const productsStore = useProductsStore();
const categoriesStore = useCategoriesStore();
const { userRole } = useUserRole();
const { showToast, toastMessage, toastType, toastIcon, triggerToast } = useToast();
const loading = ref(false);
const step = ref(1);

const props = defineProps({
    isDialogOpen: {
        type: Boolean,
        default: false
    },
    productId: {
        type: String,
        default: null
    }
});

const product = ref(null)

const emit = defineEmits(['close', 'success']);

const store = useProductsStore();

watch(() => props.productId, async (newId) => {
    if (newId) {
        await store.fetchProductDetail(newId);
        product.value = { ...store.selectedProduct };
        formData.value = {
            ...store.selectedProduct,
            startDate: store.selectedProduct?.startDate?.toDate() || null,
            endDate: store.selectedProduct?.endDate?.toDate() || null
        };
        imagePreview.value.imageUrl1 = product.value.imageUrl1 || '';
        imagePreview.value.imageUrl2 = product.value.imageUrl2 || '';
        imagePreview.value.imageUrl3 = product.value.imageUrl3 || '';
        imagePreview.value.imageUrl4 = product.value.imageUrl4 || '';
    } else {
        resetForm();
    }
});

const isOpen = computed({
    get: () => props.isDialogOpen,
    set: (value) => emit("update:isOpen", value),
})

const closeDialog = () => {
    resetForm();
    step.value = 1;
    emit('close');
};

const isEdit = computed(() => props.productId && props.productId !== 'add-product');

const formData = ref({
    categoryId: '',
    title: '',
    titleAr: '',
    description: '',
    descriptionAr: '',
    originalPrice: null,
    discountedPrice: null,
    commission: null,
    discount: null,
    stock: null,
    availability: null,
    numberOfStock: null,
    targetMarket: null,
    shippingCost: null,
    isHotDeal: false,
    startDate: null,
    endDate: null
});

const imageFiles = ref({
    imageUrl1: null,
    imageUrl2: null,
    imageUrl3: null,
    imageUrl4: null
});

const imagePreview = ref({
    imageUrl1: '',
    imageUrl2: '',
    imageUrl3: '',
    imageUrl4: ''
});

const removeImagePreview = (imageKey) => {
    imagePreview.value[imageKey] = '';
    imageFiles.value[imageKey] = null;
    const fileInput = document.getElementById(imageKey);
    triggerToast({
        message: t('toast.successfully_remove_img'),
        type: 'success',
        icon: 'material-symbols:check-circle',
    });
    if (fileInput) fileInput.value = '';
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

const handleSubmit = async () => {
    loading.value = true;
    try {
        const storedUser = localStorage.getItem("user");
        const parsedUser = storedUser ? JSON.parse(storedUser) : null;
        const productData = {
            ...formData.value,
            originalPrice: Number(formData.value.originalPrice),
            discountedPrice: Number(formData.value.discountedPrice),
            commission: Number(formData.value.commission),
            discount: Number(formData.value.discount),
            stock: Number(formData.value.stock),
            numberOfStock: Number(formData.value.numberOfStock)
        };
        if (isEdit.value) {
            await store.updateProduct(
                props.productId,
                productData,
                imageFiles.value
            );
            triggerToast({
                message: t('toast.product_updated_successfully'),
                type: 'success',
                icon: 'material-symbols:check-circle',
            });
        } else {
            await store.createProduct(productData, imageFiles.value);
            triggerToast({
                message: t('toast.product_added_successfully'),
                type: 'success',
                icon: 'material-symbols:check-circle',
            });
        }
        emit('success');
        closeDialog();
        await productsStore.fetchProducts();
    } catch (error) {
        // console.error('Operation error:', error);
        triggerToast({
            message: t('toast.error_occurred'),
            type: 'error',
            icon: 'material-symbols:error-rounded',
        });
    } finally {
        loading.value = false;
    }
};

const countryOptions = ref([
    {
        key: 'All',
        en: 'All',
        ar: 'الكل'
    },
    {
        key: 'egypt',
        en: 'Egypt',
        ar: 'مصر',
    },
    {
        key: 'ksa',
        en: 'Saudi Arabia',
        ar: 'المملكة العربية السعودية'
    }
]);

const selectedCountry = ref('');

// Update form data immediately when selection changes
const updateMarketValues = () => {
    const country = countryOptions.value.find(c => c.key === selectedCountry.value);
    if (country) {
        formData.value.targetMarket = country.en;
        formData.value.targetMarketAr = country.ar;
    }
};

const resetForm = () => {
    formData.value = {
        categoryId: '',
        title: '',
        titleAr: '',
        description: '',
        descriptionAr: '',
        originalPrice: null,
        discountedPrice: null,
        commission: null,
        discount: null,
        stock: null,
        availability: null,
        numberOfStock: null,
        targetMarket: '',
        targetMarketAr: '',
        shippingCost: null,
        isHotDeal: false
    };
    imageFiles.value = {
        imageUrl1: null,
        imageUrl2: null,
        imageUrl3: null,
        imageUrl4: null
    };
    imagePreview.value = {
        imageUrl1: '',
        imageUrl2: '',
        imageUrl3: '',
        imageUrl4: ''
    };
};

const nextStep = () => {
    if (step.value < 3) {
        step.value++;
    }
};

const prevStep = () => {
    if (step.value > 1) {
        step.value--;
    }
};

onMounted(async () => {
    await categoriesStore.fetchCategories();
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>