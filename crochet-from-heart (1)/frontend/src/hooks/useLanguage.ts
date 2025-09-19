import { useTranslation } from "react-i18next";

export const useLanguage = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("cfh_lang", lng);
    document.documentElement.dir = lng === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lng;
  };

  const toggleLanguage = () => {
    changeLanguage(i18n.language === "en" ? "ar" : "en");
  };

  return { currentLanguage: i18n.language, changeLanguage, toggleLanguage };
};
