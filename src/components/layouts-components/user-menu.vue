<template>
    <div>
        <div v-flowbite>
            <button type="button" class="flex items-center" aria-expanded="false" data-dropdown-toggle="dropdown-user">
                <div class="relative">
                    <img v-if="userRole.role === 'market_owner' && userRole.imageUrl" :src="userRole.imageUrl"
                        class="object-cover w-10 h-10 rounded-full" alt="merchant-avatar">
                    <img v-else src="https://justfields.com/storage/projects/7M5rV059/images.jpg"
                        class="object-cover w-10 h-10 rounded-full" alt="user-avatar">
                    <div class="absolute inset-0 rounded-full shadow-inner"></div>
                </div>
                <div class="ms-4">
                    <h2 class="font-bold text-gray-200 text-md">
                        {{ userRole.role === 'market_owner' ? userRole.name : userRole.role }}
                    </h2>
                    <p class="text-sm text-gray-100">{{ userRole.email }}</p>
                </div>
            </button>
            <div class="z-50 hidden w-40 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-sm shadow-sm dark:bg-gray-700 dark:divide-gray-600"
                id="dropdown-user">
                <ul class="py-1" role="none">
                    <li
                        v-if="userRole && (userRole.role === 'admin' || userRole.role === 'employee' || userRole.role === 'market_owner')">
                        <router-link to="/profile"
                            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                            role="menuitem">{{ $t('profile_menu.profile') }}</router-link>
                    </li>
                    <li v-if="userRole && userRole.role === 'admin'">
                        <router-link to="/earnings"
                            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                            role="menuitem">{{ $t('profile_menu.earnings') }}</router-link>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup>
//userRole composable
const { userRole } = useUserRole()
</script>