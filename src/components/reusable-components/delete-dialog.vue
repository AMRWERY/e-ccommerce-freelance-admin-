<template>
    <div>
        <div v-if="modelValue"
            class="fixed inset-0 p-4 flex flex-wrap justify-center items-center w-full h-full z-[1000] 
         before:fixed before:inset-0 before:w-full before:h-full before:bg-[rgba(0,0,0,0.5)] overflow-auto font-[sans-serif]">
            <div class="relative w-full max-w-lg p-6 bg-white rounded-lg shadow-lg">
                <button @click="close" class="absolute top-4 end-4">
                    <iconify-icon icon="material-symbols:close-small-rounded" width="24" height="24"
                        class="w-3.5 text-gray-400 hover:text-red-500"></iconify-icon>
                </button>

                <div class="my-4 text-center">
                    <slot name="icon">
                        <iconify-icon icon="material-symbols:delete-forever" width="100" height="100"
                            class="inline text-red-500"></iconify-icon>
                    </slot>

                    <h4 class="mt-4 text-base font-semibold text-gray-800">
                        <slot name="title">{{ $t('dashboard.are_you_sure_you_want_to_delete_this') }}</slot>
                    </h4>

                    <p v-if="message" class="mt-2 text-gray-600">{{ message }}</p>

                    <div class="mt-8 text-center space-s-4">
                        <button @click="close" type="button"
                            class="px-4 py-2 text-sm text-gray-800 bg-gray-200 rounded-lg hover:bg-gray-300 active:bg-gray-200">
                            {{ $t('btn.cancel') }}
                        </button>
                        <button @click="confirmDelete" type="button"
                            class="px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300">
                            {{ $t('btn.delete') }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    modelValue: Boolean,
    message: String
});

const emit = defineEmits(['update:modelValue', 'confirm']);

const close = () => {
    emit('update:modelValue', false);
};

const confirmDelete = () => {
    emit('confirm');
    close();
};
</script>