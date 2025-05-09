<template>
    <div>
        <div class="max-w-full mx-auto md:py-16">
            <div class="flex flex-col p-6 sm:flex-row">
                <!-- First column (size 8) -->
                <div class="w-full space-y-4 pe-4 sm:w-2/3">
                    <div class="p-3 border border-gray-200 rounded-lg">
                        <div class="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div class="sm:col-span-3">
                                <label for="first-name" class="block text-sm font-medium leading-6 text-gray-900">
                                    {{ $t('form.first_name') }}
                                </label>
                                <div class="mt-1">
                                    <input type="text" name="first-name" id="first-name" autocomplete="given-name"
                                        disabled v-model="userRole.firstName"
                                        class="w-full px-3 py-2 text-gray-600 transition-colors duration-200 bg-gray-100 border rounded-md shadow-sm placeholder:text-gray-400 focus:outline-none focus:border-gray-400 disabled:bg-gray-100 disabled:text-gray-600 disabled:cursor-not-allowed" />
                                </div>
                            </div>

                            <div class="sm:col-span-3">
                                <label for="last-name" class="block text-sm font-medium leading-6 text-gray-900">
                                    {{ $t('form.last_name') }}
                                </label>
                                <div class="mt-1">
                                    <input type="text" name="last-name" id="last-name" autocomplete="family-name"
                                        disabled v-model="userRole.lastName"
                                        class="w-full px-3 py-2 text-gray-600 transition-colors duration-200 bg-gray-100 border rounded-md shadow-sm placeholder:text-gray-400 focus:outline-none focus:border-gray-400 disabled:bg-gray-100 disabled:text-gray-600 disabled:cursor-not-allowed" />
                                </div>
                            </div>
                        </div>

                        <div class="col-span-full">
                            <label for="email" class="block text-sm font-medium leading-6 text-gray-900">
                                {{ $t('form.email') }}
                            </label>
                            <div class="mt-1">
                                <input type="email" name="email" id="email" autocomplete="email" disabled
                                    v-model="userRole.email"
                                    class="w-full px-3 py-2 text-gray-600 transition-colors duration-200 bg-gray-100 border rounded-md shadow-sm placeholder:text-gray-400 focus:outline-none focus:border-gray-400 disabled:bg-gray-100 disabled:text-gray-600 disabled:cursor-not-allowed" />
                            </div>
                        </div>

                        <div class="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div class="sm:col-span-3">
                                <dynamic-inputs :label="t('form.new_password')"
                                    :placeholder="t('form.enter_your_new_password')" type="password" name="password"
                                    :rules="'required'" prefixIcon="ri:lock-password-fill" v-model="newPassword"
                                    :disabled="!isEditing" />
                            </div>

                            <div class="sm:col-span-3">
                                <dynamic-inputs :label="t('form.confirm_password')"
                                    :placeholder="t('form.confirm_your_password')" type="password" name="confirmation"
                                    :rules="'required'" prefixIcon="ri:lock-password-fill" v-model="confirmNewPassword"
                                    :disabled="!isEditing" />
                            </div>
                        </div>

                        <div class="flex items-center justify-end mt-6 gap-x-6">
                            <button type="submit" @click="changePassword" :disabled="loading"
                                class="flex items-center justify-center px-3 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                                <iconify-icon icon="svg-spinners:90-ring" width="20" height="20" class="me-2"
                                    v-if="loading" />
                                <span v-else>{{ $t('btn.change_password') }}</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div class="w-full mt-4 sm:w-1/3 sm:mt-0">
                    <div
                        class="max-w-2xl mx-4 mt-6 text-gray-900 bg-white rounded-lg shadow-xl sm:max-w-sm md:max-w-sm lg:max-w-sm xl:max-w-sm sm:mx-auto md:mx-auto lg:mx-auto xl:mx-auto">
                        <div class="h-32 overflow-hidden rounded-t-lg">
                            <img class="object-cover object-top w-full"
                                src="https://justfields.com/storage/projects/7M5rV059/Mountain.jpg" alt="mountain" />
                        </div>
                        <div
                            class="relative w-32 h-32 mx-auto -mt-16 overflow-hidden border-4 border-gray-200 rounded-full">
                            <img v-if="userRole.role === 'market_owner' && userRole.imageUrl" :src="userRole.imageUrl"
                                class="object-cover object-center w-full h-32" alt="merchant-avatar" />
                            <img v-else src="https://justfields.com/storage/projects/7M5rV059/images.jpg"
                                class="object-cover object-center w-full h-32" alt="user-avatar" />
                        </div>
                        <div class="pb-4 mt-2 text-center">
                            <h2 class="p-2 mx-auto font-semibold capitalize bg-gray-200 rounded-lg max-w-fit">
                                {{ userRole.role === 'market_owner' ? userRole.name : userRole.role }}
                            </h2>
                            <p class="mt-1 font-medium text-gray-700 capitalize">{{ userRole.firstName }} {{
                                userRole.lastName }}</p>
                            <p class="text-gray-500">{{ userRole.email }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- dynamic-toast component -->
        <div class="fixed z-50 pointer-events-none bottom-5 start-5 w-96">
            <div class="pointer-events-auto">
                <dynamic-toast v-if="showToast" :message="toastMessage" :toastType="toastType" :duration="5000"
                    :toastIcon="toastIcon" @toastClosed="showToast = false" />
            </div>
        </div>
    </div>
</template>

<script setup>
const { t } = useI18n()
const router = useRouter();
const authStore = useAuthStore();
const { showToast, toastMessage, toastType, toastIcon, triggerToast } = useToast();
const newPassword = ref("");
const confirmNewPassword = ref("");
const isEditing = ref(false)
const loading = ref(false)

const changePassword = async () => {
    loading.value = true;
    try {
        if (newPassword.value !== confirmNewPassword.value) {
            throw new Error(t('toast.new_passwords_do_not_match'));
        }
        await authStore.changePassword(newPassword.value);
        triggerToast({
            message: t('toast.your_password_has_been_successfully_updated'),
            type: 'success',
            icon: 'mdi-check-circle',
        });
        resetForm();
    } catch (error) {
        triggerToast({
            message: error.message || t('toast.failed_to_update_password'),
            type: 'error',
            icon: 'material-symbols:error-outline-rounded',
        });
    } finally {
        loading.value = false;
        setTimeout(async () => {
            await authStore.logoutUser();
            router.replace('/auth/login');
        }, 3000);
    }
};

const resetForm = () => {
    newPassword.value = ''
    confirmNewPassword.value = ''
}

//userRole composable
const { userRole } = useUserRole()
</script>