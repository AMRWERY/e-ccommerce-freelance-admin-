<template>
    <div>
        <div v-flowbite>
            <!-- Modal toggle -->
            <router-link to="" role="button" data-modal-target="default-modal" data-modal-toggle="default-modal"
                class="text-white bg-[#3b5998] hover:bg-[#3b5998]/90 focus:ring-4 focus:outline-none focus:ring-[#3b5998]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2">
                <iconify-icon icon="ic:baseline-plus" width="24" height="24" aria-hidden="true"></iconify-icon>
                {{ $t('btn.add_product') }}
            </router-link>

            <!-- Main modal -->
            <div id="default-modal" tabindex="-1" aria-hidden="true"
                class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
                <!-- Overlay -->
                <div class="fixed inset-0 transition-opacity bg-black/50"></div>
                <div class="relative w-full max-w-2xl max-h-full p-4">
                    <div class="relative flex flex-col h-full bg-white rounded-lg shadow-md">
                        <div class="flex items-center justify-between p-2 border-b border-gray-200 rounded-t md:p-3">
                            <h3 class="text-xl font-semibold text-gray-900">
                                {{ $t('form.add_product') }}
                            </h3>
                            <button type="button"
                                class="inline-flex items-center justify-center w-8 h-8 text-sm text-gray-400 bg-transparent rounded-lg hover:bg-gray-200 hover:text-gray-900 ms-auto"
                                data-modal-hide="default-modal">
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
                                        <iconify-icon icon="material-symbols:looks-one-outline" width="60" height="60"
                                            aria-hidden="true"></iconify-icon>
                                    </span>
                                </li>
                                <li :class="step === 2 ? 'text-blue-600' : 'text-gray-400'"
                                    class="after:border-1 flex items-center after:mx-6 after:hidden after:h-1 after:w-full after:border-b after:border-gray-200 sm:after:inline-block sm:after:content-[''] md:w-full xl:after:mx-10">
                                    <span
                                        class="flex items-center after:mx-2 after:text-gray-200 after:content-['/'] sm:after:hidden">
                                        <iconify-icon icon="material-symbols:looks-two-outline" width="60" height="60"
                                            aria-hidden="true"></iconify-icon>
                                    </span>
                                </li>
                                <li class="flex items-center shrink-0"
                                    :class="step === 3 ? 'text-blue-600' : 'text-gray-400'">
                                    <span
                                        class="flex items-center after:mx-2 after:text-gray-200 after:content-['/'] sm:after:hidden">
                                        <iconify-icon icon="material-symbols:looks-3-outline" width="60" height="60"
                                            aria-hidden="true"></iconify-icon>
                                    </span>
                                </li>
                            </ol>

                            <Transition name="fade">
                                <div v-if="step === 1">
                                    <div class="mb-4">
                                        <dynamic-inputs :label="t('form.product_title')"
                                            :placeholder="t('form.enter_your_product_title')" type="text"
                                            :name="t('form.product_title')" :rules="'required'" :required="true"
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
                                                                <iconify-icon icon="material-symbols:imagesmode"
                                                                    width="70" height="70"
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

                                    <div class="flex flex-wrap gap-4 mt-8">
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
                                            prefixIcon="tabler:file-description" />
                                    </div>

                                    <div class="mb-4">
                                        <dynamic-inputs :label="t('form.product_description_ar')"
                                            :placeholder="t('form.enter_your_product_description_ar')" type="textarea"
                                            :name="t('form.product_description_ar')" :rules="'required'"
                                            :required="true" prefixIcon="tabler:file-description" />
                                    </div>

                                    <div class="mb-4">
                                        <dynamic-inputs :label="t('form.original_price')"
                                            :placeholder="t('form.enter_original_price')" type="number"
                                            :name="t('form.original_price')" prefixIcon="mdi:money" />
                                    </div>

                                    <div class="mb-4">
                                        <dynamic-inputs :label="t('form.discounted_price')"
                                            :placeholder="t('form.enter_discounted_price')" type="number"
                                            :name="t('form.discounted_price')" :rules="'required'" :required="true"
                                            prefixIcon="mdi:money" />
                                    </div>

                                    <div class="flex flex-wrap gap-4 mt-8">
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
                                            :name="t('form.discount')" prefixIcon="mdi:discount-circle-outline" />
                                    </div>

                                    <div class="mb-4">
                                        <label for="availability" class="block mb-2 font-medium text-gray-700">{{
                                            $t('form.availability')
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
                                            <option value="" disabled>{{ $t('form.select_market_country') }}
                                            </option>
                                            <option>{{ $t('form.egypt') }}</option>
                                            <option>{{ $t('form.ksa') }}</option>
                                        </select>
                                    </div>

                                    <div class="flex flex-wrap gap-4 mt-8">
                                        <button @click="prevStep" type="button"
                                            class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5">
                                            {{ $t('btn.back') }}
                                        </button>
                                        <button type="submit" :disabled="loading" @click="handleSubmit"
                                            data-modal-hide="default-modal"
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
        </div>
    </div>
</template>

<script setup>
const { t } = useI18n()
const route = useRoute();
const loading = ref(false);
const step = ref(1);

const handleSubmit = () => {
    console.log('form submitted!')
}

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