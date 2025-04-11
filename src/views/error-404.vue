<template>
    <div>
        <div class="py-6 bg-white sm:py-8 lg:py-12">
            <div class="max-w-screen-lg px-4 mx-auto md:px-8">
                <div class="grid gap-8 sm:grid-cols-2">
                    <div class="flex flex-col items-center justify-center sm:items-start md:py-24 lg:py-32">
                        <p class="mb-4 text-sm font-semibold text-indigo-500 uppercase md:text-base">{{
                            $t('error_page.error_404') }}</p>
                        <h1 class="mb-2 text-2xl font-bold text-center text-gray-800 sm:text-start md:text-3xl">{{
                            $t('error_page.page_not_found') }}</h1>

                        <p class="mb-8 text-center text-gray-500 sm:text-start md:text-lg">{{
                            $t('error_page.the_page_you_are_looking_for_does_not_exist') }}</p>

                        <router-link to="/products-stocks"
                            class="inline-block px-8 py-3 text-sm font-semibold text-center text-gray-500 transition duration-100 bg-gray-200 rounded-lg outline-none ring-indigo-300 hover:bg-gray-300 focus-visible:ring active:text-gray-700 md:text-base">{{
                                $t('btn.go_home') }}</router-link>
                    </div>

                    <div class="relative overflow-hidden bg-gray-100 rounded-lg shadow-lg h-80 md:h-auto">
                        <img src="https://images.unsplash.com/photo-1590642916589-592bca10dfbf?auto=format&q=75&fit=crop&w=600"
                            loading="lazy" alt="error-page-img"
                            class="absolute inset-0 object-cover object-center w-full h-full" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

</script>