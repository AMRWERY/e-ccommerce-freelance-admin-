<template>
    <div>
        <div class="flex items-center justify-center h-screen px-4 bg-gray-100 sm:px-6 lg:px-8">
            <div class="w-full max-w-md space-y-8">
                <div class="p-4 bg-white rounded-md shadow-md">
                    <h2 class="mt-3 mb-6 text-3xl font-bold tracking-tight text-center text-gray-900">
                        {{ $t('form.login_to_your_account') }}
                    </h2>

                    <dynamic-inputs :label="t('form.email')" :placeholder="t('form.enter_your_email')" type="email"
                        name="email" :rules="'required|email'" :required="true"
                        prefixIcon="material-symbols:alternate-email" v-model="email" />

                    <dynamic-inputs :label="t('form.password')" :placeholder="t('form.enter_your_password')"
                        type="password" name="password" :rules="'required|minLength:7'" :required="true"
                        prefixIcon="ri:lock-password-fill" v-model="password" />

                    <button type="submit" :disabled="loading" @click="handleLogin"
                        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center block w-full">
                        <div class="flex items-center justify-center" v-if="loading">
                            <iconify-icon icon="line-md:loading-loop" width="24" height="24"></iconify-icon>
                        </div>
                        <span v-else>{{ $t('btn.login') }}</span>
                    </button>

                    <!-- <div class="mt-4 space-y-2 text-center">
                        <div>
                            <span>{{ $t('form.do_not_have_an_account') }}</span>
                            <router-link to="/auth/sign-up"
                                class="font-semibold text-indigo-600 underline text-md hover:text-indigo-800 ms-1">{{
                                    $t('form.create_one') }}</router-link>
                        </div>
                    </div> -->
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
const email = ref('');
const password = ref('');
const loading = ref(false);
const { showToast, toastMessage, toastType, toastIcon, triggerToast } = useToast();

const handleLogin = async () => {
    if (!email.value || !password.value) return
    loading.value = true;
    try {
        await authStore.loginUser(email.value, password.value);
        triggerToast({
            message: t('toast.successfully_logged_in'),
            type: 'success',
            icon: 'material-symbols:check-circle',
        });
        setTimeout(() => { router.push('/dashboard') }, 3000)
    } catch (error) {
        triggerToast({
            message: t('toast.failed_logged_in'),
            type: 'error',
            icon: 'material-symbols:error-rounded',
        });
    } finally {
        loading.value = false;
    }
};
</script>