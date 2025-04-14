<template>
    <div>
        <div class="flex items-center justify-between my-10 flex-nowrap">
            <p class="text-3xl font-semibold text-gray-700">{{ $t('dashboard.earnings') }}</p>
            <div class="flex items-center justify-center gap-4 ms-auto">
                <div>
                    <!-- excelExportBtn component -->
                    <excel-export-btn :export-handler="handleExport" />
                </div>
            </div>
        </div>

        <!-- dynamicTabs component -->
        <dynamic-tabs />
    </div>
</template>

<script setup>
const { t, locale } = useI18n()

// useExcelExport composable
const { exportDataToExcel } = useExcelExport();

const excelConfig = ref({
    filename: 'products_export.xlsx',
    sheetName: 'Products',
    headers: [
        {
            label: t('dashboard.product_name'),
            key: "title",
            mapper: (item) => locale.value === 'ar' ? item.titleAr : item.title
        },
        {
            label: t('dashboard.target_market'),
            key: "targetMarket"
        },
        {
            label: t('dashboard.price'),
            key: "discountedPrice",
            type: "n",
            numberFormat: '0',
            mapper: (item) => Math.round(parseFloat(item.discountedPrice)),
            cellStyle: { font: { color: { rgb: "00AA00" }, bold: true } }
        },
        {
            label: t('dashboard.discount'),
            key: "discount"
        },
        {
            label: t('dashboard.availability'),
            key: "numberOfStock"
        }
    ],
    columnWidths: [5, 15, 25, 20, 15, 15, 10]
});

const handleExport = () => {
    exportDataToExcel(productStore.products, excelConfig.value);
};
</script>