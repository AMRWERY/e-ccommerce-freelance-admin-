import en from "@vee-validate/i18n/dist/locale/en.json";
import ar from "@vee-validate/i18n/dist/locale/ar.json";
import inputsEn from "@/locales/en.json";
import inputsAr from "@/locales/ar.json";

export default {
  install(app) {
    // Define validation rules
    defineRule("required", required);
    defineRule("min", min);
    defineRule("alpha_spaces", alpha_spaces);
    defineRule("numeric", numeric);
    defineRule("regex", regex);
    defineRule("email", (value) => {
      if (!value || !value.length) {
        return true;
      }
      // if (!/^[A-Z0-9._%+-]+@ship\.com$/i.test(value)) {
      //   return "Email must be a valid 'ship.com' address";
      // }
      return true;
    });
    defineRule("minLength", (value, [limit]) => {
      if (!value || !value.length) {
        return true;
      }
      if (value.length < limit) {
        return `This field must be at least ${limit} characters`;
      }
      return true;
    });

    defineRule("confirmed", (value, [target]) => {
      if (value === target) {
        return true;
      }
      return "Passwords must match";
    });

    // Initial configuration
    configure({
      generateMessage: localize({ en, ar }),
    });

    const localeStore = useLocaleStore();

    const updateValidationLocale = (locale) => {
      configure({
        generateMessage: localize({
          en: {
            ...en,
            names: inputsEn.form,
          },
          ar: {
            ...ar,
            names: inputsAr.form,
          },
        }),
      });
      setLocale(locale);
    };

    const initialLocale =
      localeStore.locale || localStorage.getItem("locale") || "en";
    updateValidationLocale(initialLocale);

    watch(
      () => localeStore.locale,
      (newLocale) => {
        localStorage.setItem("locale", newLocale);
        updateValidationLocale(newLocale);
      }
    );
  },
};
