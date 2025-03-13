<template>
    <div>
        <div class="max-w-2xl px-8 py-6 mx-auto my-8 bg-white border rounded-lg">
            <h2 class="mb-4 text-2xl font-medium text-center">
                {{ isEdit ? $t('form.edit_product') : $t('form.add_product') }}
            </h2>
            <form @submit.prevent="handleSubmit">
                <div class="mb-4">
                    <dynamic-inputs :label="t('form.product_title')" :placeholder="t('form.enter_your_product_title')"
                        type="text" :name="t('form.product_title')" :rules="'required'" :required="true"
                        prefixIcon="tabler:brand-producthunt" />
                </div>

                <div class="mb-4">
                    <dynamic-inputs :label="t('form.product_title_ar')"
                        :placeholder="t('form.enter_your_product_title_ar')" type="text"
                        :name="t('form.product_title_ar')" :rules="'required'" :required="true"
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
                                            <!-- <i class="fa-solid fa-image fa-4x"></i> -->
                                            <iconify-icon icon="material-symbols:imagesmode" width="70" height="70"
                                                class="text-gray-500"></iconify-icon>
                                            <span class="block font-normal text-gray-400">{{
                                                $t('form.attach_your_files_here') }}</span>
                                        </div>
                                    </div>
                                    <input type="file" class="w-full h-full opacity-0" multiple>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- <div class="flex items-center justify-center mb-4 space-s-6">
                    <div v-if="product.imgOne" class="mt-4 border border-gray-200">
                        <img :src="product.imgOne" class="w-48 h-32 rounded-lg">
                    </div>
                    <div v-if="product.imgTwo" class="mt-4 border border-gray-200">
                        <img :src="product.imgTwo" class="w-48 h-32 rounded-lg">
                    </div>
                    <div v-if="product.imgThree" class="mt-4 border border-gray-200">
                        <img :src="product.imgThree" class="w-48 h-32 rounded-lg">
                    </div>
                    <div v-if="product.imgFour" class="mt-4 border border-gray-200">
                        <img :src="product.imgFour" class="w-48 h-32 rounded-lg">
                    </div>
                </div> -->

                <div class="mb-4">
                    <dynamic-inputs :label="t('form.product_description')"
                        :placeholder="t('form.enter_your_product_description')" type="textarea"
                        :name="t('form.product_description')" :rules="'required'" :required="true"
                        prefixIcon="tabler:file-description" />
                </div>

                <div class="mb-4">
                    <dynamic-inputs :label="t('form.product_description_ar')"
                        :placeholder="t('form.enter_your_product_description_ar')" type="textarea"
                        :name="t('form.product_description_ar')" :rules="'required'" :required="true"
                        prefixIcon="tabler:file-description" />
                </div>

                <div class="mb-4">
                    <dynamic-inputs :label="t('form.original_price')" :placeholder="t('form.enter_original_price')"
                        type="number" :name="t('form.original_price')" prefixIcon="mdi:money" />
                </div>

                <div class="mb-4">
                    <dynamic-inputs :label="t('form.discounted_price')" :placeholder="t('form.enter_discounted_price')"
                        type="number" :name="t('form.discounted_price')" :rules="'required'" :required="true"
                        prefixIcon="mdi:money" />
                </div>

                <div class="mb-4">
                    <dynamic-inputs :label="t('form.discount')" :placeholder="t('form.enter_the_discount_percentage')"
                        type="number" :name="t('form.discount')" prefixIcon="mdi:discount-circle-outline" />
                </div>

                <div class="mb-4">
                    <label for="availability" class="block mb-2 font-medium text-gray-700">{{ $t('form.availability')
                    }}</label>
                    <select id="availability" :name="t('form.availability')"
                        class="w-full p-2 border border-gray-400 rounded-lg focus:outline-none focus:border-blue-400">
                        <option value="" disabled>{{ $t('form.select_availability') }}</option>
                        <option>{{ $t('form.in_stock') }}</option>
                        <option>{{ $t('form.out_of_stock') }}</option>
                    </select>
                </div>

                <div class="mb-4">
                    <label for="country" class="block mb-2 font-medium text-gray-700">{{
                        $t('form.select_market_country')
                        }}</label>
                    <select id="country" :name="t('form.select_market_country')"
                        class="w-full p-2 border border-gray-400 rounded-lg focus:outline-none focus:border-blue-400">
                        <option value="" disabled>{{ $t('form.select_market_country') }}</option>
                        <option>{{ $t('form.egypt') }}</option>
                        <option>{{ $t('form.ksa') }}</option>
                    </select>
                </div>

                <div>
                    <button type="submit"
                        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center block w-full">
                        <div class="flex items-center justify-center" v-if="loading">
                            <span class="text-center me-2">{{ $t('btn.please_wait') }}...</span>
                            <i class="fa-solid fa-spinner fa-spin-pulse"></i>
                        </div>
                        <span v-else>
                            {{ isEdit ? $t('btn.edit_product') : $t('btn.add_product') }}
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
const productId = ref(null);

onMounted(async () => {
    if (route.name === 'edit-product') {
        isEdit.value = true;
        productId.value = route.params.id;

        // Fetch existing product data
        // const response = await fetch(`/api/products/${productId.value}`);
        // product.value = await response.json();
    }
});

const handleSubmit = () => {
    console.log('form submitted!')
}
</script>