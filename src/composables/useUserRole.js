export function useUserRole() {
  const userRole = computed(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        return {
          role: parsed.role || "Unknown role",
          email: parsed.email || "No email",
          name: parsed.name || "No name",
          imageUrl: parsed.imageUrl || "No imageUrl",
        };
      } catch (err) {
        console.error("Error parsing user from localStorage:", err);
        return null;
      }
    }
    return null;
  });

  return { userRole };
}
