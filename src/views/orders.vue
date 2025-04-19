<template>
  <div>
    <div class="flex flex-col items-start justify-between my-10 md:flex-row md:items-center">
      <h3 class="py-2 mt-5 text-2xl font-bold text-start">
        {{ $t('dashboard.orders') }}
      </h3>
      <div class="flex items-end space-s-4" v-if="!showSkeleton">
        <div class="flex flex-col">
          <label class="mb-1 text-sm font-medium">{{ $t('form.start_date') }}</label>
          <date-picker v-model="startDate" />
        </div>
        <div class="flex flex-col">
          <label class="mb-1 text-sm font-medium">{{ $t('form.end_date') }}</label>
          <date-picker v-model="endDate" />
        </div>
        <button @click="filterOrdersByDate"
          class="text-white bg-[#3b5998] hover:bg-[#3b5998]/90 focus:ring-4 focus:outline-none focus:ring-[#3b5998]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2">
          {{ $t('btn.filter') }}
        </button>
        <div>
          <!-- excelExportBtn component -->
          <excel-export-btn :export-handler="handleExport" />
        </div>
      </div>
    </div>

    <!-- Add earnings section -->
    <div class="grid grid-cols-1 gap-4 mt-8 mb-8 sm:grid-cols-2 lg:grid-cols-4" v-if="!showSkeleton">
      <!-- Total Earnings Card -->
      <div class="p-4 bg-white rounded-lg shadow-md">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500">{{ $t('dashboard.total_earnings') }}</p>
            <p class="mt-1 text-xl font-semibold text-indigo-600">
              {{ $n(totalEarnings, 'currency', currencyLocale(defaultMarket)) }}
            </p>
          </div>
          <div class="p-1.5 bg-indigo-100 rounded-full flex items-center justify-center">
            <iconify-icon icon="mdi:cash-multiple" class="text-indigo-600" width="24" height="24" />
          </div>
        </div>
      </div>
      <!-- Total Orders Card -->
      <div class="p-4 bg-white rounded-lg shadow-md">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500">{{ $t('dashboard.total_orders') }}</p>
            <p class="mt-1 text-xl font-semibold text-blue-600">{{ totalOrders }}</p>
          </div>
          <div class="p-1.5 bg-blue-100 rounded-full flex items-center justify-center">
            <iconify-icon icon="mdi:shopping" class="text-blue-600" width="24" height="24" />
          </div>
        </div>
      </div>
      <!-- Completed Orders Card -->
      <div class="p-4 bg-white rounded-lg shadow-md">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500">{{ $t('dashboard.completed_orders') }}</p>
            <p class="mt-1 text-xl font-semibold text-green-600">{{ completedOrders }}</p>
          </div>
          <div class="p-1.5 bg-green-100 rounded-full flex items-center justify-center">
            <iconify-icon icon="mdi:check-circle" class="text-green-600" width="24" height="24" />
          </div>
        </div>
      </div>
      <!-- Pending Orders Card -->
      <div class="p-4 bg-white rounded-lg shadow-md">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500">{{ $t('dashboard.pending_orders') }}</p>
            <p class="mt-1 text-xl font-semibold text-amber-600">{{ pendingOrders }}</p>
          </div>
          <div class="p-1.5 rounded-full bg-amber-100 flex items-center justify-center">
            <iconify-icon icon="mdi:clock-outline" class="text-amber-600" width="24" height="24" />
          </div>
        </div>
      </div>
    </div>
    
    <div
      class="relative flex flex-col w-full h-full overflow-scroll overflow-y-hidden text-gray-700 bg-white rounded-lg shadow-md bg-clip-border">
      <template v-if="showSkeleton">
        <!-- tableSkeletonLoader component -->
        <table-skeleton-loader :headers="skeletonHeaders" :rows="5" />
      </template>

      <template v-else>
        <table class="w-full table-auto text-start min-w-max">
          <thead>
            <tr>
              <th class="p-4 border-b border-slate-200 bg-slate-50">
                <p class="text-sm font-normal leading-none text-slate-500">
                  #
                </p>
              </th>
              <th class="p-4 border-b border-slate-200 bg-slate-50">
                <p class="text-sm font-normal leading-none text-slate-500">
                  {{ $t('dashboard.order_id') }}
                </p>
              </th>
              <th class="p-4 border-b border-slate-200 bg-slate-50">
                <p class="text-sm font-normal leading-none text-slate-500">
                  {{ $t('dashboard.email') }}
                </p>
              </th>
              <th class="p-4 border-b border-slate-200 bg-slate-50">
                <p class="text-sm font-normal leading-none text-slate-500">
                  {{ $t('dashboard.customer_name') }}
                </p>
              </th>
              <th class="p-4 border-b border-slate-200 bg-slate-50">
                <p class="text-sm font-normal leading-none text-slate-500">
                  {{ $t('dashboard.date') }}
                </p>
              </th>
              <th class="p-4 border-b border-slate-200 bg-slate-50">
                <p class="text-sm font-normal leading-none text-slate-500">
                  {{ $t('dashboard.phone_number') }}
                </p>
              </th>
              <th class="p-4 border-b border-slate-200 bg-slate-50">
                <p class="text-sm font-normal leading-none text-slate-500">
                  {{ $t('dashboard.country') }}
                </p>
              </th>
              <th class="p-4 border-b border-slate-200 bg-slate-50">
                <p class="text-sm font-normal leading-none text-slate-500">
                  {{ $t('dashboard.governorate') }}
                </p>
              </th>
              <th class="p-4 border-b border-slate-200 bg-slate-50">
                <p class="text-sm font-normal leading-none text-slate-500">
                  {{ $t('dashboard.status') }}
                </p>
              </th>
              <th class="p-4 border-b border-slate-200 bg-slate-50"></th>
            </tr>
          </thead>

          <tbody v-if="checkoutStore.paginatedOrders.length === 0">
            <tr>
              <td colspan="10" class="p-4 text-center">
                <!-- NoDataMessage component -->
                <No-data-message :message="$t('no_data.no_orders_found')" icon="tabler:package-off" />
              </td>
            </tr>
          </tbody>

          <tbody v-else>
            <tr class="border-b hover:bg-slate-50 border-slate-200"
              v-for="(order, index) in checkoutStore.paginatedOrders" :key="order.id">
              <td class="p-4">
                <p class="block text-sm font-semibold text-slate-800">{{ (checkoutStore.currentPage -
                  1) *
                  checkoutStore.ordersPerPage +
                  index +
                  1 }}</p>
              </td>
              <td class="p-4">
                <p class="block text-sm font-semibold text-slate-800">{{ order.orderId }}</p>
              </td>
              <td class="p-4">
                <p class="block text-sm font-semibold text-slate-800">{{ order.deliveryDetails.email
                }}</p>
              </td>
              <td class="p-4">
                <p class="block text-sm font-semibold text-slate-800">{{ order.deliveryDetails.name }}
                </p>
              </td>
              <td class="p-4">
                <p class="block text-sm font-semibold text-slate-800">{{ order.date }}</p>
              </td>
              <td class="p-4">
                <p class="block text-sm font-semibold text-slate-800">{{
                  order.deliveryDetails.phoneNumber }}</p>
              </td>
              <td class="p-4">
                <p class="block text-sm font-semibold text-slate-800">
                  {{ getTranslatedLocation(order.deliveryDetails.country) }}
                </p>
              </td>
              <td class="p-4">
                <p class="block text-sm font-semibold text-slate-800">
                  {{ getTranslatedLocation(order.deliveryDetails.city) }}
                </p>
              </td>
              <td class="p-4">
                <div class="inline-flex px-3 py-1 text-xs font-medium rounded-full" :class="{
                  'bg-green-100 text-green-800': getStatusTitle(order.statusId)?.status === 'Order Placed',
                  'bg-amber-100 text-amber-800': getStatusTitle(order.statusId)?.status === 'Processing',
                  'bg-blue-100 text-blue-800': getStatusTitle(order.statusId)?.status === 'Shipped',
                  'bg-indigo-100 text-indigo-800': getStatusTitle(order.statusId)?.status === 'Out for Delivery',
                  'bg-purple-100 text-purple-800': getStatusTitle(order.statusId)?.status === 'Delivered'
                }">
                  <span class="inline-flex items-center">
                    <iconify-icon :icon="getStatusIcon(order.statusId)" class="me-1.5" width="15" height="15" />
                    {{ getTranslatedStatus(order.statusId) }}
                  </span>
                </div>
              </td>
              <td class="p-4">
                <div class="flex items-center gap-2">
                  <button @click="openOrderDetails(order)" v-if="hasPermission('orders', 'changeStatus')"
                    class="flex items-center justify-center w-8 h-8 text-blue-500 rounded hover:text-blue-600">
                    <iconify-icon icon="material-symbols:edit" width="24" height="24" />
                  </button>
                  <button @click="deleteOrder(order.id)" v-if="hasPermission('orders', 'delete')"
                    class="flex items-center justify-center w-8 h-8 text-red-500 rounded hover:text-red-600">
                    <iconify-icon icon="material-symbols:delete" width="24" height="24" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </template>
    </div>

    <!-- paginationControls component -->
    <pagination-controls v-if="!showSkeleton && checkoutStore.paginatedOrders.length > 0"
      :current-page="checkoutStore.currentPage" :total-pages="checkoutStore.totalPages"
      @page-change="checkoutStore.changePage" />

    <!-- order-details-dialog component -->
    <order-details-dialog v-model="isDialogOpen" :order-data="selectedOrder" v-if="selectedOrder" />

    <!-- dynamic-toast component -->
    <div class="fixed z-50 pointer-events-none bottom-5 start-5 w-96">
      <div class="pointer-events-auto">
        <dynamic-toast v-if="showToast" :message="toastMessage" :toastType="toastType" :duration="5000"
          :toastIcon="toastIcon" @toastClosed="showToast = false" />
      </div>
    </div>
  </div>
</template>

<script setup>
const authStore = useAuthStore();
const user = computed(() => authStore.user);

//usePermissions composables
const { hasPermission } = usePermissions(user);

const { t, locale } = useI18n()
const checkoutStore = useCheckoutStore();
const showSkeleton = ref(true);
const { showToast, toastMessage, toastType, toastIcon, triggerToast } = useToast()

const orderStatus = ref([])

onMounted(async () => {
  const startTime = Date.now()

  try {
    // Fetch data
    await Promise.all([
      checkoutStore.fetchOrders(),
      checkoutStore.fetchStatus()
    ])
    orderStatus.value = checkoutStore.status
  } finally {
    // Calculate remaining time to complete 3 seconds
    const elapsed = Date.now() - startTime
    const remaining = Math.max(3000 - elapsed, 0)

    // Wait for remaining time before hiding skeleton
    setTimeout(() => {
      showSkeleton.value = false
    }, remaining)
  }
})

const isDialogOpen = ref(false);
const selectedOrder = ref(null);

const openOrderDetails = (order) => {
  selectedOrder.value = order;
  isDialogOpen.value = true;
};

watch(isDialogOpen, (newVal) => {
  if (!newVal) {
    selectedOrder.value = null;
  }
});

const startDate = ref(null);
const endDate = ref(null);

const filterOrdersByDate = () => {
  if (!startDate.value || !endDate.value) {
    return;
  }
  const filteredOrders = checkoutStore.orders.filter(order => {
    const orderDate = new Date(order.date);
    return orderDate >= startDate.value && orderDate <= endDate.value;
  });
  checkoutStore.paginatedOrders = filteredOrders;
};

const deleteOrder = (orderId) => {
  const order = checkoutStore.paginatedOrders.find(o => o.id === orderId);
  if (order) {
    order.loading = true;
  }
  checkoutStore.deleteOrder(orderId)
    .then(() => {
      checkoutStore.paginatedOrders = checkoutStore.paginatedOrders.filter(order => order.id !== orderId);
      triggerToast({
        message: t('toast.order_deleted_successfully'),
        type: 'success',
        icon: 'mdi:check-circle',
      });
    })
    .catch((error) => {
      triggerToast({
        message: t('toast.order_deletion_failed'),
        type: 'error',
        icon: 'mdi:alert-circle',
      });
    })
    .finally(() => {
      setTimeout(() => {
        if (order) {
          order.loading = false;
        }
      }, 3000);
    });
};

const getStatusTitle = (statusId) => {
  return checkoutStore.status.find((s) => s.id === statusId);
};

const getTranslatedStatus = (statusId) => {
  const status = getStatusTitle(statusId)?.status;
  return t(`permissions.status.${status?.toLowerCase().replace(/\s+/g, '_')}`) || t('permissions.status.unknown');
};

const getStatusIcon = (statusId) => {
  const status = getStatusTitle(statusId)?.status;
  switch (status) {
    case 'Order Placed':
      return 'mdi:check-circle';
    case 'Processing':
      return 'mdi:clock-outline';
    case 'Shipped':
      return 'mdi:truck-outline';
    case 'Out for Delivery':
      return 'mdi:package-variant';
    case 'Delivered':
      return 'mdi:check-circle';
    default:
      return 'mdi:help-circle';
  }
};

// useExcelExport composable
const { exportDataToExcel } = useExcelExport();

const excelConfig = ref({
  filename: 'orders_export.xlsx',
  sheetName: 'Orders',
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
  exportDataToExcel(checkoutStore.orders, excelConfig.value);
};

const skeletonHeaders = [
  { label: '#', loaderWidth: 'w-8' },
  { label: 'Order ID', loaderWidth: 'w-32' },
  { label: 'Email', loaderWidth: 'w-24' },
  { label: 'Customer name', loaderWidth: 'w-24' },
  { label: 'Date', loaderWidth: 'w-24' },
  { label: 'Phone number', loaderWidth: 'w-24' },
  { label: 'Country', loaderWidth: 'w-24' },
  { label: 'Governorate', loaderWidth: 'w-24' },
  { label: 'Status', loaderWidth: 'w-24' },
  { label: 'Actions', type: 'action' }
];

const { getTranslatedLocation } = useLocationTranslations();

import { useCurrencyLocale } from '@/composables/useCurrencyLocale'

const { currencyLocale } = useCurrencyLocale()
const defaultMarket = 'Egypt'

// Computed properties for statistics
const totalEarnings = computed(() => {
  return checkoutStore.orders.reduce((total, order) => {
    if (order.cart && Array.isArray(order.cart)) {
      return total + order.cart.reduce((orderTotal, item) => {
        return orderTotal + (parseFloat(item.discountedPrice || 0) * (item.quantity || 1));
      }, 0);
    }
    return total;
  }, 0);
});

const totalOrders = computed(() => checkoutStore.orders.length);

const completedOrders = computed(() => {
  return checkoutStore.orders.filter(order => {
    const status = getStatusTitle(order.statusId)?.status;
    return status === 'Delivered';
  }).length;
});

const pendingOrders = computed(() => {
  return checkoutStore.orders.filter(order => {
    const status = getStatusTitle(order.statusId)?.status;
    return status !== 'Delivered';
  }).length;
});
</script>