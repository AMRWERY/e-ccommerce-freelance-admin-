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
              <!-- <th class="p-4 border-b border-slate-200 bg-slate-50" v-if="userRole?.role !== 'market_owner'">
                <p class="text-sm font-normal leading-none text-slate-500">
                  {{ $t('dashboard.product_img') }}
                </p>
              </th>
              <th class="p-4 border-b border-slate-200 bg-slate-50" v-if="userRole?.role !== 'market_owner'">
                <p class="text-sm font-normal leading-none text-slate-500">
                  {{ $t('dashboard.product_name') }}
                </p>
              </th> -->
              <th class="p-4 border-b border-slate-200 bg-slate-50" v-if="userRole?.role !== 'market_owner'">
                <p class="text-sm font-normal leading-none text-slate-500">
                  {{ $t('dashboard.product_code') }}
                </p>
              </th>
              <th class="p-4 border-b border-slate-200 bg-slate-50" v-if="userRole?.role !== 'market_owner'">
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
                  {{ $t('dashboard.whatsapp_number') }}
                </p>
              </th>
              <th class="p-4 border-b border-slate-200 bg-slate-50">
                <p class="text-sm font-normal leading-none text-slate-500">
                  {{ $t('dashboard.country') }}
                </p>
              </th>
              <th class="p-4 border-b border-slate-200 bg-slate-50" v-if="userRole?.role !== 'market_owner'">
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

          <tbody
            v-if="(userRole?.role === 'market_owner' ? merchantsOrdersStore.paginatedOrders.length === 0 : checkoutStore.paginatedOrders.length === 0)">
            <tr>
              <td colspan="10" class="p-4 text-center">
                <!-- NoDataMessage component -->
                <No-data-message :message="$t('no_data.no_orders_found')" icon="tabler:package-off" />
              </td>
            </tr>
          </tbody>

          <tbody v-else>
            <tr class="bg-white border-b border-gray-200 hover:bg-gray-50"
              v-for="(order, index) in (userRole?.role === 'market_owner' ? merchantsOrdersStore.paginatedOrders : checkoutStore.paginatedOrders)"
              :key="order.id">
              <td class="px-6 py-4">
                <input type="checkbox" v-model="selectedOrders" :value="order.id"
                  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500">
              </td>
              <td class="p-4">
                <p class="block text-sm font-semibold text-slate-800">{{ (userRole?.role === 'market_owner' ?
                  merchantsOrdersStore.currentPage - 1 : checkoutStore.currentPage - 1) *
                  (userRole?.role === 'market_owner' ? merchantsOrdersStore.ordersPerPage : checkoutStore.ordersPerPage)
                  +
                  index +
                  1 }}</p>
              </td>
              <td class="p-4">
                <p class="block text-sm font-semibold text-slate-800">{{ order.orderId }}</p>
              </td>
              <!-- <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                <img :src="order.cart[0]?.imageUrl1" alt="product-logo" class="object-cover w-12 h-12 rounded-lg">
              </th>
              <td class="p-4">
                {{ $i18n.locale === 'ar' ?
                  order.cart[0]?.titleAr :
                  order.cart[0]?.title }}
              </td> -->
              <td class="p-4" v-for="item in order.cart" :key="item.productId">
                <p class="font-semibold">{{ item.productCode }}</p>
              </td>
              <td class="p-4" v-if="userRole?.role !== 'market_owner'">
                <p>{{ order.deliveryDetails?.email
                }}</p>
              </td>
              <td class="p-4">
                <p>{{ userRole?.role === 'market_owner' ? order.name : order.deliveryDetails?.name }}
                </p>
              </td>
              <td class="p-4">
                <p>{{ formatDate(userRole?.role === 'market_owner' ? order.createdAt : order.date) }}</p>
              </td>
              <td class="p-4">
                <p>{{ userRole?.role === 'market_owner' ? order.phoneNumber : order.deliveryDetails?.phoneNumber }}</p>
              </td>
              <td class="p-4">
                <p>{{ userRole?.role === 'market_owner' ? order.whatsappNumber : order.deliveryDetails?.whatsappNumber
                }}</p>
              </td>
              <td class="p-4">
                <div class="flex items-center gap-2">
                  <p>
                    {{ getTranslatedLocation(userRole?.role === 'market_owner' ? (order.country || 'Egypt') :
                      order.deliveryDetails?.country) }}
                  </p>
                  <img
                    :src="getCountryFlag(userRole?.role === 'market_owner' ? (order.country || 'Egypt') : order.deliveryDetails?.country)"
                    :alt="userRole?.role === 'market_owner' ? (order.country || 'Egypt') : order.deliveryDetails?.country"
                    class="w-5 h-4" />
                </div>
              </td>
              <td class="p-4" v-if="userRole?.role !== 'market_owner'">
                <p>
                  {{ getTranslatedLocation(order.deliveryDetails?.city) }}
                </p>
              </td>
              <td class="p-4">
                <div class="inline-flex px-3 py-1 text-xs font-medium rounded-full" :class="{
                  'bg-green-100 text-green-800': userRole?.role === 'market_owner' ?
                    (order.status || 'pending') === 'pending' :
                    getStatusTitle(order.statusId)?.status === 'Order Placed',
                  'bg-amber-100 text-amber-800': userRole?.role === 'market_owner' ?
                    order.status === 'processing' :
                    getStatusTitle(order.statusId)?.status === 'Processing',
                  'bg-blue-100 text-blue-800': userRole?.role === 'market_owner' ?
                    order.status === 'shipped' :
                    getStatusTitle(order.statusId)?.status === 'Shipped',
                  'bg-indigo-100 text-indigo-800': userRole?.role === 'market_owner' ?
                    order.status === 'out_for_delivery' :
                    getStatusTitle(order.statusId)?.status === 'Out for Delivery',
                  'bg-purple-100 text-purple-800': userRole?.role === 'market_owner' ?
                    order.status === 'completed' :
                    getStatusTitle(order.statusId)?.status === 'Delivered'
                }">
                  <span class="inline-flex items-center">
                    <iconify-icon :icon="userRole?.role === 'market_owner' ?
                      getMerchantStatusIcon(order.status || 'pending') :
                      getStatusIcon(order.statusId)" class="me-1.5" width="15" height="15" />
                    {{ userRole?.role === 'market_owner' ?
                      getMerchantTranslatedStatus(order.status || 'pending') :
                      getTranslatedStatus(order.statusId) }}
                  </span>
                </div>
              </td>
              <td class="p-4">
                <div class="flex items-center justify-center px-6 py-4 space-s-5" v-flowbite>
                  <button @click="openOrderDetails(order)" v-if="hasPermission('orders', 'changeStatus')"
                    class="flex items-center justify-center w-8 h-8 text-blue-500 rounded hover:text-blue-600"
                    data-tooltip-target="tooltip-view-details">
                    <iconify-icon icon="ic:round-remove-red-eye" width="24" height="24"></iconify-icon>
                  </button>
                  <div id="tooltip-view-details" role="tooltip"
                    class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-xs opacity-0 tooltip dark:bg-gray-700">
                    {{ $t('tooltip.view_details') }}
                    <div class="tooltip-arrow" data-popper-arrow></div>
                  </div>

                  <button @click.stop="openDeleteDialog(order)" v-if="hasPermission('orders', 'delete')"
                    class="flex items-center justify-center w-8 h-8 text-red-500 rounded hover:text-red-600"
                    data-tooltip-target="tooltip-delete-order">
                    <iconify-icon icon="material-symbols:delete" width="24" height="24" />
                  </button>
                  <div id="tooltip-delete-order" role="tooltip"
                    class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-xs opacity-0 tooltip dark:bg-gray-700">
                    {{ $t('tooltip.delete_order') }}
                    <div class="tooltip-arrow" data-popper-arrow></div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </template>

      <!-- delete-dialog component -->
      <delete-dialog v-model="showDeleteDialog" :message="$t('dashboard.delete_confirmation_order')"
        @confirm="handleDelete" />
    </div>

    <!-- paginationControls component -->
    <pagination-controls
      v-if="!showSkeleton && (userRole?.role === 'market_owner' ? merchantsOrdersStore.paginatedOrders.length > 0 : checkoutStore.paginatedOrders.length > 0)"
      :current-page="userRole?.role === 'market_owner' ? merchantsOrdersStore.currentPage : checkoutStore.currentPage"
      :total-pages="userRole?.role === 'market_owner' ? merchantsOrdersStore.totalPages : checkoutStore.totalPages"
      @page-change="userRole?.role === 'market_owner' ? merchantsOrdersStore.changePage : checkoutStore.changePage" />

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

//usePermissions composables
const { hasPermission } = usePermissions(user);

const { t, locale } = useI18n()
const checkoutStore = useCheckoutStore();
const showSkeleton = ref(true);
const { showToast, toastMessage, toastType, toastIcon, triggerToast } = useToast()

const orderStatus = ref([])
const userRole = ref(null);

onMounted(async () => {
  showSkeleton.value = true
  const startTime = Date.now()
  try {
    userRole.value = user.value
    if (userRole.value?.role === 'market_owner') {
      // For market owners, fetch only their orders
      await merchantsOrdersStore.initializeStore(userRole.value)
      orderStatus.value = [
        { id: 'pending', status: 'Pending' },
        { id: 'completed', status: 'Completed' }
      ]
    } else {
      // For admin, fetch all orders using checkoutStore
      await Promise.all([
        checkoutStore.fetchOrders(),
        checkoutStore.fetchStatus()
      ])
      orderStatus.value = checkoutStore.status
    }
  } catch (error) {
    console.error('Error initializing orders:', error)
  } finally {
    const elapsed = Date.now() - startTime
    const remaining = Math.max(1000 - elapsed, 0)
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

const selectedOrderId = ref(null);
const showDeleteDialog = ref(false);
const deletingOrders = ref({});

const openDeleteDialog = (product) => {
  selectedOrderId.value = product.id;
  showDeleteDialog.value = true;
};

const handleDelete = async () => {
  if (!selectedOrderId.value) return;
  try {
    if (userRole.value?.role === 'market_owner') {
      const result = await merchantsOrdersStore.deleteOrder(selectedOrderId.value)
      if (result.success) {
        // Refresh merchant orders after deletion
        await merchantsOrdersStore.initializeStore(userRole.value)
        triggerToast({
          message: t('toast.order_deleted_successfully'),
          type: 'success',
          icon: 'mdi:check-circle',
        })
      } else {
        throw new Error(result.message)
      }
    } else {
      const result = await checkoutStore.deleteOrder(selectedOrderId.value)
      if (result.success) {
        // Refresh admin orders after deletion
        await checkoutStore.fetchOrders()
        triggerToast({
          message: t('toast.order_deleted_successfully'),
          type: 'success',
          icon: 'mdi:check-circle',
        })
      } else {
        throw new Error(result.message)
      }
    }
  } catch (error) {
    console.error('Error deleting order:', error);
    triggerToast({
      message: t('toast.order_deletion_failed'),
      type: 'error',
      icon: 'mdi:alert-circle',
    })
  } finally {
    deletingOrders.value[selectedOrderId.value] = false;
    selectedOrderId.value = null;
    showDeleteDialog.value = false;
  }
}

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

const selectedOrders = ref([]);
const allSelected = ref(false);

// Add these computed properties
const selectAll = computed({
  get: () => allSelected.value,
  set: (value) => {
    allSelected.value = value;
    if (value) {
      const pageIds = checkoutStore.paginatedOrders.map(p => p.id);
      selectedOrders.value = [...new Set([...selectedOrders.value, ...pageIds])];
    } else {
      const pageIds = checkoutStore.paginatedOrders.map(p => p.id);
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
      key: "orderId",
    },
    {
      label: t('dashboard.product_name'),
      key: "productTitle",
      width: 35
    },
    {
      label: t('dashboard.product_code'),
      key: "productCode",
      width: 20
    },
    {
      label: t('dashboard.email'),
      key: "deliveryDetails.email",
    },
    {
      label: t('dashboard.customer_name'),
      key: "deliveryDetails.name",
    },
    {
      label: t('dashboard.order_date'),
      key: "date",
    },
    {
      label: t('dashboard.phone_number'),
      key: "deliveryDetails.phoneNumber"
    },
    {
      label: t('dashboard.whatsapp_number'),
      key: "deliveryDetails.whatsappNumber"
    },
    {
      label: t('dashboard.country'),
      key: "deliveryDetails.country"
    },
    {
      label: t('dashboard.governorate'),
      key: "deliveryDetails.city"
    },
    {
      label: t('dashboard.address'),
      key: "deliveryDetails.fullAddress"
    },
  ],
  columnWidths: [5, 15, 25, 20, 15, 15, 10]
});

const handleExport = () => {
  const ordersToExport = selectedOrders.value.length > 0
    ? checkoutStore.orders.filter(order => selectedOrders.value.includes(order.id))
    : checkoutStore.orders;
  const transformedData = ordersToExport.flatMap(order => {
    // Create one row per product in cart
    return order.cart?.map(item => ({
      orderId: order.orderId,
      productCode: item.productCode,
      productTitle: locale.value === 'ar' ? item.titleAr : item.title,
      quantity: item.quantity,
      date: formatDate(order.date),
      'deliveryDetails.email': order.deliveryDetails?.email || '',
      'deliveryDetails.name': order.deliveryDetails?.name || '',
      'deliveryDetails.phoneNumber': order.deliveryDetails?.phoneNumber || '',
      'deliveryDetails.country': order.deliveryDetails?.country || '',
      'deliveryDetails.city': order.deliveryDetails?.city || '',
      'deliveryDetails.fullAddress': order.deliveryDetails?.fullAddress || '',
    })) || []; // Fallback for empty carts
  });

  exportDataToExcel(transformedData, excelConfig.value);
};

// const handleExport = () => {
//   const transformedData = checkoutStore.orders.flatMap(order =>
//     order.cart?.map(item => ({
//       orderId: order.orderId,
//       productTitle: locale.value === 'ar' ? item.titleAr : item.title,
//       'deliveryDetails.name': order.deliveryDetails?.name || '',
//       date: formatDate(order.date),
//       'deliveryDetails.phoneNumber': order.deliveryDetails?.phoneNumber || '',
//       'deliveryDetails.whatsappNumber': order.deliveryDetails?.whatsappNumber || '',
//       'deliveryDetails.country': order.deliveryDetails?.country || '',
//       'deliveryDetails.city': order.deliveryDetails?.city || '',
//       'deliveryDetails.fullAddress': order.deliveryDetails?.fullAddress || '',
//     })) || []
//   );

//   exportDataToExcel(transformedData, excelConfig.value);
// };

const { getTranslatedLocation } = useLocationTranslations();

const { currencyLocale } = useCurrencyLocale()
const defaultMarket = 'Egypt'

// Computed properties for statistics
const totalEarnings = computed(() => {
  if (userRole.value?.role === 'market_owner') {
    return merchantsOrdersStore.totalEarnings
  }
  return checkoutStore.orders.reduce((total, order) => {
    if (order.cart && Array.isArray(order.cart)) {
      return total + order.cart.reduce((orderTotal, item) => {
        return orderTotal + (parseFloat(item.discountedPrice || 0) * (item.quantity || 1))
      }, 0)
    }
    return total
  }, 0)
})

const totalOrders = computed(() => {
  if (userRole.value?.role === 'market_owner') {
    return merchantsOrdersStore.totalOrders
  }
  return checkoutStore.orders.length
})

const completedOrders = computed(() => {
  if (userRole.value?.role === 'market_owner') {
    return merchantsOrdersStore.completedOrders
  }
  return checkoutStore.orders.filter(order => {
    const status = getStatusTitle(order.statusId)?.status
    return status === 'Delivered'
  }).length
})

const pendingOrders = computed(() => {
  if (userRole.value?.role === 'market_owner') {
    return merchantsOrdersStore.pendingOrders
  }
  return checkoutStore.orders.filter(order => {
    const status = getStatusTitle(order.statusId)?.status
    return status !== 'Delivered'
  }).length
})

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

// Add this function before the template
const formatDate = (dateString) => {
  try {
    const date = new Date(dateString);
    if (isNaN(date)) return dateString;
    const month = date.getMonth() + 1; // getMonth() returns 0-11
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
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
      return 'mdi:clock-outline'; // Default to pending icon
  }
};

const getMerchantTranslatedStatus = (status) => {
  return t(`permissions.status.${status || 'pending'}`);
};

const skeletonHeaders = [
  { label: '#', loaderWidth: 'w-8' },
  { label: 'Order ID', loaderWidth: 'w-32' },
  { label: 'Product code', loaderWidth: 'w-24' },
  { label: 'Email', loaderWidth: 'w-24' },
  { label: 'Customer name', loaderWidth: 'w-24' },
  { label: 'Date', loaderWidth: 'w-24' },
  { label: 'Phone number', loaderWidth: 'w-24' },
  { label: 'Country', loaderWidth: 'w-24' },
  { label: 'Governorate', loaderWidth: 'w-24' },
  { label: 'Status', loaderWidth: 'w-24' },
  { label: 'Actions', type: 'action' }
];
</script>