<template>
    <div>
        <div class="px-4 py-6 bg-white sm:py-8 lg:py-16">
            <div class="max-w-2xl p-4 mx-auto border border-gray-100 rounded-lg shadow-lg md:p-8">
                <h2 class="mt-3 mb-6 text-3xl font-bold tracking-tight text-center text-gray-900">
                    {{ $t('form.register_new_merchant') }}
                </h2>

                <ol
                    class="flex items-center w-full max-w-2xl text-sm font-medium text-center text-gray-500 sm:text-base">
                    <li :class="step === 1 ? 'text-blue-600' : 'text-gray-400'"
                        class="after:border-1 flex items-center after:mx-6 after:hidden after:h-1 after:w-full after:border-b after:border-gray-200 sm:after:inline-block sm:after:content-[''] md:w-full xl:after:mx-10">
                        <span
                            class="flex items-center after:mx-2 after:text-gray-200 after:content-['/'] sm:after:hidden">
                            <iconify-icon icon="material-symbols:looks-one-outline" width="60"
                                height="60"></iconify-icon>
                            <span class="hidden sm:inline-flex sm:ms-2 whitespace-nowrap">{{ $t('form.market_info')
                                }}</span>
                        </span>
                    </li>
                    <li class="flex items-center shrink-0" :class="step === 2 ? 'text-blue-600' : 'text-gray-400'">
                        <span
                            class="flex items-center after:mx-2 after:text-gray-200 after:content-['/'] sm:after:hidden">
                            <iconify-icon icon="material-symbols:looks-two-outline" width="60"
                                height="60"></iconify-icon>
                            <span class="hidden sm:inline-flex sm:ms-2 whitespace-nowrap">{{ $t('form.personal_info')
                                }}</span>
                        </span>
                    </li>
                </ol>

                <Transition name="fade">
                    <div class="grid gap-4 mb-4 sm:grid-cols-1" v-if="step === 1">
                        <dynamic-inputs :label="t('form.market_name')" :placeholder="t('form.enter_your_market_name')"
                            type="text" :name="t('form.market_name')" :rules="'required|alpha_spaces'" :required="true"
                            prefixIcon="mingcute:shop-line" v-model="newMerchantStore.marketName" />

                        <div class="mx-auto overflow-hidden rounded-lg">
                            <div class="md:flex">
                                <div class="w-full">
                                    <div
                                        class="relative flex items-center justify-center h-48 bg-gray-100 border-2 border-blue-700 border-dotted rounded-lg">
                                        <div class="absolute">
                                            <div class="flex flex-col items-center">
                                                <iconify-icon icon="material-symbols:image-rounded" width="80"
                                                    height="80" class="text-gray-400"></iconify-icon>
                                                <span class="block font-normal text-gray-400">{{
                                                    $t('form.attach_your_file_here') }}</span>
                                            </div>
                                        </div>
                                        <input type="file" class="w-full h-full opacity-0" @change="handleFileUpload">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="flex items-center justify-center mb-4 space-s-6" v-if="previewImage">
                            <div class="p-1 border border-gray-200 rounded-lg">
                                <img :src="previewImage" class="object-cover w-32 h-32 rounded-lg">
                            </div>
                        </div>

                        <dynamic-inputs :label="t('form.description')"
                            :placeholder="t('form.tell_us_about_your_market')" type="textarea"
                            :name="t('form.description')" prefixIcon="material-symbols:chat-outline"
                            v-model="newMerchantStore.description" />

                        <div class="flex flex-wrap justify-end gap-4 mt-8">
                            <button role="button" @click="nextStep"
                                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                                {{ $t('btn.next_step_personal_info') }}
                            </button>
                        </div>
                    </div>
                </Transition>

                <Transition name="fade">
                    <div v-if="step === 2" class="grid gap-4 mb-4 sm:grid-cols-1">
                        <dynamic-inputs v-model="newMerchantStore.firstName" :label="t('form.first_name')"
                            :name="t('form.first_name')" :placeholder="t('form.enter_your_first_name')" type="text"
                            :rules="'required|alpha_spaces'" prefixIcon="material-symbols:account-box" />

                        <dynamic-inputs v-model="newMerchantStore.lastName" :label="t('form.last_name')"
                            :name="t('form.last_name')" :placeholder="t('form.enter_your_last_name')" type="text"
                            :rules="'required|alpha_spaces'" prefixIcon="material-symbols:account-box" />

                        <dynamic-inputs v-model="newMerchantStore.email" :label="t('form.email')"
                            :name="t('form.email')" :placeholder="t('form.enter_your_email')" type="email"
                            :rules="'required|email'" prefixIcon="material-symbols:alternate-email" />

                        <dynamic-inputs v-model="newMerchantStore.password" :label="t('form.password')"
                            :name="t('form.password')" :placeholder="t('form.enter_your_password')" type="password"
                            :rules="'required|minLength:7'" prefixIcon="ri:lock-password-fill" />

                        <div class="flex gap-4">
                            <button @click="prevStep"
                                class="text-gray-700 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full">
                                {{ $t('btn.back') }}
                            </button>
                            <button type="submit" :disabled="loading" @click="handleSubmit"
                                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full">
                                <div class="flex items-center justify-center" v-if="loading">
                                    <iconify-icon icon="line-md:loading-loop" width="24" height="24"></iconify-icon>
                                </div>
                                <span v-else>{{ $t('btn.register_market') }}</span>
                            </button>
                        </div>
                    </div>
                </Transition>
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
const newMerchantStore = useNewMerchantStore()
const step = ref(1);
const previewImage = ref("");
const loading = ref(false);
const { showToast, toastMessage, toastType, toastIcon, triggerToast } = useToast();

const nextStep = () => {
    step.value = 2;
};

const prevStep = () => {
    step.value = 1;
};

const handleFileUpload = (event) => {
    const file = event.target.files[0];
    newMerchantStore.imageFile = file;
    if (file) {
        previewImage.value = URL.createObjectURL(file);
        triggerToast({
            message: t('toast.successfully_upload_img'),
            type: 'success',
            icon: 'material-symbols:check-circle',
        });
    } else {
        previewImage.value = "";
        triggerToast({
            message: t('toast.failed_upload_img'),
            type: 'error',
            icon: 'material-symbols:error-rounded',
        });
    }
};

const handleSubmit = async () => {
    loading.value = true;
    try {
        await newMerchantStore.registerMarket()
        triggerToast({
            message: t('toast.successfully_register_new_merchant'),
            type: 'success',
            icon: 'material-symbols:check-circle',
        });
    } catch (err) {
        triggerToast({
            message: t('toast.failed_register_new_merchant'),
            type: 'error',
            icon: 'material-symbols:error-rounded',
        });
    } finally {
        loading.value = false;
    }
}
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