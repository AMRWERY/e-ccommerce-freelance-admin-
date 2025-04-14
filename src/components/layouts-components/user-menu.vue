<template>
    <div>
        <router-link to="/profile" type="button" class="flex items-center">
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
        </router-link>
    </div>
</template>

<script setup>
//userRole composable
const { userRole } = useUserRole()
</script>