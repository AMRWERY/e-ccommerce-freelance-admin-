export function usePermissions() {
  const authStore = useAuthStore();

  const hasPermission = (section, action) => {
    return computed(() => {
      return authStore.user?.permissions?.[section]?.[action] ?? false;
    }).value;
  };

  return { hasPermission };
}
