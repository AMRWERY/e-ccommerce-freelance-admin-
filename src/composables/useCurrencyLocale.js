export function useCurrencyLocale() {
  const { locale } = useI18n();

  const currencyLocale = (targetMarket) => {
    if (targetMarket === "Saudi Arabia") {
      return locale.value === "en" ? "en-SA" : "ar-SA";
    }
    return locale.value === "en" ? "en-US" : "ar-EG";
  };

  return { currencyLocale };
}
