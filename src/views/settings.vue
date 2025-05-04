<template>
    <div>
        <div class="flex items-center justify-between my-10 flex-nowrap">
            <p class="text-3xl font-semibold text-gray-700">{{ $t('dashboard.settings') }}</p>
        </div>

        <div class="max-w-4xl p-4 mx-auto space-y-5 border border-gray-400 rounded-lg">
            <div class="pb-5 border-b">
                <form>
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
                                    class="w-full px-3 py-2 transition duration-300 bg-transparent border rounded-md shadow-sm placeholder:text-slate-400 text-slate-700 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 focus:shadow"
                                    :placeholder="t('form.enter_tiktok_url')" />
                            </div>
                        </div>
                    </div>

                    <div class="flex items-center justify-end mt-6 gap-x-6">
                        <button type="button" class="font-semibold text-gray-900 text-sm/6">{{ $t('btn.cancel')
                        }}</button>
                        <button type="submit"
                            class="px-3 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">{{
                                $t('btn.save') }}</button>
                    </div>
                </form>
            </div>

            <div class="pb-5 border-b">
                <form>
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
                                <input type="tel" id="phone" name="phone" autocomplete="tel" inputmode="numeric"
                                    pattern="[0-9]*"
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
                                <input type="tel" id="phone" name="phone" autocomplete="tel" inputmode="numeric"
                                    pattern="[0-9]*"
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
                                <input type="tel" id="whatsapp" name="whatsapp" autocomplete="tel" inputmode="numeric"
                                    pattern="[0-9]*"
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
                                <input type="tel" id="whatsapp" name="whatsapp" autocomplete="tel" inputmode="numeric"
                                    pattern="[0-9]*"
                                    class="w-full py-2 transition duration-300 bg-transparent border rounded-md shadow-sm pe-3 ps-10 placeholder:text-slate-400 text-slate-700 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 focus:shadow"
                                    :placeholder="t('form.enter_whatsApp_number')" />
                            </div>
                        </div>
                    </div>

                    <div class="flex items-center justify-end mt-6 gap-x-6">
                        <button type="button" class="font-semibold text-gray-900 text-sm/6">{{ $t('btn.cancel')
                        }}</button>
                        <button type="submit"
                            class="px-3 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">{{
                                $t('btn.save') }}</button>
                    </div>
                </form>
            </div>

            <div class="pb-5 border-b">
                <form>
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
                                    class="w-full px-3 py-2 transition duration-300 bg-transparent border rounded-md shadow-sm placeholder:text-slate-400 text-slate-700 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 focus:shadow"
                                    :placeholder="t('form.enter_logo_name')" />
                            </div>
                        </div>
                    </div>

                    <div class="flex items-center justify-end mt-6 gap-x-6">
                        <button type="button" class="font-semibold text-gray-900 text-sm/6">{{ $t('btn.cancel')
                        }}</button>
                        <button type="submit"
                            class="px-3 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">{{
                                $t('btn.save') }}</button>
                    </div>
                </form>
            </div>

            <div class="pb-5">
                <form>
                    <p class="mb-4 font-semibold text-gray-900 text-base/7 text-start">{{ $t('form.home_sliders_images')
                        }}</p>
                    <div class="grid grid-cols-2 gap-6 px-4 mx-auto mt-3 md:grid-cols-4 lg:px-6">
                        <!-- img 1 -->
                        <div class="flex flex-col items-center">
                            <div v-if="imagePreview.imageUrl1" class="relative mb-2 w-28 h-28">
                                <img :src="imagePreview.imageUrl1" class="object-cover w-full h-full rounded-lg" />
                                <button type="button" @click="removeImagePreview('imageUrl1')"
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
                                @change="handleSingleImageUpload($event, 'imageUrl1')" />
                        </div>

                        <!-- img 2 -->
                        <div class="flex flex-col items-center">
                            <div v-if="imagePreview.imageUrl2" class="relative mb-2 w-28 h-28">
                                <img :src="imagePreview.imageUrl2" class="object-cover w-full h-full rounded-lg" />
                                <button type="button" @click="removeImagePreview('imageUrl2')"
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
                                @change="handleSingleImageUpload($event, 'imageUrl2')" />
                        </div>

                        <!-- img 3 -->
                        <div class="flex flex-col items-center">
                            <div v-if="imagePreview.imageUrl3" class="relative mb-2 w-28 h-28">
                                <img :src="imagePreview.imageUrl3" class="object-cover w-full h-full rounded-lg" />
                                <button type="button" @click="removeImagePreview('imageUrl3')"
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
                                @change="handleSingleImageUpload($event, 'imageUrl3')" />
                        </div>

                        <!-- img 4 -->
                        <div class="flex flex-col items-center">
                            <div v-if="imagePreview.imageUrl4" class="relative mb-2 w-28 h-28">
                                <img :src="imagePreview.imageUrl4" class="object-cover w-full h-full rounded-lg" />
                                <button type="button" @click="removeImagePreview('imageUrl4')"
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
                                @change="handleSingleImageUpload($event, 'imageUrl4')" />
                        </div>

                        <!-- img 5 -->
                        <div class="flex flex-col items-center">
                            <div v-if="imagePreview.imageUrl5" class="relative mb-2 w-28 h-28">
                                <img :src="imagePreview.imageUrl5" class="object-cover w-full h-full rounded-lg" />
                                <button type="button" @click="removeImagePreview('imageUrl5')"
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
                                @change="handleSingleImageUpload($event, 'imageUrl5')" />
                        </div>

                        <!-- img 6 -->
                        <div class="flex flex-col items-center">
                            <div v-if="imagePreview.imageUrl6" class="relative mb-2 w-28 h-28">
                                <img :src="imagePreview.imageUrl6" class="object-cover w-full h-full rounded-lg" />
                                <button type="button" @click="removeImagePreview('imageUrl6')"
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
                                @change="handleSingleImageUpload($event, 'imageUrl6')" />
                        </div>

                        <!-- img 7 -->
                        <div class="flex flex-col items-center">
                            <div v-if="imagePreview.imageUrl7" class="relative mb-2 w-28 h-28">
                                <img :src="imagePreview.imageUrl7" class="object-cover w-full h-full rounded-lg" />
                                <button type="button" @click="removeImagePreview('imageUrl7')"
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
                                @change="handleSingleImageUpload($event, 'imageUrl7')" />
                        </div>

                        <!-- img 8 -->
                        <div class="flex flex-col items-center">
                            <div v-if="imagePreview.imageUrl8" class="relative mb-2 w-28 h-28">
                                <img :src="imagePreview.imageUrl8" class="object-cover w-full h-full rounded-lg" />
                                <button type="button" @click="removeImagePreview('imageUrl8')"
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
                                @change="handleSingleImageUpload($event, 'imageUrl8')" />
                        </div>
                    </div>

                    <div class="flex items-center justify-end mt-6 gap-x-6">
                        <button type="button" class="font-semibold text-gray-900 text-sm/6">{{ $t('btn.cancel')
                        }}</button>
                        <button type="submit"
                            class="px-3 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">{{
                                $t('btn.save') }}</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
const { t } = useI18n()

const imagePreview = ref({
    imageUrl1: '',
    imageUrl2: '',
    imageUrl3: '',
    imageUrl4: '',
    imageUrl5: '',
    imageUrl6: '',
    imageUrl7: '',
    imageUrl8: '',
});
</script>