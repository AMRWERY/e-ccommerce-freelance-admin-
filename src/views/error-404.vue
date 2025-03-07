<template>
    <div>
        <div class="py-6 bg-white sm:py-8 lg:py-12">
            <div class="max-w-screen-lg px-4 mx-auto md:px-8">
                <div class="grid gap-8 sm:grid-cols-2">
                    <!-- content - start -->
                    <div class="flex flex-col items-center justify-center sm:items-start md:py-24 lg:py-32">
                        <p class="mb-4 text-sm font-semibold text-indigo-500 uppercase md:text-base">Error 404</p>
                        <h1 class="mb-2 text-2xl font-bold text-center text-gray-800 sm:text-left md:text-3xl">Page not
                            found</h1>

                        <p class="mb-8 text-center text-gray-500 sm:text-left md:text-lg">The page you’re looking for
                            doesn’t exist.</p>

                        <router-link to="/"
                            class="inline-block px-8 py-3 text-sm font-semibold text-center text-gray-500 transition duration-100 bg-gray-200 rounded-lg outline-none ring-indigo-300 hover:bg-gray-300 focus-visible:ring active:text-gray-700 md:text-base">Go
                            home</router-link>
                    </div>
                    <!-- content - end -->

                    <!-- image - start -->
                    <div class="relative overflow-hidden bg-gray-100 rounded-lg shadow-lg h-80 md:h-auto">
                        <img src="https://images.unsplash.com/photo-1590642916589-592bca10dfbf?auto=format&q=75&fit=crop&w=600"
                            loading="lazy" alt="Photo by @heydevn"
                            class="absolute inset-0 object-cover object-center w-full h-full" />
                    </div>
                    <!-- image - end -->
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

</script>