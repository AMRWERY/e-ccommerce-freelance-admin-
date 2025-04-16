<template>
  <div>
    <div v-if="isDialogOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="w-full max-w-xl p-4 bg-white rounded-lg max-h-[550px] scrollable-dialog overflow-y-auto">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold">{{ $t('dashboard.edit_permissions') }}</h3>
          <button @click="closeDialog" class="text-gray-500 hover:text-gray-700">
            <iconify-icon icon="mdi:close" width="24" height="24" />
          </button>
        </div>

        <!-- Iterate over each permissions section -->
        <div v-if="selectedRole && selectedRole.permissions" class="space-y-6">
          <div v-for="(sectionPermissions, sectionKey) in selectedRole.permissions" :key="sectionKey">
            <!-- Display a title for the section -->
            <p class="mb-2 text-base font-bold">
              {{ $t(`permissions.sections.${sectionKey}`) }}
            </p>
            <!-- List all actions in this section as checkboxes -->
            <div class="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div v-for="(actionAllowed, actionKey) in sectionPermissions" :key="actionKey"
                class="flex items-center space-s-2">
                <input type="checkbox" :id="`${sectionKey}-${actionKey}`"
                  v-model="selectedRole.permissions[sectionKey][actionKey]"
                  class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                <label :for="`${sectionKey}-${actionKey}`" class="text-sm text-gray-700 capitalize">
                  {{ $t(`permissions.actions.${actionKey}`) }}
                </label>
              </div>
            </div>
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
const rolesStore = useRolesStore()
const employeesStore = useEmployeesStore()

const props = defineProps({
  userId: String,
  isDialogOpen: Boolean
})

const emit = defineEmits(['update:isDialogOpen', 'saved'])
const selectedRole = ref(null)

watch(() => props.userId, async (newVal) => {
  if (newVal) {
    const employee = employeesStore.employees.find(e => e.id === newVal)
    if (employee && employee.roledId) {
      const role = rolesStore.roles.find(r => r.id === employee.roledId)
      if (role) {
        selectedRole.value = JSON.parse(JSON.stringify(role))
      }
    }
  }
})

const closeDialog = () => {
  emit('update:isDialogOpen', false)
}

const savePermissions = async () => {
  try {
    await rolesStore.updateRole(selectedRole.value.id, {
      permissions: selectedRole.value.permissions
    })
    emit('saved')
    closeDialog()
  } catch (error) {
    console.error('Error saving permissions:', error)
  }
}

onMounted(() => {
  rolesStore.fetchRoles();
  // console.log("Roles in store:", rolesStore.roles);
});
</script>