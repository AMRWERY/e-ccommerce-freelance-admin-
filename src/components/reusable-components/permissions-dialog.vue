<template>
  <div>
    <div v-if="isDialogOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="w-full max-w-lg p-6 bg-white rounded-lg">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold">{{ $t('dashboard.edit_permissions') }}</h3>
          <button @click="closeDialog" class="text-gray-500 hover:text-gray-700">
            <iconify-icon icon="mdi:close" width="24" height="24" />
          </button>
        </div>

        <div class="space-y-4" v-if="permissions">
          <div v-for="(value, permission) in permissions" :key="permission" class="flex items-center">
            <input type="checkbox" :id="permission" v-model="permissions[permission]"
              class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
            <label :for="permission" class="text-sm text-gray-700 ms-2">
              {{ $t(`permissions.${permission}`) }}
            </label>
          </div>
        </div>

        <div class="flex justify-end gap-3 mt-6">
          <button @click="closeDialog"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
            {{ $t('btn.cancel') }}
          </button>
          <button @click="savePermissions"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
            {{ $t('btn.save_changes') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  userId: String,
  isDialogOpen: Boolean
});

const emit = defineEmits(['update:isDialogOpen', 'saved']);

const employeesStore = useEmployeesStore();
const permissions = ref(null);

watch(() => props.userId, async (newVal) => {
  if (newVal) {
    const user = employeesStore.employees.find(u => u.id === newVal);
    permissions.value = { ...user.permissions };
  }
});

const closeDialog = () => {
  emit('update:isDialogOpen', false);
};

const savePermissions = async () => {
  try {
    await employeesStore.updateUserPermissions(props.userId, permissions.value);
    emit('saved');
    closeDialog();
  } catch (error) {
    console.error('Error saving permissions:', error);
  }
};
</script>