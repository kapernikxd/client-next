import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  returnNull: false,
  fallbackLng: "en",
  lng: "en",
  resources: {
    en: {
      translations: {
        common: require("./localization/en/translation.json"),
        auth: require("./localization/en/auth.json"),
        pages: require("./localization/en/pages.json"),
        chat: require("./localization/en/chat.json"),
      },
    },
    ru: {
      translations: {
        common: require("./localization/ru/translation.json"),
        auth: require("./localization/ru/auth.json"),
        pages: require("./localization/ru/pages.json"),
        chat: require("./localization/ru/chat.json"),
      },
    },
  },
  ns: ["translations", "authForm", "pages"],
  defaultNS: "translations",
});

i18n.languages = ["en", "ru"];

export type Ti18Languages = "en" | "ru";

export default i18n;
