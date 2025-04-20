<template>
  <div>
    <div v-if="isDialogOpen && product"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="w-full max-w-xl p-4 bg-white rounded-lg max-h-[550px] scrollable-dialog overflow-y-auto">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold">{{ $t('dashboard.order_now') }}</h3>
          <button @click="closeDialog" class="text-gray-500 hover:text-gray-700">
            <iconify-icon icon="mdi:close" width="24" height="24" />
          </button>
        </div>

        <div class="space-y-4">
          <!-- Product Info Section -->
          <div class="p-4 rounded-lg bg-gray-50">
            <div class="flex items-start gap-4">
              <img :src="product.imageUrl1" alt="product-image" class="object-cover w-20 h-20 rounded-lg">
              <div>
                <h4 class="text-lg font-semibold text-gray-900">
                  {{ $i18n.locale === 'ar' ? product.titleAr : product.title }}
                </h4>
                <p class="text-sm text-gray-600">
                  {{ $t('dashboard.available_stock') }}: {{ product.numberOfStock }}
                </p>
                <div class="flex items-center gap-2 mt-1">
                  <span class="text-lg font-bold text-blue-600">
                    {{ $n(parseFloat(product.discountedPrice), 'currency', currencyLocale(product.targetMarket)) }}
                  </span>
                  <span class="text-sm text-gray-500 line-through" v-if="product.discount > 0">
                    {{ $n(parseFloat(product.originalPrice), 'currency', currencyLocale(product.targetMarket)) }}
                  </span>
                </div>
                <p class="mt-1 text-sm text-gray-600">
                  <template v-if="product.commission">
                    {{ $t('dashboard.commission') }}: {{ product.commission }}%
                  </template>
                  <template v-else>
                    {{ $t('dashboard.no_commission') }}
                  </template>
                </p>
              </div>
            </div>
          </div>

          <!-- Order Form -->
          <form @submit.prevent="submitOrder" class="space-y-4">
            <div>
              <label for="quantity" class="block mb-2 text-sm font-medium text-gray-700">
                {{ $t('form.quantity') }} <span class="text-red-500">*</span>
              </label>
              <input type="number" id="quantity" v-model="formData.quantity" min="1" :max="product.numberOfStock"
                class="block w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required>
            </div>

            <div>
              <label for="customerName" class="block mb-2 text-sm font-medium text-gray-700">
                {{ $t('form.customer_name') }} <span class="text-red-500">*</span>
              </label>
              <input type="text" id="customerName" v-model="formData.name"
                class="block w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required>
            </div>

            <div>
              <label for="phone" class="block mb-2 text-sm font-medium text-gray-700">
                {{ $t('form.customer_phone') }} <span class="text-red-500">*</span>
              </label>
              <input type="tel" id="phone" v-model="formData.phoneNumber"
                class="block w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required>
            </div>

            <div>
              <label for="fullAddress" class="block mb-2 text-sm font-medium text-gray-700">
                {{ $t('form.delivery_address') }} <span class="text-red-500">*</span>
              </label>
              <textarea id="fullAddress" v-model="formData.fullAddress" rows="3"
                class="block w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required></textarea>
            </div>

            <div>
              <label for="notes" class="block mb-2 text-sm font-medium text-gray-700">
                {{ $t('form.notes') }}
              </label>
              <textarea id="notes" v-model="formData.notes" rows="2"
                class="block w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"></textarea>
            </div>
          </form>
        </div>

        <div class="flex justify-end gap-3 mt-6">
          <button @click="closeDialog"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50">
            {{ $t('btn.cancel') }}
          </button>
          <button @click="submitOrder" :disabled="!isFormValid"
            class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50">
            {{ $t('btn.place_order') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// const { t } = useI18n()
// const ordersStore = useOrdersStore()
const { currencyLocale } = useCurrencyLocale()

const props = defineProps({
  isDialogOpen: Boolean,
  product: {
    type: Object,
    required: false,
    default: null
  }
})

const emit = defineEmits(['update:isDialogOpen', 'order-placed'])

const formData = ref({
  quantity: 1,
  name: '',
  phoneNumber: '',
  fullAddress: '',
  notes: ''
})

const isFormValid = computed(() => {
  if (!props.product) return false
  return formData.value.quantity > 0 &&
    formData.value.quantity <= props.product.numberOfStock &&
    formData.value.name.trim() &&
    formData.value.phoneNumber.trim() &&
    formData.value.fullAddress.trim()
})

const closeDialog = () => {
  formData.value = {
    quantity: 1,
    name: '',
    phoneNumber: '',
    fullAddress: '',
    notes: ''
  }
  emit('update:isDialogOpen', false)
}

const submitOrder = async () => {
  if (!isFormValid.value || !props.product) return
  try {
    const orderData = {
      ...formData.value,
      productId: props.product.id,
      productTitle: props.product.title,
      productTitleAr: props.product.titleAr,
      productImage: props.product.imageUrl1,
      price: props.product.discountedPrice,
      totalAmount: props.product.discountedPrice * formData.value.quantity,
      status: 'pending',
      targetMarket: props.product.targetMarket,
      createdAt: new Date().toISOString()
    }
    // await ordersStore.createOrder(orderData)
    emit('order-placed', orderData)
    closeDialog()
  } catch (error) {
    console.error('Error placing order:', error)
  } finally { }
}
</script>