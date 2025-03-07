<template>
    <div>
        <div class="max-w-4xl p-4 mx-auto my-4 border">
            <div class="px-4 sm:px-0">
                <h3 class="font-semibold text-gray-900 text-base/7">Applicant Information</h3>
                <p class="max-w-2xl mt-1 text-gray-500 text-sm/6">Personal details and application.</p>
            </div>
            <div class="mt-6 border-t border-gray-100">
                <dl class="divide-y divide-gray-100">
                    <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt class="font-medium text-gray-900 text-sm/6">Full name</dt>
                        <dd class="mt-1 text-gray-700 text-sm/6 sm:col-span-2 sm:mt-0">Margot Foster</dd>
                    </div>
                    <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt class="font-medium text-gray-900 text-sm/6">Application for</dt>
                        <dd class="mt-1 text-gray-700 text-sm/6 sm:col-span-2 sm:mt-0">Backend Developer</dd>
                    </div>
                    <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt class="font-medium text-gray-900 text-sm/6">Email address</dt>
                        <dd class="mt-1 text-gray-700 text-sm/6 sm:col-span-2 sm:mt-0">margotfoster@example.com</dd>
                    </div>
                    <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt class="font-medium text-gray-900 text-sm/6">Salary expectation</dt>
                        <dd class="mt-1 text-gray-700 text-sm/6 sm:col-span-2 sm:mt-0">$120,000</dd>
                    </div>
                    <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt class="font-medium text-gray-900 text-sm/6">About</dt>
                        <dd class="mt-1 text-gray-700 text-sm/6 sm:col-span-2 sm:mt-0">Fugiat ipsum ipsum deserunt culpa
                            aute sint do nostrud anim incididunt cillum culpa consequat. Excepteur qui ipsum aliquip
                            consequat sint. Sit id mollit nulla mollit nostrud in ea officia proident. Irure nostrud
                            pariatur mollit ad adipisicing reprehenderit deserunt qui eu.</dd>
                    </div>
                    <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt class="font-medium text-gray-900 text-sm/6">Attachments</dt>
                        <dd class="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                            <ul role="list" class="border border-gray-200 divide-y divide-gray-100 rounded-md">
                                <li class="flex items-center justify-between py-4 pe-5 ps-4 text-sm/6">
                                    <div class="flex items-center flex-1 w-0">
                                        <iconify-icon icon="mdi:paperclip" width="24" height="24"
                                            class="text-gray-400 shrink-0" aria-hidden="true"></iconify-icon>
                                        <div class="flex flex-1 min-w-0 gap-2 ms-4">
                                            <span class="font-medium truncate">resume_back_end_developer.pdf</span>
                                            <span class="text-gray-400 shrink-0">2.4mb</span>
                                        </div>
                                    </div>
                                    <div class="ms-4 shrink-0">
                                        <router-link to=""
                                            class="font-medium text-indigo-600 hover:text-indigo-500">Download</router-link>
                                    </div>
                                </li>
                                <li class="flex items-center justify-between py-4 pe-5 ps-4 text-sm/6">
                                    <div class="flex items-center flex-1 w-0">
                                        <iconify-icon icon="mdi:paperclip" width="24" height="24"
                                            class="text-gray-400 shrink-0" aria-hidden="true"></iconify-icon>
                                        <div class="flex flex-1 min-w-0 gap-2 ms-4">
                                            <span class="font-medium truncate">coverletter_back_end_developer.pdf</span>
                                            <span class="text-gray-400 shrink-0">4.5mb</span>
                                        </div>
                                    </div>
                                    <div class="ms-4 shrink-0">
                                        <router-link to=""
                                            class="font-medium text-indigo-600 hover:text-indigo-500">Download</router-link>
                                    </div>
                                </li>
                            </ul>
                        </dd>
                    </div>
                </dl>
            </div>
        </div>
    </div>
</template>

<script setup>

</script>