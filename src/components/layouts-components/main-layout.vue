<template>
    <div>
        <div v-flowbite>
            <nav
                class="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                <div class="px-3 py-3 lg:px-5 lg:ps-3">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center justify-start rtl:justify-end">
                            <button data-drawer-target="logo-sidebar" data-drawer-toggle="logo-sidebar"
                                aria-controls="logo-sidebar" type="button"
                                class="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                                <span class="sr-only">Open sidebar</span>
                                <iconify-icon icon="mdi:menu" width="24" height="24" aria-hidden="true"></iconify-icon>
                            </button>
                            <router-link to="" class="flex ms-2 md:me-24">
                                <span
                                    class="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">e-ccommerce</span>
                            </router-link>
                        </div>
                        <div class="flex items-center">
                            <router-link to="" class="font-semibold text-white me-4" role="button"
                                v-if="localeStore.isRTL">
                                <span class="[&>svg]:w-5" @click="setLocale('en')">
                                    En
                                </span>
                            </router-link>
                            <router-link to="" class="font-semibold text-white me-4" role="button" v-else>
                                <span class="[&>svg]:w-5" @click="setLocale('ar')">
                                    العربية
                                </span>
                            </router-link>

                            <div class="flex items-center ms-3">
                                <div>
                                    <button type="button" class="flex text-sm bg-gray-800 rounded-full"
                                        aria-expanded="false" data-dropdown-toggle="dropdown-user">
                                        <span class="sr-only">Open user menu</span>
                                        <img class="w-8 h-8 rounded-full"
                                            src="https://justfields.com/storage/projects/7M5rV059/images.jpg"
                                            alt="user photo">
                                    </button>
                                </div>
                                <div class="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-sm shadow-sm dark:bg-gray-700 dark:divide-gray-600"
                                    id="dropdown-user">
                                    <div class="px-4 py-3" role="none">
                                        <p class="text-sm text-gray-900 dark:text-white" role="none">
                                            Admin
                                        </p>
                                        <p class="text-sm font-medium text-gray-900 truncate dark:text-gray-300"
                                            role="none">
                                            test@test.com
                                        </p>
                                    </div>
                                    <ul class="py-1" role="none">
                                        <li>
                                            <router-link to=""
                                                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                                                role="menuitem">Dashboard</router-link>
                                        </li>
                                        <li>
                                            <router-link to=""
                                                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                                                role="menuitem">Settings</router-link>
                                        </li>
                                        <li>
                                            <router-link to=""
                                                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                                                role="menuitem">Earnings</router-link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <aside id="logo-sidebar"
                class="fixed top-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-gray-200 border-e start-0 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
                aria-label="Sidebar">
                <div class="relative h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
                    <ul class="space-y-2 font-medium">
                        <li>
                            <router-link to="/products" exact-active-class="bg-gray-100 dark:bg-gray-700"
                                class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                                @click="closeSidebarOnMobile">
                                <iconify-icon icon="mdi:shopping-basket" width="24" height="24" aria-hidden="true"
                                    class="text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"></iconify-icon>
                                <span class="flex-1 ms-3 whitespace-nowrap">{{ $t('layout.products') }}</span>
                            </router-link>
                        </li>
                        <li v-if="userRole === 'admin'">
                            <router-link to="/categories" exact-active-class="bg-gray-100 dark:bg-gray-700"
                                class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                                @click="closeSidebarOnMobile">
                                <iconify-icon icon="material-symbols:category" width="24" height="24" aria-hidden="true"
                                    class="text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">></iconify-icon>
                                <span class="flex-1 ms-3 whitespace-nowrap">{{ $t('layout.categories') }}</span>
                            </router-link>
                        </li>
                        <li v-if="userRole === 'admin'">
                            <router-link to="/orders" exact-active-class="bg-gray-100 dark:bg-gray-700"
                                class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                                @click="closeSidebarOnMobile">
                                <iconify-icon icon="mdi:clipboard-list" width="24" height="24" aria-hidden="true"
                                    class="text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"></iconify-icon>
                                <span class="flex-1 ms-3 whitespace-nowrap">{{ $t('layout.orders') }}</span>
                            </router-link>
                        </li>
                        <li v-if="userRole === 'admin'">
                            <router-link to="/users" exact-active-class="bg-gray-100 dark:bg-gray-700"
                                class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                                @click="closeSidebarOnMobile">
                                <iconify-icon icon="mdi:users-group" width="24" height="24" aria-hidden="true"
                                    class="text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"></iconify-icon>
                                <span class="flex-1 ms-3 whitespace-nowrap">{{ $t('layout.users') }}</span>
                            </router-link>
                        </li>
                        <!-- <li v-if="userRole === 'admin'">
                            <router-link to=""
                               exact-active-class="bg-gray-100 dark:bg-gray-700" class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group" @click="closeSidebarOnMobile">
                                <iconify-icon icon="mdi:mailbox-up" width="24" height="24" aria-hidden="true"
                                    class="text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"></iconify-icon>
                                <span class="flex-1 ms-3 whitespace-nowrap">{{ $t('layout.messages') }}</span>
                            </router-link>
                        </li> -->
                        <li v-if="userRole === 'admin'">
                            <router-link to="/markets" exact-active-class="bg-gray-100 dark:bg-gray-700"
                                class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                                @click="closeSidebarOnMobile">
                                <iconify-icon icon="mdi:shop" width="24" height="24" aria-hidden="true"
                                    class="text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"></iconify-icon>
                                <span class="flex-1 ms-3 whitespace-nowrap">{{ $t('layout.markets') }}</span>
                            </router-link>
                        </li>
                    </ul>
                </div>
                <div
                    class="sticky px-4 pt-4 mt-auto bg-white end-0 start-0 bottom-6 dark:bg-gray-800 dark:border-gray-700">
                    <router-link to="" role="button" @click="logout"
                        class="block w-full px-4 py-2 font-semibold text-center text-gray-700 transition-colors border border-gray-300 rounded-lg text-md bg-gray-50 hover:bg-gray-200">
                        {{ $t('btn.logout') }}
                    </router-link>
                </div>
            </aside>
        </div>

        <main>
            <div class="p-4 mt-12 sm:ml-64">
                <router-view />
            </div>
        </main>
    </div>
</template>

<script setup>
const localeStore = useLocaleStore();
const authStore = useAuthStore();
const router = useRouter()
const { locale } = useI18n();

onMounted(() => {
    locale.value = localeStore.locale;
});

const setLocale = (value) => {
    locale.value = value;
    localeStore.updateLocale(value);
};

computed(() => {
    const storedLocale = localeStore.locale;
    setLocale(storedLocale);
});

const logout = async () => {
    try {
        await authStore.logoutUser();
        router.replace('/auth/login')
    } catch (err) {
        console.error('Error during logout:', err);
    }
};

const userRole = computed(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
        try {
            const parsed = JSON.parse(storedUser);
            return parsed.role;
        } catch (err) {
            console.error("Error parsing user from localStorage:", err);
            return null;
        }
    }
    return null;
});

const closeSidebarOnMobile = () => {
    if (window.innerWidth < 640) {
        const toggleButton = document.querySelector('[data-drawer-toggle="logo-sidebar"]');
        if (toggleButton) {
            toggleButton.click();
        }
    }
};
</script>