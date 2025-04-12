<template>
    <div>
        <div class="flex items-end justify-end mt-4">
            <div class="flex items-center px-4 py-3">
                <div class="flex mt-3 space-s-1 ms-auto">
                    <button role="button" @click="handlePageChange(currentPage - 1)" :disabled="currentPage === 1"
                        class="flex items-center justify-center bg-gray-100 rounded-md shrink-0 w-9 h-9 disabled:opacity-50">
                        <iconify-icon icon="material-symbols:keyboard-arrow-left" width="24" height="24"
                            class="text-gray-400 rtl:rotate-180" />
                    </button>

                    <button v-for="page in totalPages" :key="page" @click="handlePageChange(page)" :class="{
                        'bg-slate-300 text-gray-800': page === currentPage,
                        'bg-slate-100 text-gray-600': page !== currentPage,
                    }"
                        class="flex items-center justify-center shrink-0 border hover:border-blue-500 cursor-pointer text-base font-medium text-spate-900 px-[13px] h-9 rounded-md">
                        {{ page }}
                    </button>

                    <button role="button" @click="handlePageChange(currentPage + 1)"
                        :disabled="currentPage === totalPages"
                        class="flex items-center justify-center border rounded-md cursor-pointer shrink-0 hover:border-blue-500 w-9 h-9 disabled:opacity-50">
                        <iconify-icon icon="material-symbols:keyboard-arrow-right" width="24" height="24"
                            class="text-gray-400 rtl:rotate-180" />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    currentPage: {
        type: Number,
        required: true
    },
    totalPages: {
        type: Number,
        required: true
    }
});

const emit = defineEmits(['page-change']);

const handlePageChange = (page) => {
    emit('page-change', page);
};
</script>