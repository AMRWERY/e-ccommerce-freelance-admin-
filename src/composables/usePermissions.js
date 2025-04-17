export function usePermissions() {
  const hasPermission = (section, action) => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.permissions?.[section]?.[action] ?? false;
  };

  return { hasPermission };
}
