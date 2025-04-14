<template>
    <div>
        <div class="max-w-full mx-auto md:py-16">
            <div class="flex flex-col p-6 sm:flex-row">
                <!-- First column (size 8) -->
                <div class="w-full pe-4 sm:w-2/3">
                    <form action="" class="space-y-8">
                        <div class="grid grid-cols-1 mt-10 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div class="sm:col-span-3" v-if="userRole.role !== 'market_owner'">
                                <label for="first-name" class="block text-sm font-medium leading-6 text-gray-900">{{
                                    $t('form.first_name') }}</label>
                                <div class="mt-1">
                                    <input type="text" name="first-name" id="first-name" autocomplete="given-name"
                                        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                                </div>
                            </div>

                            <div class="sm:col-span-3" v-if="userRole.role !== 'market_owner'">
                                <label for="last-name" class="block text-sm font-medium leading-6 text-gray-900">{{
                                    $t('form.last_name') }}</label>
                                <div class="mt-1">
                                    <input type="text" name="last-name" id="last-name" autocomplete="family-name"
                                        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                                </div>
                            </div>
                        </div>
                        <div class="col-span-full">
                            <label for="email" class="block text-sm font-medium leading-6 text-gray-900">{{
                                $t('form.email') }}</label>
                            <div class="mt-1">
                                <input type="email" name="email" id="email" autocomplete="email"
                                    class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                            </div>
                        </div>
                        <div class="grid grid-cols-1 mt-10 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div class="sm:col-span-3">
                                <label for="password" class="block text-sm font-medium leading-6 text-gray-900">{{
                                    $t('form.new_password') }}</label>
                                <div class="mt-1">
                                    <input type="password" name="password" id="password" autocomplete="password"
                                        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                                </div>
                            </div>

                            <div class="sm:col-span-3">
                                <label for="new-password" class="block text-sm font-medium leading-6 text-gray-900">{{
                                    $t('form.confirm_new_password') }}</label>
                                <div class="mt-1">
                                    <input type="password" name="new-password" id="new-password" autocomplete="password"
                                        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                                </div>
                            </div>
                        </div>
                        <div class="flex items-center justify-end mt-6 gap-x-6">
                            <button type="submit"
                                class="px-3 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                                {{ $t('btn.update') }}
                            </button>
                        </div>
                    </form>
                </div>

                <div class="w-full mt-4 sm:w-1/3 sm:mt-0">
                    <div
                        class="max-w-2xl mx-4 mt-6 text-gray-900 bg-white rounded-lg shadow-xl sm:max-w-sm md:max-w-sm lg:max-w-sm xl:max-w-sm sm:mx-auto md:mx-auto lg:mx-auto xl:mx-auto">
                        <div class="h-32 overflow-hidden rounded-t-lg">
                            <img class="object-cover object-top w-full"
                                src="https://justfields.com/storage/projects/7M5rV059/Mountain.jpg" alt="Mountain" />
                        </div>
                        <div
                            class="relative w-32 h-32 mx-auto -mt-16 overflow-hidden border-4 border-gray-200 rounded-full">
                            <img v-if="userRole.role === 'market_owner' && userRole.imageUrl" :src="userRole.imageUrl"
                                class="object-cover object-center w-full h-32" alt="merchant-avatar" />
                            <img v-else src="https://justfields.com/storage/projects/7M5rV059/images.jpg"
                                class="object-cover object-center w-full h-32" alt="user-avatar" />
                        </div>
                        <div class="pb-4 mt-2 text-center">
                            <h2 class="font-semibold">
                                {{ userRole.role === 'market_owner' ? userRole.name : userRole.role }}
                            </h2>
                            <p class="text-gray-500">{{ userRole.email }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
//userRole composable
const { userRole } = useUserRole()
</script>