import { createI18n } from "vue-i18n";
import en from "@/locales/en.json";
import ar from "@/locales/ar.json";

function loadLocaleMessages() {
  return { en, ar };
}

const datetimeFormats = {
  "en-US": {
    short: {
      year: "numeric",
      month: "short",
      day: "numeric",
    },
    long: {
      year: "numeric",
      month: "short",
      day: "numeric",
      weekday: "short",
      hour: "numeric",
      minute: "numeric",
    },
  },
  "ar-EG": {
    short: {
      year: "numeric",
      month: "short",
      day: "numeric",
    },
    long: {
      year: "numeric",
      month: "short",
      day: "numeric",
      weekday: "short",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    },
  },
};

const numberFormats = {  "en-US": {
    currency: {
      style: "currency",
      currency: "EGP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      notation: "standard",
    },
    decimal: {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    },
    percent: {
      style: "percent",
      useGrouping: false,
    },
  },
  "ar-EG": {
    currency: {
      style: "currency",
      currency: "EGP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      useGrouping: true,
      currencyDisplay: "symbol",
    },
    decimal: {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    },
    percent: {
      style: "percent",
      useGrouping: false,
    },
  },
  "en-SA": {
    currency: {
      style: "currency",
      currency: "SAR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      notation: "standard",
    },
    decimal: {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    },
    percent: {
      style: "percent",
      useGrouping: false,
    },
  },
  "ar-SA": {
    currency: {
      style: "currency",
      currency: "SAR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      useGrouping: true,
      currencyDisplay: "symbol",
    },
    decimal: {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    },
    percent: {
      style: "percent",
      useGrouping: false,
    },
  },
};

export default createI18n({
  legacy: false,
  locale: "ar",
  fallbackLocale: "en",
  messages: loadLocaleMessages(),
  datetimeFormats,
  numberFormats,
});
