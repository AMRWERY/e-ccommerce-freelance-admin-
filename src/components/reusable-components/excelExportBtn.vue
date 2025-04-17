<template>
    <div>
        <button @click="handleExport" data-tooltip-target="tooltip-default" data-tooltip-placement="bottom"
            class="inline-flex items-center px-5 py-2.5 text-blue-700 border border-blue-700 rounded-lg hover:bg-blue-100" v-if="hasPermission('products', 'downloadExcel') || hasPermission('earnings', 'downloadExcel') || hasPermission('earnings-form-marketing', 'downloadExcel')  || hasPermission('orders', 'downloadExcel')">
            <iconify-icon icon="tabler:file-excel" width="24" height="24"></iconify-icon>
        </button>
        <div id="tooltip-default" role="tooltip"
            class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-xs opacity-0 tooltip dark:bg-gray-700">
            {{ $t('tooltip.download_excel') }}
            <div class="tooltip-arrow" data-popper-arrow></div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    exportHandler: {
        type: Function,
        required: true
    }
});

const handleExport = () => {
    try {
        props.exportHandler();
    } catch (error) {
        console.error("Export error:", error);
    }
};

const authStore = useAuthStore();
const user = computed(() => authStore.user);

//usePermissions composables
const { hasPermission } = usePermissions(user);
</script>