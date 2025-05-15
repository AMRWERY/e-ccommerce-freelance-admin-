<template>
    <div>
        <div class="flex items-center justify-between my-10 flex-nowrap">
            <p class="text-3xl font-semibold text-gray-700">{{ $t('dashboard.settings') }}</p>
        </div>

        <div class="max-w-4xl p-4 mx-auto space-y-5 border border-gray-400 rounded-lg">
            <div class="pb-5 border-b">
                <form @submit.prevent="handleSocialMediaSubmit">
                    <p class="mb-4 font-semibold text-gray-900 text-base/7 text-start">{{ $t('form.social_media') }}</p>
                    <div class="grid grid-cols-1 gap-y-4 sm:grid-cols-6">
                        <div class="col-span-full">
                            <label for="facebook" class="block font-medium text-gray-900 text-sm/6">{{
                                $t('form.facebook') }}</label>
                            <div class="relative">
                                <div class="absolute inset-y-0 flex items-center pointer-events-none pe-3 end-0">
                                    <img src="/facebook.svg" alt="facebook-icon" class="w-6 h-6">
                                </div>
                                <input type="text" id="facebook" name="facebook" autocomplete="off"
                                    v-model="socialMediaForm.facebook"
                                    class="w-full px-3 py-2 transition duration-300 bg-transparent border rounded-md shadow-sm placeholder:text-slate-400 text-slate-700 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 focus:shadow"
                                    :placeholder="t('form.enter_facebook_url')" />
                            </div>
                        </div>

                        <div class="col-span-full">
                            <label for="instagram" class="block font-medium text-gray-900 text-sm/6">{{
                                $t('form.instagram') }}</label>
                            <div class="relative">
                                <div class="absolute inset-y-0 flex items-center pointer-events-none end-0 pe-3">
                                    <img src="/instagram.svg" alt="instagram-icon" class="w-6 h-6">
                                </div>
                                <input type="text" id="instagram" name="instagram" autocomplete="off"
                                    v-model="socialMediaForm.instagram"
                                    class="w-full px-3 py-2 transition duration-300 bg-transparent border rounded-md shadow-sm placeholder:text-slate-400 text-slate-700 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 focus:shadow"
                                    :placeholder="t('form.enter_instagram_url')" />
                            </div>
                        </div>

                        <div class="col-span-full">
                            <label for="snapchat" class="block font-medium text-gray-900 text-sm/6">{{
                                $t('form.snapchat') }}</label>
                            <div class="relative">
                                <div class="absolute inset-y-0 flex items-center pointer-events-none end-0 pe-3">
                                    <img src="/snapchat.svg" alt="snapchat-icon" class="w-6 h-6">
                                </div>
                                <input type="text" id="snapchat" name="snapchat" autocomplete="off"
                                    v-model="socialMediaForm.snapchat"
                                    class="w-full px-3 py-2 transition duration-300 bg-transparent border rounded-md shadow-sm placeholder:text-slate-400 text-slate-700 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 focus:shadow"
                                    :placeholder="t('form.enter_snapchat_url')" />
                            </div>
                        </div>

                        <div class="col-span-full">
                            <label for="tiktok" class="block font-medium text-gray-900 text-sm/6">{{ $t('form.tiktok')
                                }}</label>
                            <div class="relative">
                                <div class="absolute inset-y-0 flex items-center pointer-events-none pe-3 end-0">
                                    <img src="/tiktok-outline.svg" alt="tiktok-icon" class="w-6 h-6">
                                </div>
                                <input type="text" id="tiktok" name="tiktok" autocomplete="off"
                                    v-model="socialMediaForm.tiktok"
                                    class="w-full px-3 py-2 transition duration-300 bg-transparent border rounded-md shadow-sm placeholder:text-slate-400 text-slate-700 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 focus:shadow"
                                    :placeholder="t('form.enter_tiktok_url')" />
                            </div>
                        </div>
                    </div>

                    <div class="flex items-center justify-end mt-6 gap-x-6">
                        <button type="submit" :disabled="isSocialLoading"
                            class="px-3 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                            <span v-if="isSocialLoading">
                                <iconify-icon icon="eos-icons:loading" class="text-lg animate-spin" />
                            </span>
                            <span v-else>{{ $t('btn.save') }}</span>
                        </button>
                    </div>
                </form>
            </div>

            <div class="pb-5 border-b">
                <form @submit.prevent="handleContactNumbersSubmit">
                    <p class="mb-4 font-semibold text-gray-900 text-base/7 text-start">{{ $t('form.contact_numbers') }}
                    </p>
                    <div class="grid grid-cols-1 gap-y-4 sm:grid-cols-6 gap-x-6">
                        <div class="sm:col-span-3">
                            <label for="phone" class="block font-medium text-gray-900 text-sm/6">{{
                                $t('form.phone_number') }}</label>
                            <div class="relative">
                                <div class="absolute inset-y-0 flex items-center pointer-events-none end-0 pe-3">
                                    <iconify-icon icon="heroicons-outline:phone"
                                        class="w-5 h-5 text-gray-400"></iconify-icon>
                                </div>
                                <input type="tel" id="phone" name="phone" autocomplete="tel"
                                    v-model="contactNumbersForm.phone" pattern="[0-9]*"
                                    class="w-full py-2 transition duration-300 bg-transparent border rounded-md shadow-sm pe-3 ps-10 placeholder:text-slate-400 text-slate-700 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 focus:shadow"
                                    :placeholder="t('form.enter_phone_number')" />
                            </div>
                        </div>

                        <div class="sm:col-span-3">
                            <label for="phone" class="block font-medium text-gray-900 text-sm/6">{{
                                $t('form.another_phone_number') }}</label>
                            <div class="relative">
                                <div class="absolute inset-y-0 flex items-center pointer-events-none end-0 pe-3">
                                    <iconify-icon icon="heroicons-outline:phone"
                                        class="w-5 h-5 text-gray-400"></iconify-icon>
                                </div>
                                <input type="tel" id="phone" name="phone" autocomplete="tel"
                                    v-model="contactNumbersForm.anotherPhone" pattern="[0-9]*"
                                    class="w-full py-2 transition duration-300 bg-transparent border rounded-md shadow-sm pe-3 ps-10 placeholder:text-slate-400 text-slate-700 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 focus:shadow"
                                    :placeholder="t('form.enter_phone_number')" />
                            </div>
                        </div>

                        <div class="sm:col-span-3">
                            <label for="whatsapp" class="block font-medium text-gray-900 text-sm/6">{{
                                $t('form.whatsApp_number') }}</label>
                            <div class="relative">
                                <div class="absolute inset-y-0 flex items-center pointer-events-none pe-3 end-0">
                                    <img src="/whatsapp.svg" alt="whatsapp-icon" class="w-5 h-5">
                                </div>
                                <input type="tel" id="whatsapp" name="whatsapp" autocomplete="tel"
                                    v-model="contactNumbersForm.whatsapp" pattern="[0-9]*"
                                    class="w-full py-2 transition duration-300 bg-transparent border rounded-md shadow-sm pe-3 ps-10 placeholder:text-slate-400 text-slate-700 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 focus:shadow"
                                    :placeholder="t('form.enter_whatsApp_number')" />
                            </div>
                        </div>

                        <div class="sm:col-span-3">
                            <label for="whatsapp" class="block font-medium text-gray-900 text-sm/6">{{
                                $t('form.another_whatsApp_number') }}</label>
                            <div class="relative">
                                <div class="absolute inset-y-0 flex items-center pointer-events-none pe-3 end-0">
                                    <img src="/whatsapp.svg" alt="whatsapp-icon" class="w-5 h-5">
                                </div>
                                <input type="tel" id="whatsapp" name="whatsapp" autocomplete="tel"
                                    v-model="contactNumbersForm.anotherWhatsapp" pattern="[0-9]*"
                                    class="w-full py-2 transition duration-300 bg-transparent border rounded-md shadow-sm pe-3 ps-10 placeholder:text-slate-400 text-slate-700 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 focus:shadow"
                                    :placeholder="t('form.enter_whatsApp_number')" />
                            </div>
                        </div>
                    </div>

                    <div class="flex items-center justify-end mt-6 gap-x-6">
                        <button type="submit" :disabled="isContactLoading"
                            class="px-3 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                            <span v-if="isContactLoading">
                                <iconify-icon icon="eos-icons:loading" class="text-lg animate-spin" />
                            </span>
                            <span v-else>{{ $t('btn.save') }}</span>
                        </button>
                    </div>
                </form>
            </div>

            <div class="pb-5 border-b">
                <form @submit.prevent="handleLogoSubmit">
                    <p class="mb-4 font-semibold text-gray-900 text-base/7 text-start">{{ $t('form.logo_name') }}</p>
                    <div class="grid grid-cols-1 gap-y-4 sm:grid-cols-6 gap-x-6">
                        <div class="sm:col-span-3">
                            <label for="logo-name" class="block font-medium text-gray-900 text-sm/6">{{
                                $t('form.logo_name') }}</label>
                            <div class="relative">
                                <div class="absolute inset-y-0 flex items-center pointer-events-none pe-3 end-0">
                                    <iconify-icon icon="material-symbols:signature"
                                        class="w-5 h-5 text-gray-400"></iconify-icon>
                                </div>
                                <input type="text" id="logo-name" name="logo-name" autocomplete="off"
                                    v-model="logoForm.name"
                                    class="w-full px-3 py-2 transition duration-300 bg-transparent border rounded-md shadow-sm placeholder:text-slate-400 text-slate-700 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 focus:shadow"
                                    :placeholder="t('form.enter_logo_name')" />
                            </div>
                        </div>

                        <div class="sm:col-span-full">
                            <label for="logo-image" class="block font-medium text-gray-900 text-sm/6">{{ $t('form.logo_image') }}</label>
                            <div class="relative">
                                <div v-if="logoForm.imagePreview" class="relative mt-3 mb-2 w-28 h-28">
                                    <img :src="logoForm.imagePreview" class="object-cover w-full h-full rounded-lg" />
                                    <button type="button" @click="removeLogoImage"
                                        class="absolute p-0.5 text-white bg-red-500 rounded-full -top-2 -end-2 hover:bg-red-600 flex items-center">
                                        <iconify-icon icon="material-symbols:close-small-rounded" width="20" height="20"></iconify-icon>
                                    </button>
                                </div>
                                <div v-else class="p-4 mb-2 border border-indigo-500 rounded-lg shadow-md w-28 h-28 bg-gray-50">
                                    <label for="logo-image-input" class="flex flex-col items-center justify-center h-full gap-2 cursor-pointer">
                                        <iconify-icon icon="material-symbols:photo" width="30" height="30" class="text-indigo-600"></iconify-icon>
                                        <p class="font-medium text-center text-gray-600">{{ $t('form.upload_file') }}</p>
                                    </label>
                                </div>
                                <input id="logo-image-input" type="file" class="hidden" accept="image/*" @change="handleLogoImageUpload" />
                            </div>
                        </div>
                    </div>

                    <div class="flex justify-end mt-4">
                        <button type="submit"
                            class="px-3 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                            <span v-if="logoForm.loading" class="flex items-center gap-2">
                                <iconify-icon icon="eos-icons:loading" class="text-lg animate-spin" />
                            </span>
                            <span v-else>{{ $t('btn.save') }}</span>
                        </button>
                    </div>
                </form>
            </div>

            <div class="pb-5">
                <form @submit.prevent="handleHomeSlidersSubmit">
                    <p class="mb-4 font-semibold text-gray-900 text-base/7 text-start">{{ $t('form.home_sliders_images')
                        }}</p>
                    <div class="grid grid-cols-2 gap-6 px-4 mx-auto mt-3 md:grid-cols-4 lg:px-6">
                        <!-- img 1 -->
                        <div class="flex flex-col items-center">
                            <div v-if="homeSlidersPreviews.imageUrl1" class="relative mb-2 w-28 h-28">
                                <img :src="homeSlidersPreviews.imageUrl1"
                                    class="object-cover w-full h-full rounded-lg" />
                                <button type="button" @click="removeHomeSliderImage('imageUrl1')"
                                    class="absolute p-0.5 text-white bg-red-500 rounded-full -top-2 -end-2 hover:bg-red-600 flex items-center">
                                    <iconify-icon icon="material-symbols:close-small-rounded" width="20"
                                        height="20"></iconify-icon>
                                </button>
                            </div>
                            <div v-else
                                class="p-4 mb-2 border border-indigo-500 rounded-lg shadow-md w-28 h-28 bg-gray-50">
                                <label for="imageUrl1"
                                    class="flex flex-col items-center justify-center h-full gap-2 cursor-pointer">
                                    <iconify-icon icon="material-symbols:photo" width="30" height="30"
                                        class="text-indigo-600"></iconify-icon>
                                    <p class="font-medium text-center text-gray-600">{{
                                        $t('form.upload_file')
                                    }}</p>
                                </label>
                            </div>
                            <input id="imageUrl1" type="file" class="hidden" accept="image/*"
                                @change="handleHomeSliderImageUpload($event, 'imageUrl1')" />
                        </div>

                        <!-- img 2 -->
                        <div class="flex flex-col items-center">
                            <div v-if="homeSlidersPreviews.imageUrl2" class="relative mb-2 w-28 h-28">
                                <img :src="homeSlidersPreviews.imageUrl2"
                                    class="object-cover w-full h-full rounded-lg" />
                                <button type="button" @click="removeHomeSliderImage('imageUrl2')"
                                    class="absolute p-0.5 text-white bg-red-500 rounded-full -top-2 -end-2 hover:bg-red-600 flex items-center">
                                    <iconify-icon icon="material-symbols:close-small-rounded" width="20"
                                        height="20"></iconify-icon>
                                </button>
                            </div>
                            <div v-else
                                class="p-4 mb-2 border border-indigo-500 rounded-lg shadow-md w-28 h-28 bg-gray-50">
                                <label for="imageUrl2"
                                    class="flex flex-col items-center justify-center h-full gap-2 cursor-pointer">
                                    <iconify-icon icon="material-symbols:photo" width="30" height="30"
                                        class="text-indigo-600"></iconify-icon>
                                    <p class="font-medium text-center text-gray-600">{{
                                        $t('form.upload_file')
                                    }}</p>
                                </label>
                            </div>
                            <input id="imageUrl2" type="file" class="hidden" accept="image/*"
                                @change="handleHomeSliderImageUpload($event, 'imageUrl2')" />
                        </div>

                        <!-- img 3 -->
                        <div class="flex flex-col items-center">
                            <div v-if="homeSlidersPreviews.imageUrl3" class="relative mb-2 w-28 h-28">
                                <img :src="homeSlidersPreviews.imageUrl3"
                                    class="object-cover w-full h-full rounded-lg" />
                                <button type="button" @click="removeHomeSliderImage('imageUrl3')"
                                    class="absolute p-0.5 text-white bg-red-500 rounded-full -top-2 -end-2 hover:bg-red-600 flex items-center">
                                    <iconify-icon icon="material-symbols:close-small-rounded" width="20"
                                        height="20"></iconify-icon>
                                </button>
                            </div>
                            <div v-else
                                class="p-4 mb-2 border border-indigo-500 rounded-lg shadow-md w-28 h-28 bg-gray-50">
                                <label for="imageUrl3"
                                    class="flex flex-col items-center justify-center h-full gap-2 cursor-pointer">
                                    <iconify-icon icon="material-symbols:photo" width="30" height="30"
                                        class="text-indigo-600"></iconify-icon>
                                    <p class="font-medium text-center text-gray-600">{{
                                        $t('form.upload_file')
                                    }}</p>
                                </label>
                            </div>
                            <input id="imageUrl3" type="file" class="hidden" accept="image/*"
                                @change="handleHomeSliderImageUpload($event, 'imageUrl3')" />
                        </div>

                        <!-- img 4 -->
                        <div class="flex flex-col items-center">
                            <div v-if="homeSlidersPreviews.imageUrl4" class="relative mb-2 w-28 h-28">
                                <img :src="homeSlidersPreviews.imageUrl4"
                                    class="object-cover w-full h-full rounded-lg" />
                                <button type="button" @click="removeHomeSliderImage('imageUrl4')"
                                    class="absolute p-0.5 text-white bg-red-500 rounded-full -top-2 -end-2 hover:bg-red-600 flex items-center">
                                    <iconify-icon icon="material-symbols:close-small-rounded" width="20"
                                        height="20"></iconify-icon>
                                </button>
                            </div>
                            <div v-else
                                class="p-4 mb-2 border border-indigo-500 rounded-lg shadow-md w-28 h-28 bg-gray-50">
                                <label for="imageUrl4"
                                    class="flex flex-col items-center justify-center h-full gap-2 cursor-pointer">
                                    <iconify-icon icon="material-symbols:photo" width="30" height="30"
                                        class="text-indigo-600"></iconify-icon>
                                    <p class="font-medium text-center text-gray-600">{{
                                        $t('form.upload_file')
                                    }}</p>
                                </label>
                            </div>
                            <input id="imageUrl4" type="file" class="hidden" accept="image/*"
                                @change="handleHomeSliderImageUpload($event, 'imageUrl4')" />
                        </div>

                        <!-- img 5 -->
                        <div class="flex flex-col items-center">
                            <div v-if="homeSlidersPreviews.imageUrl5" class="relative mb-2 w-28 h-28">
                                <img :src="homeSlidersPreviews.imageUrl5"
                                    class="object-cover w-full h-full rounded-lg" />
                                <button type="button" @click="removeHomeSliderImage('imageUrl5')"
                                    class="absolute p-0.5 text-white bg-red-500 rounded-full -top-2 -end-2 hover:bg-red-600 flex items-center">
                                    <iconify-icon icon="material-symbols:close-small-rounded" width="20"
                                        height="20"></iconify-icon>
                                </button>
                            </div>
                            <div v-else
                                class="p-4 mb-2 border border-indigo-500 rounded-lg shadow-md w-28 h-28 bg-gray-50">
                                <label for="imageUrl5"
                                    class="flex flex-col items-center justify-center h-full gap-2 cursor-pointer">
                                    <iconify-icon icon="material-symbols:photo" width="30" height="30"
                                        class="text-indigo-600"></iconify-icon>
                                    <p class="font-medium text-center text-gray-600">{{
                                        $t('form.upload_file')
                                    }}</p>
                                </label>
                            </div>
                            <input id="imageUrl5" type="file" class="hidden" accept="image/*"
                                @change="handleHomeSliderImageUpload($event, 'imageUrl5')" />
                        </div>

                        <!-- img 6 -->
                        <div class="flex flex-col items-center">
                            <div v-if="homeSlidersPreviews.imageUrl6" class="relative mb-2 w-28 h-28">
                                <img :src="homeSlidersPreviews.imageUrl6"
                                    class="object-cover w-full h-full rounded-lg" />
                                <button type="button" @click="removeHomeSliderImage('imageUrl6')"
                                    class="absolute p-0.5 text-white bg-red-500 rounded-full -top-2 -end-2 hover:bg-red-600 flex items-center">
                                    <iconify-icon icon="material-symbols:close-small-rounded" width="20"
                                        height="20"></iconify-icon>
                                </button>
                            </div>
                            <div v-else
                                class="p-4 mb-2 border border-indigo-500 rounded-lg shadow-md w-28 h-28 bg-gray-50">
                                <label for="imageUrl6"
                                    class="flex flex-col items-center justify-center h-full gap-2 cursor-pointer">
                                    <iconify-icon icon="material-symbols:photo" width="30" height="30"
                                        class="text-indigo-600"></iconify-icon>
                                    <p class="font-medium text-center text-gray-600">{{
                                        $t('form.upload_file')
                                    }}</p>
                                </label>
                            </div>
                            <input id="imageUrl6" type="file" class="hidden" accept="image/*"
                                @change="handleHomeSliderImageUpload($event, 'imageUrl6')" />
                        </div>

                        <!-- img 7 -->
                        <div class="flex flex-col items-center">
                            <div v-if="homeSlidersPreviews.imageUrl7" class="relative mb-2 w-28 h-28">
                                <img :src="homeSlidersPreviews.imageUrl7"
                                    class="object-cover w-full h-full rounded-lg" />
                                <button type="button" @click="removeHomeSliderImage('imageUrl7')"
                                    class="absolute p-0.5 text-white bg-red-500 rounded-full -top-2 -end-2 hover:bg-red-600 flex items-center">
                                    <iconify-icon icon="material-symbols:close-small-rounded" width="20"
                                        height="20"></iconify-icon>
                                </button>
                            </div>
                            <div v-else
                                class="p-4 mb-2 border border-indigo-500 rounded-lg shadow-md w-28 h-28 bg-gray-50">
                                <label for="imageUrl7"
                                    class="flex flex-col items-center justify-center h-full gap-2 cursor-pointer">
                                    <iconify-icon icon="material-symbols:photo" width="30" height="30"
                                        class="text-indigo-600"></iconify-icon>
                                    <p class="font-medium text-center text-gray-600">{{
                                        $t('form.upload_file')
                                    }}</p>
                                </label>
                            </div>
                            <input id="imageUrl7" type="file" class="hidden" accept="image/*"
                                @change="handleHomeSliderImageUpload($event, 'imageUrl7')" />
                        </div>

                        <!-- img 8 -->
                        <div class="flex flex-col items-center">
                            <div v-if="homeSlidersPreviews.imageUrl8" class="relative mb-2 w-28 h-28">
                                <img :src="homeSlidersPreviews.imageUrl8"
                                    class="object-cover w-full h-full rounded-lg" />
                                <button type="button" @click="removeHomeSliderImage('imageUrl8')"
                                    class="absolute p-0.5 text-white bg-red-500 rounded-full -top-2 -end-2 hover:bg-red-600 flex items-center">
                                    <iconify-icon icon="material-symbols:close-small-rounded" width="20"
                                        height="20"></iconify-icon>
                                </button>
                            </div>
                            <div v-else
                                class="p-4 mb-2 border border-indigo-500 rounded-lg shadow-md w-28 h-28 bg-gray-50">
                                <label for="imageUrl8"
                                    class="flex flex-col items-center justify-center h-full gap-2 cursor-pointer">
                                    <iconify-icon icon="material-symbols:photo" width="30" height="30"
                                        class="text-indigo-600"></iconify-icon>
                                    <p class="font-medium text-center text-gray-600">{{
                                        $t('form.upload_file')
                                    }}</p>
                                </label>
                            </div>
                            <input id="imageUrl8" type="file" class="hidden" accept="image/*"
                                @change="handleHomeSliderImageUpload($event, 'imageUrl8')" />
                        </div>
                    </div>

                    <div class="flex items-center justify-end mt-6 gap-x-6">
                        <button type="submit" :disabled="isSlidersLoading"
                            class="px-3 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                            <iconify-icon icon="eos-icons:loading" class="text-lg animate-spin"
                                v-if="isSlidersLoading" />
                            <span v-else>{{ $t('btn.save') }}</span>
                        </button>
                    </div>
                </form>
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
import { reactive } from 'vue'
import { useSettingsStore } from '@/stores/settingsStore'
import { useI18n } from 'vue-i18n'
import { useToast } from '@/composables/useToast'

const settingsStore = useSettingsStore()
const { t } = useI18n()
const { showToast, toastMessage, toastType, toastIcon, triggerToast } = useToast()

const logoForm = reactive({
    name: '',
    loading: false,
    imagePreview: null,
    imageFile: null
})

const handleLogoImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
        if (file.type.startsWith('image/')) {
            logoForm.imageFile = file
            const reader = new FileReader()
            reader.onload = (e) => {
                logoForm.imagePreview = e.target.result
            }
            reader.readAsDataURL(file)
        } else {
            triggerToast('error', t('toast.invalid_file_type'), 'material-symbols:error-rounded')
        }
    }
}

const removeLogoImage = () => {
    logoForm.imageFile = null
    logoForm.imagePreview = null
    const input = document.getElementById('logo-image-input')
    if (input) input.value = ''
}

const handleLogoSubmit = async () => {
    try {
        logoForm.loading = true
        const formData = new FormData()
        formData.append('name', logoForm.name)
        if (logoForm.imageFile) {
            formData.append('logo', logoForm.imageFile)
        }
        
        await settingsStore.updateLogo(formData)
        triggerToast('success', t('toast.logo_updated'), 'material-symbols:check-circle-rounded')
        
        // Reset form after successful submission
        logoForm.name = ''
        removeLogoImage()
    } catch (error) {
        console.error('Error updating logo:', error)
        triggerToast('error', t('toast.update_failed'), 'material-symbols:error-rounded')
    } finally {
        logoForm.loading = false
    }
}

const isSocialLoading = ref(false);
const isContactLoading = ref(false);
const isLogoLoading = ref(false);
const isSlidersLoading = ref(false);

const socialMediaForm = ref({
    facebook: '',
    instagram: '',
    snapchat: '',
    tiktok: ''
});

const contactNumbersForm = ref({
    phone: '',
    anotherPhone: '',
    whatsapp: '',
    anotherWhatsapp: ''
});

const homeSlidersFiles = ref({});
const homeSlidersRemoved = ref({});
const homeSlidersPreviews = ref({
    imageUrl1: '', imageUrl2: '', imageUrl3: '', imageUrl4: '',
    imageUrl5: '', imageUrl6: '', imageUrl7: '', imageUrl8: ''
});

onMounted(async () => {
    await settingsStore.fetchSettings();
    const settings = settingsStore.settings;
    if (settings) {
        socialMediaForm.value = { ...settings.socialMedia };
        contactNumbersForm.value = { ...settings.contactNumbers };
        logoForm.name = settings.logo?.name || '';
        logoForm.imagePreview = settings.logo?.imageUrl || null;
        for (let i = 1; i <= 8; i++) {
            const key = `imageUrl${i}`;
            homeSlidersPreviews.value[key] = settings.homeSliders?.[key] || '';
        }
    }
});

const handleHomeSliderImageUpload = (event, imageKey) => {
    const file = event.target.files[0];
    if (file) {
        homeSlidersFiles.value[imageKey] = file;
        const reader = new FileReader();
        reader.onload = (e) => {
            homeSlidersPreviews.value[imageKey] = e.target.result;
        };
        reader.readAsDataURL(file);
    }
    triggerToast({
        message: t('toast.successfully_upload_img'),
        type: 'success',
        icon: 'material-symbols:check-circle',
    });
};

const handleSocialMediaSubmit = async () => {
    try {
        isSocialLoading.value = true;
        await settingsStore.saveSection('socialMedia', socialMediaForm.value);
        await new Promise(resolve => setTimeout(resolve, 3000)); // 3s delay
        triggerToast({
            message: t('toast.social_updated'),
            type: 'success',
            icon: 'material-symbols:check-circle',
        });
    } catch (error) {
        triggerToast({
            message: t('toast.update_failed'),
            type: 'error',
            icon: 'material-symbols:error',
        });
    } finally {
        isSocialLoading.value = false;
    }
};

const handleContactNumbersSubmit = async () => {
    try {
        isContactLoading.value = true
        await settingsStore.saveSection('contactNumbers', contactNumbersForm.value);
        triggerToast({
            message: t('toast.contact_number_updated'),
            type: 'success',
            icon: 'material-symbols:check-circle',
        });
    } catch (error) {
        triggerToast({
            message: t('toast.update_failed'),
            type: 'error',
            icon: 'material-symbols:error',
        });
    } finally {
        isContactLoading.value = false
    }
};

const handleHomeSlidersSubmit = async () => {
    try {
        isSlidersLoading.value = true;
        await settingsStore.saveSection(
            'homeSliders',
            {},
            homeSlidersFiles.value,
            homeSlidersRemoved.value
        );
        triggerToast({
            message: t('toast.sliders_updated'),
            type: 'success',
            icon: 'material-symbols:check-circle',
        });
    } catch (error) {
        triggerToast({
            message: t('toast.upload_failed'),
            type: 'error',
            icon: 'material-symbols:error',
        });
    } finally {
        isSlidersLoading.value = false;
    }
};

const removeHomeSliderImage = (imageKey) => {
    if (settingsStore.settings?.homeSliders?.[imageKey]) {
        homeSlidersRemoved.value[imageKey] = true;
    }
    homeSlidersPreviews.value[imageKey] = '';
    delete homeSlidersFiles.value[imageKey];
    if (settingsStore.settings.homeSliders) {
        delete settingsStore.settings.homeSliders[imageKey];
    }
};
</script>