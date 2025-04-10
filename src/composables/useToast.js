export function useToast() {
  const showToast = ref(false);
  const toastMessage = ref("");
  const toastType = ref("");
  const toastIcon = ref("");

  const triggerToast = ({ message, type, icon }) => {
    toastMessage.value = message || "";
    toastType.value = type || "";
    toastIcon.value = icon || "";
    showToast.value = true;

    setTimeout(() => {
      showToast.value = false;
    }, 3000);
  };

  return {
    showToast,
    toastMessage,
    toastType,
    toastIcon,
    triggerToast,
  };
}
