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
                            {{ $t('form.add_new_employee') }}
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
                            <dynamic-inputs :label="t('form.first_name')" :placeholder="t('form.enter_first_name')"
                                type="text" name="first_name" :rules="'required|alpha_spaces'" :required="true"
                                prefixIcon="material-symbols:person" v-model="firstName" />
                        </div>

                        <div class="mb-4">
                            <dynamic-inputs :label="t('form.last_name')" :placeholder="t('form.enter_last_name')"
                                type="text" name="last name" :rules="'required|alpha_spaces'" :required="true"
                                prefixIcon="material-symbols:person" v-model="lastName" />
                        </div>

                        <div class="mb-4">
                            <dynamic-inputs :label="t('form.email')" :placeholder="t('form.enter_email')" type="email"
                                name="email" :rules="'required|email'" :required="true"
                                prefixIcon="material-symbols:alternate-email" v-model="email" />
                        </div>

                        <div class="mb-4">
                            <dynamic-inputs :label="t('form.password')" :placeholder="t('form.enter_password')"
                                type="password" name="password" :rules="'required|minLength:7'" :required="true"
                                prefixIcon="ri:lock-password-fill" v-model="password" />
                        </div>

                        <div class="flex items-center justify-end">
                            <button type="submit" :disabled="loading" @click="handleSubmit"
                                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                                <div class="flex items-center justify-center" v-if="loading">
                                    <span class="text-center me-2">{{ $t('btn.please_wait') }}...</span>
                                    <iconify-icon icon="line-md:loading-loop" width="24" height="24"></iconify-icon>
                                </div>
                                <span v-else>
                                    {{ $t('btn.add_employee') }}
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
const authStore = useAuthStore()
const firstName = ref('');
const lastName = ref('');
const email = ref('');
const password = ref('');
const loading = ref(false);
const { showToast, toastMessage, toastType, toastIcon, triggerToast } = useToast();

const props = defineProps({
    modelValue: Boolean
});

const emit = defineEmits(['update:modelValue', 'success']);

const isOpen = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
});

const closeDialog = () => {
    resetForm();
    isOpen.value = false;
};

const handleSubmit = async () => {
    if (!email.value || !password.value || !firstName.value || !lastName.value) {
        triggerToast({
            message: t('toast.failed_add_new_employee'),
            type: 'error',
            icon: 'material-symbols:error-rounded',
        });
        return;
    }
    loading.value = true;
    try {
        await authStore.registerUser(
            email.value,
            password.value,
            firstName.value,
            lastName.value
        );
        triggerToast({
            message: t('toast.successfully_add_new_employee'),
            type: 'success',
            icon: 'material-symbols:check-circle',
        });
        emit('success')
    } catch (error) {
        triggerToast({
            message: t('toast.failed_add_new_employee'),
            type: 'error',
            icon: 'material-symbols:error-rounded',
        });
    } finally {
        loading.value = false;
        closeDialog()
    }
};

const resetForm = () => {
    firstName.value = '';
    lastName.value = '';
    email.value = '';
    password.value = '';
};
</script>