export function useCurrencyLocale() {
  const { locale } = useI18n();

  const currencyLocale = computed(() => {
    return locale.value === "en" ? "en-US" : "ar-EG";
  });

  return { currencyLocale };
}
