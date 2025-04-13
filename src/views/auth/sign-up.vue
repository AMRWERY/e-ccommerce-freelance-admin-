<template>
    <div>
        <div class="flex items-center justify-center h-screen px-4 bg-gray-100 sm:px-6 lg:px-8">
            <div class="w-full max-w-md space-y-8">
                <div class="p-4 bg-white rounded-md shadow-md">
                    <h2 class="mt-3 mb-6 text-3xl font-bold tracking-tight text-center text-gray-900">
                        {{ $t('form.sign_up_for_an_account') }}
                    </h2>

                    <dynamic-inputs :label="t('form.first_name')" :placeholder="t('form.enter_your_first_name')"
                        type="text" name="first_name" :rules="'required|alpha_spaces'" :required="true"
                        prefixIcon="material-symbols:person" v-model="firstName" />

                    <dynamic-inputs :label="t('form.last_name')" :placeholder="t('form.enter_your_last_name')"
                        type="text" name="last name" :rules="'required|alpha_spaces'" :required="true"
                        prefixIcon="material-symbols:person" v-model="lastName" />

                    <dynamic-inputs :label="t('form.email')" :placeholder="t('form.enter_your_email')" type="email"
                        name="email" :rules="'required|email'" :required="true"
                        prefixIcon="material-symbols:alternate-email" v-model="email" />

                    <dynamic-inputs :label="t('form.password')" :placeholder="t('form.enter_your_password')"
                        type="password" name="password" :rules="'required|minLength:7'" :required="true"
                        prefixIcon="ri:lock-password-fill" v-model="password" />

                    <button type="submit" :disabled="loading" @click="handleSignup"
                        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center block w-full">
                        <div class="flex items-center justify-center" v-if="loading">
                            <iconify-icon icon="line-md:loading-loop" width="24" height="24"></iconify-icon>
                        </div>
                        <span v-else>{{ $t('btn.create_an_account') }}</span>
                    </button>
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
const authStore = useAuthStore()
const { t } = useI18n()
const router = useRouter()
const firstName = ref('');
const lastName = ref('');
const email = ref('');
const password = ref('');
const loading = ref(false);
const { showToast, toastMessage, toastType, toastIcon, triggerToast } = useToast();

const handleSignup = async () => {
    if (!email.value || !password.value || !firstName.value || !lastName.value) {
        triggerToast({
            message: t('toast.failed_sign_up'),
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
            message: t('toast.successfully_sign_up'),
            type: 'success',
            icon: 'material-symbols:check-circle',
        });
        setTimeout(() => { router.push('/auth/login') }, 3000)
    } catch (error) {
        triggerToast({
            message: t('toast.failed_sign_up'),
            type: 'error',
            icon: 'material-symbols:error-rounded',
        });
    } finally {
        loading.value = false;
    }
};
</script>