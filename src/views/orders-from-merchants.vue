<template>
  <div>
    <div class="flex flex-col items-start justify-between my-10 md:flex-row md:items-center">
      <h3 class="py-2 mt-5 text-2xl font-bold text-start">
        {{ $t('dashboard.merchants_orders') }}
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
          class="text-white bg-[#3b5998] hover:bg-[#3b5998]/90 focus:ring-4 focus:outline-none focus:ring-[#3b5998]/50 font-medium rounded-lg text-sm px-5 py-3 text-center inline-flex items-center me-2">
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
          <thead class="text-xs text-gray-700 capitalize bg-gray-50">
            <tr>
              <th scope="col" class="w-[4%] px-6 py-3">
                                    <input type="checkbox" v-model="selectAll"
                                        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500">
                                </th>
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
                  {{ $t('dashboard.merchant_name') }}
                </p>
              </th>
              <th class="p-4 border-b border-slate-200 bg-slate-50">
                <p class="text-sm font-normal leading-none text-slate-500">
                  {{ $t('dashboard.order_date') }}
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
                  {{ $t('dashboard.quantity') }}
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

          <tbody v-if="merchantsOrdersStore.paginatedOrders.length === 0">
            <tr>
              <td colspan="10" class="p-4 text-center">
                <!-- NoDataMessage component -->
                <No-data-message :message="$t('no_data.no_orders_found')" icon="tabler:package-off" />
              </td>
            </tr>
          </tbody>

          <tbody v-else>
            <tr class="bg-white border-b border-gray-200 hover:bg-gray-50"
              v-for="(order, index) in merchantsOrdersStore.paginatedOrders" :key="order.id">
              <td class="px-6 py-4">
                                    <input type="checkbox" v-model="selectedOrders" :value="order.id"
                                        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500">
                                </td>
              <td class="p-4">
                <p class="block text-sm font-semibold text-slate-800">
                  {{ (merchantsOrdersStore.currentPage - 1) * merchantsOrdersStore.ordersPerPage + index + 1 }}
                </p>
              </td>
              <td class="p-4">
                <p class="block text-sm font-semibold text-slate-800">{{ order.orderId }}</p>
              </td>
              <td class="p-4">
                <p>{{ order.merchantName }}</p>
              </td>
              <td class="p-4">
                <p>{{ formatDate(order.createdAt) }}</p>
              </td>
              <td class="p-4">
                <p>{{ order.phoneNumber }}</p>
              </td>
              <td class="p-4">
                <div class="flex items-center gap-2">
                  <p>{{ getTranslatedLocation(order.country || 'Egypt') }}</p>
                  <img :src="getCountryFlag(order.country || 'Egypt')" :alt="order.country || 'Egypt'"
                    class="w-5 h-4" />
                </div>
              </td>
              <td class="p-4">
                <p class="font-semibold underline underline-offset-2">{{ order.quantity }} <span class="font-normal">{{
                  $t('dashboard.pieces') }}</span></p>
              </td>
              <td class="p-4">
                <div class="inline-flex px-3 py-1 text-xs font-medium rounded-full" :class="{
                  'bg-green-100 text-green-800': (order.status || 'pending') === 'pending',
                  'bg-amber-100 text-amber-800': order.status === 'processing',
                  'bg-blue-100 text-blue-800': order.status === 'shipped',
                  'bg-indigo-100 text-indigo-800': order.status === 'out_for_delivery',
                  'bg-purple-100 text-purple-800': order.status === 'completed'
                }">
                  <span class="inline-flex items-center">
                    <iconify-icon :icon="getMerchantStatusIcon(order.status || 'pending')" class="me-1.5" width="15"
                      height="15" />
                    {{ getMerchantTranslatedStatus(order.status || 'pending') }}
                  </span>
                </div>
              </td>
              <td class="p-4">
                <div class="flex items-center justify-center px-6 py-4 space-s-5" v-flowbite>
                  <button @click="openOrderDetails(order)" v-if="hasPermission('orders', 'changeStatus')"
                    class="flex items-center justify-center w-8 h-8 text-blue-500 rounded hover:text-blue-600"
                    data-tooltip-target="tooltip-view-order-details">
                    <iconify-icon icon="ic:round-remove-red-eye" width="24" height="24"></iconify-icon>
                  </button>
                  <div id="tooltip-view-order-details" role="tooltip"
                    class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-xs opacity-0 tooltip dark:bg-gray-700">
                    {{ $t('tooltip.view_details') }}
                    <div class="tooltip-arrow" data-popper-arrow></div>
                  </div>

                  <button @click="openDeleteDialog(order)" v-if="hasPermission('orders', 'delete')"
                    class="flex items-center justify-center w-8 h-8 text-red-500 rounded hover:text-red-600"
                    data-tooltip-target="tooltip-delete-merchant-order">
                    <iconify-icon icon="material-symbols:delete" width="24" height="24" />
                  </button>
                  <div id="tooltip-delete-merchant-order" role="tooltip"
                    class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-xs opacity-0 tooltip dark:bg-gray-700">
                    {{ $t('tooltip.delete_order') }}
                    <div class="tooltip-arrow" data-popper-arrow></div>
                  </div>
                </div>
              </td>
            </tr>

            <!-- Add delete dialog -->
            <delete-dialog v-model="showDeleteDialog" :message="$t('dashboard.delete_confirmation_order')"
              @confirm="handleDelete" />
          </tbody>
        </table>
      </template>
    </div>

    <!-- paginationControls component -->
    <pagination-controls v-if="!showSkeleton && merchantsOrdersStore.paginatedOrders.length > 0"
      :current-page="merchantsOrdersStore.currentPage" :total-pages="merchantsOrdersStore.totalPages"
      @page-change="merchantsOrdersStore.changePage" />

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
const merchantsOrdersStore = useMerchantsOrdersStore()
const authStore = useAuthStore();
const user = computed(() => authStore.user);
const { t, locale } = useI18n()
const showSkeleton = ref(true);
const { showToast, toastMessage, toastType, toastIcon, triggerToast } = useToast()

//usePermissions composables
const { hasPermission } = usePermissions(user);

const orderStatus = ref([
  { id: 'pending', status: 'Pending' },
  { id: 'processing', status: 'Processing' },
  { id: 'shipped', status: 'Shipped' },
  { id: 'out_for_delivery', status: 'Out for Delivery' },
  { id: 'completed', status: 'Completed' }
]);

const userRole = ref(null);

onMounted(async () => {
  showSkeleton.value = true;
  const startTime = Date.now();

  try {
    await merchantsOrdersStore.fetchAllMerchantOrders();
  } catch (error) {
    console.error('Error fetching merchant orders:', error);
    triggerToast({
      message: t('toast.error_fetching_orders'),
      type: 'error',
      icon: 'mdi:alert-circle',
    });
  } finally {
    const elapsed = Date.now() - startTime;
    const remaining = Math.max(1000 - elapsed, 0);
    setTimeout(() => {
      showSkeleton.value = false;
    }, remaining);
  }
});

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
  const filteredOrders = merchantsOrdersStore.orders.filter(order => {
    const orderDate = new Date(order.createdAt);
    return orderDate >= startDate.value && orderDate <= endDate.value;
  });
  merchantsOrdersStore.paginatedOrders = filteredOrders;
};

// Add these refs for delete functionality
const selectedOrderId = ref(null);
const showDeleteDialog = ref(false);
const deletingOrders = ref({});

// Add these methods for delete functionality
const openDeleteDialog = (order) => {
  selectedOrderId.value = order.id;
  showDeleteDialog.value = true;
};

const handleDelete = async () => {
  if (!selectedOrderId.value) return;
  try {
    const result = await merchantsOrdersStore.deleteOrder(selectedOrderId.value);
    if (result.success) {
      // Refresh orders after deletion using the correct method
      await merchantsOrdersStore.fetchAllMerchantOrders();
      triggerToast({
        message: t('toast.order_deleted_successfully'),
        type: 'success',
        icon: 'mdi:check-circle',
      });
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Error deleting order:', error);
    triggerToast({
      message: t('toast.order_deletion_failed'),
      type: 'error',
      icon: 'mdi:alert-circle',
    });
  } finally {
    deletingOrders.value[selectedOrderId.value] = false;
    selectedOrderId.value = null;
    showDeleteDialog.value = false;
  }
};

const getStatusTitle = (statusId) => {
  return orderStatus.value.find((s) => s.id === statusId);
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

const selectedOrders = ref([]);
const allSelected = ref(false);

// Add these computed properties
const selectAll = computed({
  get: () => allSelected.value,
  set: (value) => {
    allSelected.value = value;
    if (value) {
      const pageIds = merchantsOrdersStore.paginatedOrders.map(p => p.id);
      selectedOrders.value = [...new Set([...selectedOrders.value, ...pageIds])];
    } else {
      const pageIds = merchantsOrdersStore.paginatedOrders.map(p => p.id);
      selectedOrders.value = selectedOrders.value.filter(id => !pageIds.includes(id));
    }
  }
});

// useExcelExport composable
const { exportDataToExcel } = useExcelExport();

const excelConfig = ref({
  filename: 'orders_export.xlsx',
  sheetName: 'Orders',
  headers: [
    {
      label: t('dashboard.order_id'),
      key: "orderId"
    },
    {
      label: t('dashboard.product_name'),
      key: "productTitle",
      width: 35
    },
    {
      label: t('dashboard.merchant_name'),
      key: "merchantName"
    },
    {
      label: t('dashboard.order_date'),
      key: "createdAt",
      mapper: (item) => formatDate(item.createdAt)
    },
    {
      label: t('dashboard.phone_number'),
      key: "phoneNumber"
    },
    {
      label: t('dashboard.country'),
      key: "country",
      mapper: (item) => item.country || 'Egypt'
    },
    {
      label: t('dashboard.quantity'),
      key: "quantity"
    },
    {
      label: t('dashboard.address'),
      key: "fullAddress"
    },
  ],
  columnWidths: [15, 25, 20, 20, 15, 15]
});

const handleExport = () => {
  const ordersToExport = selectedOrders.value.length > 0
    ? merchantsOrdersStore.orders.filter(order => selectedOrders.value.includes(order.id))
    : merchantsOrdersStore.orders;
  const transformedData = ordersToExport.map(order => ({
    orderId: order.orderId,
    productTitle: locale.value === 'ar' ? order.productTitleAr : order.productTitle,
    merchantName: order.merchantName,
    createdAt: order.createdAt,
    phoneNumber: order.phoneNumber,
    country: order.country || 'Egypt',
    quantity: order.quantity,
    fullAddress: order.fullAddress,
  }));

  exportDataToExcel(transformedData, excelConfig.value);
};

const { getTranslatedLocation } = useLocationTranslations();

const { currencyLocale } = useCurrencyLocale()
const defaultMarket = 'Egypt'

// Computed properties for statistics
const totalEarnings = computed(() => {
  return merchantsOrdersStore.totalEarnings;
});

const totalOrders = computed(() => {
  return merchantsOrdersStore.totalOrders;
});

const completedOrders = computed(() => {
  return merchantsOrdersStore.completedOrders;
});

const pendingOrders = computed(() => {
  return merchantsOrdersStore.pendingOrders;
});

const getCountryFlag = (country) => {
  const flagMap = {
    'Egypt': '/egypt-flag.svg',
    'KSA': '/ksa-flag.svg',
    'Saudi Arabia': '/ksa-flag.svg',
  };
  return flagMap[country] || flagMap['Egypt']; // Default to Egypt flag
}

// Update order status for merchants
const updateOrderStatus = async (orderId, status) => {
  if (userRole.value?.role === 'market_owner') {
    try {
      const result = await merchantsOrdersStore.updateOrderStatus(orderId, status)
      if (result.success) {
        triggerToast({
          message: t('toast.order_status_updated'),
          type: 'success',
          icon: 'mdi:check-circle',
        })
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      triggerToast({
        message: t('toast.status_update_failed'),
        type: 'error',
        icon: 'mdi:alert-circle',
      })
    }
  }
}

// Simple date formatting function
const formatDate = (timestamp) => {
  try {
    // Handle Firestore Timestamp
    if (timestamp && typeof timestamp === 'object' && 'seconds' in timestamp) {
      const date = new Date(timestamp.seconds * 1000);
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const year = date.getFullYear();
      return `${month}/${day}/${year}`;
    }
    // Handle regular date string
    const date = new Date(timestamp);
    if (isNaN(date)) return timestamp;
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return timestamp;
  }
};

// Add merchant status handling functions
const getMerchantStatusIcon = (status) => {
  switch (status) {
    case 'pending':
      return 'mdi:clock-outline';
    case 'processing':
      return 'mdi:cog-outline';
    case 'shipped':
      return 'mdi:truck-outline';
    case 'out_for_delivery':
      return 'mdi:package-variant';
    case 'completed':
      return 'mdi:check-circle';
    default:
      return 'mdi:clock-outline';
  }
};

const getMerchantTranslatedStatus = (status) => {
  return t(`permissions.status.${status || 'pending'}`);
};

const skeletonHeaders = [
  { label: '#', loaderWidth: 'w-8' },
  { label: 'Order ID', loaderWidth: 'w-32' },
  { label: 'Merchant Name', loaderWidth: 'w-24' },
  { label: 'Order date', loaderWidth: 'w-24' },
  { label: 'Phone number', loaderWidth: 'w-24' },
  { label: 'Country', loaderWidth: 'w-24' },
  { label: 'Quantity', loaderWidth: 'w-24' },
  { label: 'Status', loaderWidth: 'w-24' },
  { label: 'Actions', type: 'action' }
];
</script>