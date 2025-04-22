<template>
  <div>
    <div class="p-4 space-y-6">
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div class="p-6 bg-white rounded-lg shadow-md">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500">{{ $t('dashboard.total_orders') }}</p>
              <p class="mt-1 text-xl font-semibold text-gray-900">{{ totalOrders }}</p>
            </div>
            <div class="p-1.5 bg-blue-100 rounded-full flex items-center justify-center">
              <iconify-icon icon="mdi:shopping" class="text-blue-600" width="24" height="24" />
            </div>
          </div>
        </div>

        <div class="p-6 bg-white rounded-lg shadow-md">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500">{{ $t('dashboard.total_products') }}</p>
              <p class="mt-1 text-xl font-semibold text-gray-900">{{ totalProducts }}</p>
            </div>
            <div class="p-1.5 bg-green-100 rounded-full flex items-center justify-center">
              <iconify-icon icon="mdi:package-variant" class="text-green-600" width="24" height="24" />
            </div>
          </div>
        </div>

        <div class="p-6 bg-white rounded-lg shadow-md">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500">{{ $t('dashboard.total_customers') }}</p>
              <p class="mt-1 text-xl font-semibold text-gray-900">{{ totalCustomers }}</p>
            </div>
            <div class="p-1.5 bg-purple-100 rounded-full flex items-center justify-center">
              <iconify-icon icon="mdi:account-group" class="text-purple-600" width="24" height="24" />
            </div>
          </div>
        </div>

        <div class="p-6 bg-white rounded-lg shadow-md">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500">{{ $t('dashboard.total_revenue') }}</p>
              <p class="mt-1 text-xl font-semibold text-gray-900">
                {{ $n(totalRevenue, 'currency', currencyLocale('Egypt')) }}
              </p>
            </div>
            <div class="p-1.5 bg-indigo-100 rounded-full flex items-center justify-center">
              <iconify-icon icon="mdi:cash-multiple" class="text-indigo-600" width="24" height="24" />
            </div>
          </div>
        </div>
      </div>

      <!-- Earnings Charts Section -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <!-- Normal Earnings Chart -->
        <div class="p-6 bg-white rounded-lg shadow-md">
          <div class="flex flex-col">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-semibold text-gray-800">{{ $t('dashboard.normal_earnings') }}</h2>
              <div class="flex items-center gap-2">
                <button v-for="filter in timeFilters" :key="filter.value"
                  @click="updateNormalEarningsFilter(filter.value)" :class="[
                    'px-3 py-1 text-sm font-medium rounded-md',
                    normalEarningsFilter === filter.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  ]">
                  {{ filter.label }}
                </button>
              </div>
            </div>
            <div class="relative h-[300px]">
              <div v-if="normalChartLoading"
                class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
                <div class="flex items-center gap-2">
                  <iconify-icon icon="line-md:loading-loop" width="24" height="24" class="text-blue-600" />
                  <span class="text-sm font-medium text-gray-600">{{ $t('btn.loading') }}</span>
                </div>
              </div>
              <apexchart v-if="!normalChartLoading" type="area" height="100%" :key="normalEarningsFilter"
                :options="normalChartOptions" :series="normalChartSeries" />
            </div>
            <div class="mt-4 text-center">
              <p class="text-sm text-gray-600">{{ $t('dashboard.total_earnings') }}</p>
              <p class="text-2xl font-bold text-blue-600">
                {{ $n(getTotalEarnings(normalEarningsData), 'currency', currencyLocale('Egypt')) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Marketing Earnings Chart -->
        <div class="p-6 bg-white rounded-lg shadow-md">
          <div class="flex flex-col">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-semibold text-gray-800">{{ $t('dashboard.marketing_earnings') }}</h2>
              <div class="flex items-center gap-2">
                <button v-for="filter in timeFilters" :key="filter.value"
                  @click="updateMarketingEarningsFilter(filter.value)" :class="[
                    'px-3 py-1 text-sm font-medium rounded-md',
                    marketingEarningsFilter === filter.value
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  ]">
                  {{ filter.label }}
                </button>
              </div>
            </div>
            <div class="relative h-[300px]">
              <div v-if="marketingChartLoading"
                class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
                <div class="flex items-center gap-2">
                  <iconify-icon icon="line-md:loading-loop" width="24" height="24" class="text-green-600" />
                  <span class="text-sm font-medium text-gray-600">{{ $t('btn.loading') }}</span>
                </div>
              </div>
              <apexchart v-if="!marketingChartLoading" type="area" height="100%" :key="marketingEarningsFilter"
                :options="marketingChartOptions" :series="marketingChartSeries" />
            </div>
            <div class="mt-4 text-center">
              <p class="text-sm text-gray-600">{{ $t('dashboard.total_earnings') }}</p>
              <p class="text-2xl font-bold text-green-600">
                {{ $n(getTotalEarnings(marketingEarningsData), 'currency', currencyLocale('Egypt')) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Statistics Section -->
      <div class="grid gap-6 lg:grid-cols-2">
        <!-- Most Sold Products -->
        <div class="p-6 bg-white rounded-lg shadow-md">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold text-gray-800">{{ $t('dashboard.most_sold_products') }}</h2>
            <button @click="refreshTopProducts" data-tooltip-target="tooltip-update-data"
              class="flex items-center justify-center p-2 text-gray-600 rounded-full hover:bg-gray-100">
              <iconify-icon icon="mdi:refresh" width="20" height="20" />
            </button>
            <div id="tooltip-update-data" role="tooltip"
              class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-xs opacity-0 tooltip dark:bg-gray-700">
              {{ $t('tooltip.reload') }}
              <div class="tooltip-arrow" data-popper-arrow></div>
            </div>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="text-sm font-medium text-gray-700 border-b border-gray-200">
                  <th class="pb-3 text-start">{{ $t('dashboard.product') }}</th>
                  <th class="pb-3 text-end">{{ $t('dashboard.sales') }}</th>
                  <th class="pb-3 text-end">{{ $t('dashboard.revenue') }}</th>
                </tr>
              </thead>
              <tbody>
                <template v-if="loading">
                  <tr v-for="i in 5" :key="i" class="animate-pulse">
                    <td class="py-3">
                      <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-gray-200 rounded-lg"></div>
                        <div class="w-32 h-4 bg-gray-200 rounded"></div>
                      </div>
                    </td>
                    <td class="py-3">
                      <div class="w-16 h-4 bg-gray-200 rounded ms-auto"></div>
                    </td>
                    <td class="py-3">
                      <div class="w-24 h-4 bg-gray-200 rounded ms-auto"></div>
                    </td>
                  </tr>
                </template>
                <template v-else>
                  <tr v-for="product in topProducts" :key="product.id"
                    class="text-sm text-gray-600 border-b border-gray-200">
                    <td class="py-3">
                      <div class="flex items-center gap-3">
                        <img :src="product.imageUrl1" :alt="product.title" class="object-cover w-10 h-10 rounded-lg">
                        <span>{{ $i18n.locale === 'ar' ? product.titleAr : product.title }}</span>
                      </div>
                    </td>
                    <td class="py-3 text-end">{{ product.sales }}</td>
                    <td class="py-3 text-end">
                      {{ $n(product.revenue, 'currency', currencyLocale('Egypt')) }}
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Best Categories -->
        <div class="p-6 bg-white rounded-lg shadow-md">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold text-gray-800">{{ $t('dashboard.best_categories') }}</h2>
            <button @click="refreshCategories" data-tooltip-target="tooltip-update-data-one"
              class="flex items-center justify-center p-2 text-gray-600 rounded-full hover:bg-gray-100">
              <iconify-icon icon="mdi:refresh" width="20" height="20" />
            </button>
            <div id="tooltip-update-data-one" role="tooltip"
              class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-xs opacity-0 tooltip dark:bg-gray-700">
              {{ $t('tooltip.reload') }}
              <div class="tooltip-arrow" data-popper-arrow></div>
            </div>
          </div>
          <div class="relative h-[300px]">
            <div v-if="categoriesChartLoading"
              class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
              <div class="flex items-center gap-2">
                <iconify-icon icon="line-md:loading-loop" width="24" height="24" class="text-purple-600" />
                <span class="text-sm font-medium text-gray-600">{{ $t('btn.loading') }}</span>
              </div>
            </div>
            <apexchart v-if="!categoriesChartLoading" type="donut" height="100%" :key="'categories'"
              :options="categoryChartOptions" :series="categoryChartSeries" />
          </div>
        </div>
      </div>

      <!-- Users and Employees Section -->
      <div class="grid gap-6 lg:grid-cols-2">
        <!-- Top Employees -->
        <div class="p-6 bg-white rounded-lg shadow-md">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold text-gray-800">{{ $t('dashboard.active_employees') }}</h2>
            <button @click="refreshEmployees" data-tooltip-target="tooltip-update-data-two"
              class="flex items-center justify-center p-2 text-gray-600 rounded-full hover:bg-gray-100">
              <iconify-icon icon="mdi:refresh" width="20" height="20" />
            </button>
            <div id="tooltip-update-data-two" role="tooltip"
              class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-xs opacity-0 tooltip dark:bg-gray-700">
              {{ $t('tooltip.reload') }}
              <div class="tooltip-arrow" data-popper-arrow></div>
            </div>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="text-sm font-medium text-gray-700 border-b border-gray-200">
                  <th class="pb-3 text-start">{{ $t('dashboard.employee') }}</th>
                  <th class="pb-3 text-end">{{ $t('dashboard.joined_date') }}</th>
                </tr>
              </thead>
              <tbody>
                <template v-if="employeesLoading">
                  <tr v-for="i in 5" :key="i" class="animate-pulse">
                    <td class="py-3">
                      <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-gray-200 rounded-full"></div>
                        <div class="w-32 h-4 bg-gray-200 rounded"></div>
                      </div>
                    </td>
                    <td class="py-3">
                      <div class="w-24 h-4 bg-gray-200 rounded ms-auto"></div>
                    </td>
                  </tr>
                </template>
                <template v-else>
                  <tr v-for="employee in activeEmployees" :key="employee.id"
                    class="text-sm text-gray-600 border-b border-gray-200">
                    <td class="py-3">
                      <div class="flex items-center gap-3">
                        <div class="flex items-center justify-center w-10 h-10 text-white rounded-full"
                          :class="employee.bgColor">
                          <iconify-icon icon="mdi:account" width="20" height="20" />
                        </div>
                        <div>
                          <span class="block font-medium">{{ employee.name }}</span>
                          <span class="text-xs text-gray-500">{{ employee.email }}</span>
                        </div>
                      </div>
                    </td>
                    <td class="py-3 text-end">{{ employee.createdAt }}</td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Active Users -->
        <div class="p-6 bg-white rounded-lg shadow-md">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold text-gray-800">{{ $t('dashboard.active_users') }}</h2>
            <button @click="refreshUsers" data-tooltip-target="tooltip-update-data-three"
              class="flex items-center justify-center p-2 text-gray-600 rounded-full hover:bg-gray-100">
              <iconify-icon icon="mdi:refresh" width="20" height="20" />
            </button>
            <div id="tooltip-update-data-three" role="tooltip"
              class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-xs opacity-0 tooltip dark:bg-gray-700">
              {{ $t('tooltip.reload') }}
              <div class="tooltip-arrow" data-popper-arrow></div>
            </div>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="text-sm font-medium text-gray-700 border-b border-gray-200">
                  <th class="pb-3 text-start">{{ $t('dashboard.user') }}</th>
                  <th class="pb-3 text-end">{{ $t('dashboard.total_orders') }}</th>
                  <th class="pb-3 text-end">{{ $t('dashboard.total_spent') }}</th>
                </tr>
              </thead>
              <tbody>
                <template v-if="usersLoading">
                  <tr v-for="i in 5" :key="i" class="animate-pulse">
                    <td class="py-3">
                      <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-gray-200 rounded-full"></div>
                        <div class="w-32 h-4 bg-gray-200 rounded"></div>
                      </div>
                    </td>
                    <td class="py-3">
                      <div class="w-16 h-4 bg-gray-200 rounded ms-auto"></div>
                    </td>
                    <td class="py-3">
                      <div class="w-24 h-4 bg-gray-200 rounded ms-auto"></div>
                    </td>
                  </tr>
                </template>
                <template v-else>
                  <tr v-for="user in activeUsers" :key="user.id" class="text-sm text-gray-600 border-b border-gray-200">
                    <td class="py-3">
                      <div class="flex items-center gap-3">
                        <div class="flex items-center justify-center w-10 h-10 text-white rounded-full"
                          :class="user.bgColor">
                          <iconify-icon icon="mdi:account" width="20" height="20" />
                        </div>
                        <div>
                          <span class="block font-medium">{{ user.name }}</span>
                          <span class="text-xs text-gray-500">{{ user.email }}</span>
                        </div>
                      </div>
                    </td>
                    <td class="py-3 text-end">{{ user.totalOrders }}</td>
                    <td class="py-3 text-end">
                      {{ $n(user.totalSpent, 'currency', currencyLocale('Egypt')) }}
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { t, locale } = useI18n()
const { currencyLocale } = useCurrencyLocale()
const productsStore = useProductsStore()
const checkoutStore = useCheckoutStore()
const usersStore = useUsersStore()

// Get store refs for users and employees
const { topEmployees, topUsers } = storeToRefs(usersStore)
const { employeesLoading, usersLoading } = storeToRefs(usersStore)

const loading = ref(true)
const normalChartLoading = ref(true)
const marketingChartLoading = ref(true)
const categoriesChartLoading = ref(true)

// Time filters
const timeFilters = [
  { label: t('btn.daily'), value: 'daily' },
  { label: t('btn.weekly'), value: 'weekly' },
  { label: t('btn.monthly'), value: 'monthly' }
]

const normalEarningsFilter = ref('daily')
const marketingEarningsFilter = ref('daily')

// Stats
const totalOrders = computed(() => checkoutStore.orders.length)
const totalProducts = computed(() => productsStore.products.length)
const totalCustomers = computed(() => usersStore.activeUsers.length)
const totalRevenue = computed(() => {
  return checkoutStore.orders.reduce((total, order) => {
    if (order.cart && Array.isArray(order.cart)) {
      return total + order.cart.reduce((orderTotal, item) => {
        return orderTotal + (parseFloat(item.discountedPrice || 0) * (item.quantity || 1))
      }, 0)
    }
    return total
  }, 0)
})

// Chart Data
const normalEarningsData = ref([])
const marketingEarningsData = ref([])

// Fetch data on mount
onMounted(() => {
  loading.value = true
  normalChartLoading.value = true
  marketingChartLoading.value = true
  categoriesChartLoading.value = true

  Promise.all([
    productsStore.fetchProducts(),
    checkoutStore.fetchOrders(),
    usersStore.fetchEmployees(),
    usersStore.fetchDashboardUsers()
  ]).then(() => {
    generateChartData()
  }).catch((error) => {
    console.error('Error fetching data:', error)
  }).finally(() => {
    loading.value = false
    normalChartLoading.value = false
    marketingChartLoading.value = false
    categoriesChartLoading.value = false
  })
})

const updateNormalEarningsFilter = async (filter) => {
  normalChartLoading.value = true
  normalEarningsFilter.value = filter
  generateNormalChartData()
  await nextTick()
  normalChartLoading.value = false
}

const updateMarketingEarningsFilter = async (filter) => {
  marketingChartLoading.value = true
  marketingEarningsFilter.value = filter
  generateMarketingChartData()
  await nextTick()
  marketingChartLoading.value = false
}

// Split chart data generation into separate functions
const generateNormalChartData = () => {
  const now = new Date()
  const normalData = []

  let days = 30
  if (normalEarningsFilter.value === 'weekly') days = 7
  if (normalEarningsFilter.value === 'daily') days = 1

  for (let i = days; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)

    const dayEarnings = checkoutStore.orders
      .filter(order => {
        const orderDate = new Date(order.date)
        return orderDate.toDateString() === date.toDateString()
      })
      .reduce((total, order) => {
        if (order.cart && Array.isArray(order.cart)) {
          return total + order.cart.reduce((orderTotal, item) => {
            return orderTotal + (parseFloat(item.discountedPrice || 0) * (item.quantity || 1))
          }, 0)
        }
        return total
      }, 0)

    normalData.push({
      x: date.getTime(),
      y: dayEarnings || Math.floor(Math.random() * 10000) + 1000
    })
  }

  normalEarningsData.value = normalData
}

const generateMarketingChartData = () => {
  const now = new Date()
  const marketingData = []

  let days = 30
  if (marketingEarningsFilter.value === 'weekly') days = 7
  if (marketingEarningsFilter.value === 'daily') days = 1

  for (let i = days; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)

    const dayEarnings = checkoutStore.orders
      .filter(order => {
        const orderDate = new Date(order.date)
        return orderDate.toDateString() === date.toDateString()
      })
      .reduce((total, order) => {
        if (order.cart && Array.isArray(order.cart)) {
          return total + order.cart.reduce((orderTotal, item) => {
            return orderTotal + (parseFloat(item.discountedPrice || 0) * (item.quantity || 1))
          }, 0)
        }
        return total
      }, 0)

    marketingData.push({
      x: date.getTime(),
      y: Math.floor(dayEarnings * 0.3) || Math.floor(Math.random() * 5000) + 500
    })
  }

  marketingEarningsData.value = marketingData
}

const generateChartData = () => {
  generateNormalChartData()
  generateMarketingChartData()
}

// Chart Options
const commonChartOptions = {
  chart: {
    type: 'area',
    animations: {
      enabled: false
    },
    toolbar: {
      show: false
    },
    zoom: {
      enabled: false
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'smooth',
    width: 2
  },
  xaxis: {
    type: 'datetime'
  },
  yaxis: {
    labels: {
      formatter: (value) => {
        return new Intl.NumberFormat(locale.value, {
          style: 'currency',
          currency: 'EGP'
        }).format(value)
      }
    }
  },
  tooltip: {
    x: {
      format: 'dd MMM yyyy'
    }
  },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.7,
      opacityTo: 0.2,
      stops: [0, 90, 100]
    }
  }
}

const normalChartOptions = computed(() => ({
  ...commonChartOptions,
  colors: ['#2563eb'],
}))

const marketingChartOptions = computed(() => ({
  ...commonChartOptions,
  colors: ['#16a34a'],
}))

const normalChartSeries = computed(() => [{
  name: t('dashboard.earnings'),
  data: normalEarningsData.value
}])

const marketingChartSeries = computed(() => [{
  name: t('dashboard.earnings'),
  data: marketingEarningsData.value
}])

// Category Chart
const categoryChartOptions = {
  labels: ['Electronics', 'Fashion', 'Home', 'Beauty', 'Sports'],
  chart: {
    type: 'donut',
  },
  colors: ['#2563eb', '#16a34a', '#eab308', '#ef4444', '#8b5cf6'],
  legend: {
    position: 'bottom'
  },
  responsive: [{
    breakpoint: 480,
    options: {
      chart: {
        width: 200
      },
      legend: {
        position: 'bottom'
      }
    }
  }]
}

const categoryChartSeries = [44, 55, 41, 17, 15]

// Top Products
const topProducts = computed(() => {
  return productsStore.products
    .slice()
    .sort((a, b) => (b.sales || 0) - (a.sales || 0))
    .slice(0, 5)
    .map(product => ({
      ...product,
      sales: Math.floor(Math.random() * 100) + 50, // Demo data
      revenue: (product.discountedPrice || 0) * (Math.floor(Math.random() * 100) + 50)
    }))
})

// Helper function to calculate total earnings
const getTotalEarnings = (data) => {
  return data.reduce((sum, item) => sum + item.y, 0)
}

const refreshTopProducts = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 500)
}

const refreshCategories = () => {
  categoriesChartLoading.value = true
  setTimeout(() => {
    categoriesChartLoading.value = false
  }, 500)
}

// Watch for locale changes to update charts
watch(locale, () => {
  generateChartData()
})

const refreshEmployees = () => {
  usersStore.fetchEmployees()
}

const refreshUsers = () => {
  usersStore.fetchDashboardUsers()
}

// Replace the activeEmployees and activeUsers computed properties with store refs
const activeEmployees = computed(() => topEmployees.value || [])
const activeUsers = computed(() => topUsers.value || [])
</script>