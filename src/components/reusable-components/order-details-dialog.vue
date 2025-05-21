<template>
  <div v-if="modelValue">
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div class="flex flex-col w-full max-w-4xl bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-hidden">
        <div class="flex items-center justify-between p-4 border-b">
          <h2 class="text-xl font-semibold text-gray-900">
            {{ $t('dashboard.order_details') }} - {{ orderData?.orderId }}
          </h2>
          <button @click="closeDialog" class="flex items-center p-1 transition-colors rounded-full hover:bg-gray-200">
            <iconify-icon icon="material-symbols:close-small-rounded" width="24" height="24"
              class="text-gray-500"></iconify-icon>
          </button>
        </div>

        <div class="overflow-y-auto max-h-[550px] scrollable-dialog">
          <div v-if="orderData" class="flex flex-col gap-4 p-2 md:flex-row">
            <!-- Customer Info Section -->
            <div class="flex-1 p-6 rounded-lg shadow-md bg-gray-50">
              <div class="flex items-center mb-4 space-s-2">
                <iconify-icon icon="material-symbols-light:account-box-sharp" width="24" height="24"
                  class="text-indigo-600"></iconify-icon>
                <h3 class="text-xl font-semibold text-gray-900">
                  {{ isMerchantOrder ? orderData.name : orderData.deliveryDetails?.name }} {{ $t('dashboard.s_information') }}
                </h3>
              </div>

              <div class="space-y-4">
                <div class="flex items-start space-s-3">
                  <iconify-icon icon="material-symbols:mark-email-unread-rounded" width="24" height="24"
                    class="mt-0.5 text-indigo-600"></iconify-icon>
                  <div>
                    <p class="text-sm font-medium text-gray-500">{{ $t('dashboard.email') }}</p>
                    <p class="text-base text-gray-700">
                      {{ isMerchantOrder ? orderData.merchantEmail : orderData.deliveryDetails?.email }}
                    </p>
                  </div>
                </div>

                <div class="flex items-start space-s-3">
                  <iconify-icon icon="material-symbols:phone-in-talk-sharp" width="24" height="24"
                    class="mt-0.5 text-indigo-600"></iconify-icon>
                  <div>
                    <p class="text-sm font-medium text-gray-500">{{ $t('dashboard.phone_number') }}</p>
                    <p class="text-base text-gray-700">
                      {{ isMerchantOrder ? orderData.phoneNumber : orderData.deliveryDetails?.phoneNumber }}
                    </p>
                  </div>
                </div>

                <div class="flex items-start space-s-3">
                  <iconify-icon icon="material-symbols:location-on" width="24" height="24"
                    class="mt-0.5 text-indigo-600"></iconify-icon>
                  <div>
                    <p class="text-sm font-medium text-gray-500">{{ $t('dashboard.location') }}</p>
                    <p class="text-base text-gray-700">
                      {{ isMerchantOrder ? 
                        getTranslatedLocation(orderData.fullAddress || orderData.city) + ', ' + getTranslatedLocation(orderData.country || 'Egypt') :
                        getTranslatedLocation(orderData.deliveryDetails?.city) + ', ' + getTranslatedLocation(orderData.deliveryDetails?.country) 
                      }}
                    </p>
                  </div>
                </div>

                <div v-if="hasOffers">
                <!-- <div v-if="orderData.cart?.selectedOffer"> -->
                  <h4 class="font-medium">{{ $t('dashboard.offer') }}:</h4>
                 <ul class="list-disc list-inside">
                 <li v-for="(item, idx) in orderData.cart" :key="idx" class="flex items-center p-2 list-none bg-green-200 rounded-lg">
                    {{ item.offerText }}
                </li>
               </ul>
                <!-- </div> -->
               </div>
              </div>

              <!-- Order Status -->
              <div class="pt-6 mt-8 border-t">
                <div class="flex items-center mb-4">
                  <iconify-icon icon="mdi:timer" width="24" height="24" class="text-indigo-600 me-2"></iconify-icon>
                  <p class="text-base font-medium text-gray-900">{{ $t('dashboard.current_status') }}:</p>
                  <div class="inline-flex px-3 py-1 text-xs font-medium rounded-full ms-2" :class="{
                    'bg-green-100 text-green-800': isMerchantOrder ? 
                      (orderData.status || 'pending') === 'pending' : currentStatusText === 'Order Placed',
                    'bg-amber-100 text-amber-800': isMerchantOrder ? 
                      orderData.status === 'processing' : currentStatusText === 'Processing',
                    'bg-blue-100 text-blue-800': isMerchantOrder ? 
                      orderData.status === 'shipped' : currentStatusText === 'Shipped',
                    'bg-indigo-100 text-indigo-800': isMerchantOrder ? 
                      orderData.status === 'out_for_delivery' : currentStatusText === 'Out for Delivery',
                    'bg-purple-100 text-purple-800': isMerchantOrder ? 
                      orderData.status === 'completed' : currentStatusText === 'Delivered'
                  }">
                    <span class="inline-flex items-center">
                      <iconify-icon :icon="isMerchantOrder ? 
                        getMerchantStatusIcon(orderData.status || 'pending') : 
                        statusIcon" 
                        class="me-1.5"></iconify-icon>
                      {{ isMerchantOrder ? 
                        getMerchantTranslatedStatus(orderData.status || 'pending') : 
                        $t(`permissions.status.${currentStatusText.toLowerCase().replace(/\s+/g, '_')}`) }}
                    </span>
                  </div>
                </div>

                <!-- Status Buttons -->
                <template v-if="!isMerchantOrder">
                  <p class="mb-3 text-sm font-medium text-gray-600">{{ $t('dashboard.change_order_status') }}</p>
                  <div class="flex flex-wrap gap-4">
                    <button type="button" :disabled="nextStatusId !== orderStatus[0]?.id"
                      @click="updateOrderStatus(orderData.id, orderStatus[0]?.id)"
                      class="flex items-center justify-center px-4 py-2 text-sm text-green-600 transition-colors bg-white border border-green-500 rounded-md focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-500 hover:text-white">
                      <div class="flex items-center" v-if="isLoading && activeStatusId === orderStatus[0]?.id">
                        <iconify-icon icon="line-md:loading-loop" width="20" height="20" class="me-1.5"></iconify-icon>
                        <span>{{ $t('btn.updating') }}...</span>
                      </div>
                      <span v-else class="flex items-center">
                        <iconify-icon icon="material-symbols:check-circle-outline" width="20" height="20"
                          class="me-1.5" />
                        {{ $t('permissions.status.order_placed') }}
                      </span>
                    </button>

                    <button type="button" :disabled="nextStatusId !== orderStatus[1]?.id"
                      @click="updateOrderStatus(orderData.id, orderStatus[1]?.id)"
                      class="flex items-center justify-center px-4 py-2 text-sm transition-colors bg-white border rounded-md focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed border-amber-500 text-amber-600 hover:bg-amber-500 hover:text-white">
                      <div class="flex items-center" v-if="isLoading && activeStatusId === orderStatus[1]?.id">
                        <iconify-icon icon="line-md:loading-loop" width="20" height="20" class="me-1.5"></iconify-icon>
                        <span>{{ $t('btn.updating') }}...</span>
                      </div>
                      <span v-else class="flex items-center">
                        <iconify-icon icon="material-symbols:timer-outline" width="20" height="20"
                          class="me-1.5"></iconify-icon>
                        {{ $t('permissions.status.processing') }}
                      </span>
                    </button>

                    <button type="button" :disabled="nextStatusId !== orderStatus[2]?.id"
                      @click="updateOrderStatus(orderData.id, orderStatus[2]?.id)"
                      class="flex items-center justify-center px-4 py-2 text-sm text-blue-600 transition-colors bg-white border border-blue-500 rounded-md focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-500 hover:text-white">
                      <div class="flex items-center" v-if="isLoading && activeStatusId === orderStatus[2]?.id">
                        <iconify-icon icon="line-md:loading-loop" width="20" height="20" class="me-1.5"></iconify-icon>
                        <span>{{ $t('btn.updating') }}...</span>
                      </div>
                      <span v-else class="flex items-center">
                        <iconify-icon icon="material-symbols:local-shipping-outline" width="20" height="20"
                          class="me-1.5"></iconify-icon>
                        {{ $t('permissions.status.shipped') }}
                      </span>
                    </button>

                    <button type="button" :disabled="nextStatusId !== orderStatus[3]?.id"
                      @click="updateOrderStatus(orderData.id, orderStatus[3]?.id)"
                      class="flex items-center justify-center px-4 py-2 text-sm text-indigo-600 transition-colors bg-white border border-indigo-500 rounded-md focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-500 hover:text-white">
                      <div class="flex items-center" v-if="isLoading && activeStatusId === orderStatus[3]?.id">
                        <iconify-icon icon="line-md:loading-loop" width="20" height="20" class="me-1.5"></iconify-icon>
                        <span>{{ $t('btn.updating') }}...</span>
                      </div>
                      <span v-else class="flex items-center">
                        <iconify-icon icon="material-symbols:package-outline" width="20" height="20"
                          class="me-1.5"></iconify-icon>
                        {{ $t('permissions.status.out_for_delivery') }}
                      </span>
                    </button>

                    <button type="button" :disabled="nextStatusId !== orderStatus[4]?.id"
                      @click="updateOrderStatus(orderData.id, orderStatus[4]?.id)"
                      class="flex items-center justify-center px-4 py-2 text-sm text-purple-600 transition-colors bg-white border border-purple-500 rounded-md focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-500 hover:text-white">
                      <div class="flex items-center" v-if="isLoading && activeStatusId === orderStatus[4]?.id">
                        <iconify-icon icon="line-md:loading-loop" width="20" height="20" class="me-1.5"></iconify-icon>
                        <span>{{ $t('btn.updating') }}...</span>
                      </div>
                      <span v-else class="flex items-center">
                        <iconify-icon icon="material-symbols:check-circle-outline" width="20" height="20"
                          class="me-1.5"></iconify-icon>
                        {{ $t('permissions.status.delivered') }}
                      </span>
                    </button>
                  </div>
                </template>
                <template v-else>
                  <p class="mb-3 text-sm font-medium text-gray-600">{{ $t('dashboard.change_order_status') }}</p>
                  <div class="flex flex-wrap gap-4">
                    <button v-for="status in merchantOrderStatuses" :key="status.id"
                      :disabled="orderData.status === status.id"
                      @click="updateMerchantOrderStatus(orderData.id, status.id)"
                      :class="{
                        'flex items-center justify-center px-4 py-2 text-sm transition-colors bg-white border rounded-md focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed': true,
                        'border-green-500 text-green-600 hover:bg-green-500 hover:text-white': status.id === 'pending',
                        'border-amber-500 text-amber-600 hover:bg-amber-500 hover:text-white': status.id === 'processing',
                        'border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white': status.id === 'shipped',
                        'border-indigo-500 text-indigo-600 hover:bg-indigo-500 hover:text-white': status.id === 'out_for_delivery',
                        'border-purple-500 text-purple-600 hover:bg-purple-500 hover:text-white': status.id === 'completed'
                      }">
                      <div class="flex items-center" v-if="isLoading && activeStatusId === status.id">
                        <iconify-icon icon="line-md:loading-loop" width="20" height="20" class="me-1.5"></iconify-icon>
                        <span>{{ $t('btn.updating') }}...</span>
                      </div>
                      <span v-else class="flex items-center">
                        <iconify-icon :icon="getMerchantStatusIcon(status.id)" width="20" height="20" class="me-1.5" />
                        {{ getMerchantTranslatedStatus(status.id) }}
                      </span>
                    </button>
                  </div>
                </template>
              </div>
            </div>

            <!-- Order Items Section -->
            <div class="flex-1 p-6 bg-white rounded-lg shadow-md">
              <div class="flex items-center mb-4 space-s-2">
                <iconify-icon icon="mdi:cart" width="24" height="24" class="text-indigo-600"></iconify-icon>
                <h3 class="text-xl font-semibold text-gray-900">
                  {{ $t('dashboard.ordered_items') }}
                </h3>
              </div>

              <div class="space-y-4 overflow-y-auto max-h-[400px] pe-2 custom-scrollbar">
                <template v-if="isMerchantOrder">
                  <div class="flex items-start p-3 transition-colors border border-gray-100 rounded-lg hover:bg-gray-50 space-s-4">
                    <span class="flex items-center justify-center flex-shrink-0 w-6 h-6 text-sm font-bold text-indigo-700 bg-indigo-100 rounded-full">
                      1
                    </span>
                    <img :src="orderData.productImage" class="flex-shrink-0 object-cover w-16 h-16 rounded-md shadow-sm" />
                    <div class="flex-1 min-w-0">
                      <p class="text-base font-semibold text-gray-900 truncate">
                        {{ locale === 'ar' ? orderData.productTitleAr : orderData.productTitle }}
                      </p>
                      <div class="flex flex-wrap gap-2 mt-1">
                        <div class="inline-flex items-center px-2 py-1 bg-gray-100 rounded-md">
                          <span class="text-xs font-medium text-gray-600">{{ $t('dashboard.quantity') }}:</span>
                          <span class="text-xs text-gray-700 ms-1">{{ orderData.quantity }}</span>
                        </div>
                        <div class="inline-flex items-center px-2 py-1 bg-indigo-100 rounded-md">
                          <span class="text-xs font-medium text-indigo-700">{{ $t('dashboard.price') }}:</span>
                          <span class="text-xs text-indigo-700 ms-1">
                            {{ $n(orderData.totalAmount, 'currency', currencyLocale(orderData.targetMarket)) }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
                <template v-else>
                  <div v-for="(item, index) in orderData.cart || []" :key="item.productId"
                    class="flex items-start p-3 transition-colors border border-gray-100 rounded-lg hover:bg-gray-50 space-s-4">
                    <span
                      class="flex items-center justify-center flex-shrink-0 w-6 h-6 text-sm font-bold text-indigo-700 bg-indigo-100 rounded-full">
                      {{ index + 1 }}
                    </span>
                    <img :src="item.imageUrl1" class="flex-shrink-0 object-cover w-16 h-16 rounded-md shadow-sm" />
                    <div class="flex-1 min-w-0">
                      <p class="text-base font-semibold text-gray-900 truncate">
                        {{ $i18n.locale ===
                          'ar' ? item.titleAr :
                          item.title }}
                      </p>
                      <div class="flex flex-wrap gap-2 mt-1">
                        <div class="inline-flex items-center px-2 py-1 bg-gray-100 rounded-md">
                          <span class="text-xs font-medium text-gray-600">{{ $t('dashboard.quantity')
                          }}:</span>
                          <span class="text-xs text-gray-700 ms-1">{{ item.quantity }}</span>
                        </div>
                        <div class="inline-flex items-center px-2 py-1 bg-indigo-100 rounded-md">
                          <span class="text-xs font-medium text-indigo-700">{{ $t('dashboard.price')
                          }}:</span>
                          <span class="text-xs text-indigo-700 ms-1" v-if="item.offerPrice">{{ $n((parseFloat(item.offerPrice || 0) *
                            (item.quantity || 1)), 'currency',
                            currencyLocale(orderData.market === 'ksa' ? 'Saudi Arabia' : 'Egypt')) }}</span>
                          <span class="text-xs text-indigo-700 ms-1" v-else>{{ $n((parseFloat(item.discountedPrice || 0) *
                            (item.quantity || 1)), 'currency',
                            currencyLocale(orderData.market === 'ksa' ? 'Saudi Arabia' : 'Egypt')) }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </div>

              <!-- Order Summary -->
              <div class="pt-4 mt-6 border-t">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm text-gray-600">{{ $t('dashboard.date') }}</span>
                  <span class="text-sm font-medium text-gray-900">
                    {{ formatDate(isMerchantOrder ? orderData.createdAt : orderData.date) }}
                  </span>
                </div>
                <div class="flex items-center justify-between mb-2" v-if="!isMerchantOrder">
                  <span class="text-sm text-gray-600">{{ $t('dashboard.estimated_delivery') }}</span>
                  <span class="text-sm font-medium text-gray-900">{{ orderData.estimatedDelivery || 'N/A' }}</span>
                </div>
                <div class="flex items-center justify-between mt-4">
                  <span class="text-base font-semibold text-gray-700">{{ $t('dashboard.total') }}</span>
                  <span class="text-lg font-bold text-indigo-600">
                    {{ $n(isMerchantOrder ? orderData.totalAmount : calculateTotal(orderData.cart), 'currency', 
                      currencyLocale(isMerchantOrder ? orderData.targetMarket : (orderData.market === 'ksa' ? 'Saudi Arabia' : 'Egypt'))) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- dynamic-toast component -->
    <div class="fixed z-50 pointer-events-none bottom-5 start-5 sm:w-96 w-full max-w-[calc(100%-2rem)] mx-2 sm:mx-0">
      <div class="pointer-events-auto">
        <dynamic-toast v-if="showToast" :message="toastMessage" :toastType="toastType" :duration="5000"
          :toastIcon="toastIcon" @toastClosed="showToast = false" />
      </div>
    </div>
  </div>
</template>

<script setup>
const { t, locale } = useI18n()
const { getTranslatedLocation } = useLocationTranslations()
const checkoutStore = useCheckoutStore()
const merchantsOrdersStore = useMerchantsOrdersStore()

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  orderData: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

const closeDialog = () => {
  emit('update:modelValue', false)
}

// Determine if this is a merchant order
const isMerchantOrder = computed(() => {
  return props.orderData && 'merchantEmail' in props.orderData
})

const { showToast, toastMessage, toastType, toastIcon, triggerToast } = useToast()
const isLoading = ref(false)
const activeStatusId = ref(null)

// Format date function
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
    if (isNaN(date)) return 'N/A';
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'N/A';
  }
};

// Merchant order status handling
const merchantOrderStatuses = [
  { id: 'pending', status: 'Pending' },
  { id: 'processing', status: 'Processing' },
  { id: 'shipped', status: 'Shipped' },
  { id: 'out_for_delivery', status: 'Out for Delivery' },
  { id: 'completed', status: 'Completed' }
]

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
}

const getMerchantTranslatedStatus = (status) => {
  return t(`permissions.status.${status || 'pending'}`);
}

// const updateOrderStatus = async (orderId, newStatus) => {
//   activeStatusId.value = newStatus;
//   isLoading.value = true;
//   try {
//     const result = await checkoutStore.updateOrderStatus(orderId, newStatus);
//     if (result.success) {
//       props.orderData.status = newStatus;
//       triggerToast({
//         message: t('toast.order_status_updated'),
//         type: 'success',
//         icon: 'mdi:check-circle',
//       });
//     } else {
//       throw new Error(result.message);
//     }
//   } catch (error) {
//     console.error('Error updating order status:', error);
//     triggerToast({
//       message: t('toast.status_update_failed'),
//       type: 'error',
//       icon: 'mdi:alert-circle',
//     });
//   } finally {
//     isLoading.value = false;
//     activeStatusId.value = null;
//   }
// }

const updateOrderStatus = async (orderId, newStatus) => {
  activeStatusId.value = newStatus;
  isLoading.value = true;
  try {
    const result = await checkoutStore.updateOrderStatus(orderId, newStatus);
    if (result.success) {
      // Update local order data
      props.orderData.statusId = newStatus;
      triggerToast({
        message: t('toast.order_status_updated'),
        type: 'success',
        icon: 'mdi:check-circle',
      });
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    triggerToast({
      message: error.message || t('toast.status_update_failed'),
      type: 'error',
      icon: 'mdi:alert-circle',
    });
  } finally {
    isLoading.value = false;
    activeStatusId.value = null;
  }
};

const updateMerchantOrderStatus = async (orderId, newStatus) => {
  activeStatusId.value = newStatus;
  isLoading.value = true;
  try {
    const result = await merchantsOrdersStore.updateOrderStatus(orderId, newStatus);
    if (result.success) {
      props.orderData.status = newStatus;
      triggerToast({
        message: t('toast.order_status_updated'),
        type: 'success',
        icon: 'mdi:check-circle',
      });
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Error updating order status:', error);
    triggerToast({
      message: t('toast.status_update_failed'),
      type: 'error',
      icon: 'mdi:alert-circle',
    });
  } finally {
    isLoading.value = false;
    activeStatusId.value = null;
  }
}

// Admin order handling (existing code)
const orders = computed(() => checkoutStore?.orders || [])
const orderStatus = ref([])
const currentStatus = ref('')

onMounted(() => {
  if (!isMerchantOrder.value) {
    checkoutStore.fetchStatus()
    const statusOrder = ['Order Placed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered']
    orderStatus.value = checkoutStore.status.sort((a, b) => {
      return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status)
    })
    currentStatus.value = checkoutStore.status.find((s) => s.id === props.orderData.statusId)?.status
  }
})

const currentStatusText = computed(() => {
  if (isMerchantOrder.value) {
    return props.orderData.status || 'pending'
  }
  if (currentStatus.value) {
    return currentStatus.value
  }
  return checkoutStore.status.find((s) => s.id === props.orderData.statusId)?.status || 'Unknown'
})

const currentStatusIndex = computed(() => {
  if (isMerchantOrder.value) {
    return merchantOrderStatuses.findIndex(s => s.id === props.orderData.status)
  }
  return orderStatus.value.findIndex(s => s.id === props.orderData.statusId)
})

const nextStatusId = computed(() => {
  if (currentStatusIndex.value === -1 || currentStatusIndex.value >= orderStatus.value.length - 1) {
    return null
  }
  return orderStatus.value[currentStatusIndex.value + 1]?.id
})

const calculateTotal = (cartItems) => {
  if (!cartItems || !cartItems.length) return 0
  if (hasOffers.value) {
    return cartItems.reduce((total, item) => {
    return total + (parseFloat(item.offerPrice || 0))
  }, 0)
  } else {
    return cartItems.reduce((total, item) => {
    return total + (parseFloat(item.discountedPrice || 0) * (item.quantity || 1))
  }, 0)
  }
}

const getStatusIcon = (status) => {
  switch (status) {
    case 'Order Placed':
      return 'mdi:check-circle'
    case 'Processing':
      return 'mdi:clock-outline'
    case 'Shipped':
      return 'mdi:truck-outline'
    case 'Out for Delivery':
      return 'mdi:package-variant'
    case 'Delivered':
      return 'mdi:check-circle'
    default:
      return 'mdi:help-circle'
  }
}

const statusIcon = computed(() => getStatusIcon(currentStatusText.value))

const hasOffers = computed(() => {
  return props.orderData.cart?.some(item => item.selectedOffer)
})

const { currencyLocale } = useCurrencyLocale()
</script>