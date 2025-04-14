<template>
    <div>
        <div v-flowbite>
            <div class="mb-4 border-gray-200">
                <ul class="flex flex-wrap -mb-px text-sm font-medium text-center" id="default-tab"
                    data-tabs-toggle="#default-tab-content" role="tablist">
                    <li class="me-2" role="presentation">
                        <button class="inline-block p-3 border rounded-lg" id="daily-tab" data-tabs-target="#daily"
                            type="button" role="tab" aria-controls="daily" aria-selected="false">{{ $t('tabs.daily')
                            }}</button>
                    </li>
                    <li class="me-2" role="presentation">
                        <button class="inline-block p-3 border rounded-lg hover:text-gray-600 hover:border-gray-300"
                            id="weekly-tab" data-tabs-target="#weekly" type="button" role="tab" aria-controls="weekly"
                            aria-selected="false">{{ $t('tabs.Weekly') }}</button>
                    </li>
                    <li class="me-2" role="presentation">
                        <button class="inline-block p-3 border rounded-lg hover:text-gray-600 hover:border-gray-300"
                            id="monthly-tab" data-tabs-target="#monthly" type="button" role="tab"
                            aria-controls="monthly" aria-selected="false">{{ $t('tabs.monthly') }}</button>
                    </li>
                </ul>
            </div>
            <div id="default-tab-content">
                <div class="hidden p-4 rounded-lg bg-gray-50" id="daily" role="tabpanel" aria-labelledby="daily-tab">
                    <p>daily table</p>
                    <!-- dynamicTables component-->
                    <dynamic-tables />
                </div>
                <div class="hidden p-4 rounded-lg bg-gray-50" id="weekly" role="tabpanel" aria-labelledby="weekly-tab">
                    <p>weekly table</p>
                    <!-- dynamicTables component-->
                    <dynamic-tables />
                </div>
                <div class="hidden p-4 rounded-lg bg-gray-50" id="monthly" role="tabpanel"
                    aria-labelledby="monthly-tab">
                    <p>monthly table</p>
                    <!-- dynamicTables component-->
                    <dynamic-tables />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

</script>