<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-base font-semibold leading-6 text-gray-900">New Merchants</h1>
        <p class="mt-2 text-sm text-gray-700">A list of all new merchants in the system.</p>
      </div>
    </div>
    <div class="mt-8 flow-root">
      <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <table class="min-w-full divide-y divide-gray-300">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">#</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Market Name</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Username</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Description</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Created At</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                <tr v-for="(merchant, index) in paginatedMerchants" :key="merchant.id">
                  <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                    {{ getItemNumber(index) }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ merchant.name }}</td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ merchant.username }}</td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ merchant.description }}</td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {{ merchant.createdAt.toLocaleDateString() }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-4">
      <pagination
        :current-page="currentPage"
        :total-items="newMerchantStore.merchants.length"
        :items-per-page="itemsPerPage"
        @page-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useNewMerchantStore } from '@/stores/newMerchantStore';
import Pagination from '@/components/pagination.vue';

const newMerchantStore = useNewMerchantStore();
const currentPage = ref(1);
const itemsPerPage = 10;

const paginatedMerchants = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return newMerchantStore.merchants.slice(start, end);
});

const getItemNumber = (index) => {
  return (currentPage.value - 1) * itemsPerPage + index + 1;
};

const handlePageChange = (page) => {
  currentPage.value = page;
};

onMounted(async () => {
  await newMerchantStore.fetchAllMerchants();
});
</script> 