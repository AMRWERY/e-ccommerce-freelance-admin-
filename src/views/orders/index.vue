<script setup>
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCheckoutStore } from '@/stores/checkoutStore'
import { useLocationTranslations } from '@/composables/useLocationTranslations'
import OrderDetailsDialog from '@/components/reusable-components/order-details-dialog.vue'

const { t } = useI18n()
const { getTranslatedLocation } = useLocationTranslations()
const checkoutStore = useCheckoutStore()

const showDetailsDialog = ref(false)
const selectedOrder = ref(null)

const openDetailsDialog = (order) => {
  selectedOrder.value = order
  showDetailsDialog.value = true
}

onMounted(() => {
  checkoutStore.fetchOrders()
})

const orders = computed(() => checkoutStore.orders || [])
</script>

<template>
  <v-container>
    <v-card>
      <v-card-title class="text-h5">
        {{ t('orders.title') }}
      </v-card-title>
      <v-card-text>
        <v-table>
          <thead>
            <tr>
              <th>{{ t('orders.orderNumber') }}</th>
              <th>{{ t('orders.customerName') }}</th>
              <th>{{ t('orders.country') }}</th>
              <th>{{ t('orders.governorate') }}</th>
              <th>{{ t('orders.status') }}</th>
              <th>{{ t('orders.totalAmount') }}</th>
              <th>{{ t('orders.actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in orders" :key="order.id">
              <td>{{ order.id }}</td>
              <td>{{ order.customerName }}</td>
              <td>{{ getTranslatedLocation(order.deliveryDetails?.country) }}</td>
              <td>{{ getTranslatedLocation(order.deliveryDetails?.governorate) }}</td>
              <td>{{ t(`orders.status.${order.status}`) }}</td>
              <td>{{ order.totalAmount }}</td>
              <td>
                <v-btn icon="mdi-eye" variant="text" @click="openDetailsDialog(order)">
                  <v-tooltip activator="parent" location="top">
                    {{ t('orders.viewDetails') }}
                  </v-tooltip>
                </v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
    </v-card>

    <order-details-dialog
      v-model="showDetailsDialog"
      :order-data="selectedOrder"
    />
  </v-container>
</template> 