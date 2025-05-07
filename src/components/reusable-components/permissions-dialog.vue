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
        <!-- Permissions Content -->
        <div v-if="selectedRole && selectedRole.permissions" class="space-y-6">
          <div v-for="(sectionPermissions, sectionKey) in selectedRole.permissions" :key="sectionKey">
            <p class="mb-2 text-base font-bold">
              {{ $t(`permissions.sections.${sectionKey}`) }}
            </p>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <div v-for="(actionAllowed, actionKey) in sectionPermissions" :key="actionKey"
                class="flex items-center space-s-2">
                <input type="checkbox" :id="`${sectionKey}-${actionKey}`"
                  v-model="selectedRole.permissions[sectionKey][actionKey]" @change="$forceUpdate()"
                  class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50" />
                <label :for="`${sectionKey}-${actionKey}`" class="text-sm text-gray-700 capitalize select-none">
                  {{ $t(`permissions.actions.${actionKey}`) }}
                </label>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-3 mt-6">
          <button @click="savePermissions"
            class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50">
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
    await rolesStore.fetchRoles();
    const employee = employeesStore.employees.find(e => e.id === newVal);
    if (employee) {
      // If employee has direct permissions, use those
      if (employee.permissions) {
        selectedRole.value = {
          id: employee.roledId || 'direct-permissions',
          name: employee.role,
          permissions: employee.permissions
        };
      }
      // If no direct permissions but has roledId, get from role
      else if (employee.roledId) {
        const role = rolesStore.roles.find(r => r.id === employee.roledId);
        if (role) {
          selectedRole.value = JSON.parse(JSON.stringify(role));
        }
      }
    }
  }
}, { immediate: true });

const closeDialog = () => {
  emit('update:isDialogOpen', false)
}

const savePermissions = async () => {
  try {
    await rolesStore.updateRoleAndSyncUsers(
      selectedRole.value.id,
      { permissions: selectedRole.value.permissions }
    );
    await employeesStore.updateUserPermissions(props.userId, selectedRole.value.permissions);
    await Promise.all([
      rolesStore.fetchRoles(),
      employeesStore.fetchEmployees()
    ]);
    const currentUser = JSON.parse(localStorage.getItem('user'));
    if (currentUser && currentUser.uid === props.userId) {
      currentUser.permissions = selectedRole.value.permissions;
      localStorage.setItem('user', JSON.stringify(currentUser));
    }
    emit('saved');
    closeDialog();
  } catch (error) {
    console.error('Error saving permissions:', error);
  }
};

const loadPermissions = async () => {
  if (!props.userId) return
  try {
    await rolesStore.fetchRoles()
    const employee = employeesStore.employees.find(e => e.id === props.userId)
    if (employee) {
      if (employee.permissions) {
        selectedRole.value = {
          id: employee.roledId || 'direct-permissions',
          name: employee.role,
          permissions: employee.permissions
        }
      } else if (employee.roledId) {
        const role = rolesStore.roles.find(r => r.id === employee.roledId)
        if (role) {
          selectedRole.value = JSON.parse(JSON.stringify(role))
        }
      }
    }
  } catch (err) {
    console.error('Error loading permissions:', err)
  } finally { }
}

watch(() => props.userId, loadPermissions, { immediate: true })

onMounted(() => {
  loadPermissions()
})
</script>