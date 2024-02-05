import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    lng: "it",
    fallbackLng: "it",
    debug: false,
    load: "languageOnly",
    ns: ["default"],
    defaultNS: "default",
    backend: {
      loadPath: `/api/it.json`,
    },
  });

export default i18n;
