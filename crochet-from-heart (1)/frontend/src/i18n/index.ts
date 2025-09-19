import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      nav: {
        home: "Home",
        explore: "Explore",
        create: "Create",
        login: "Log in",
        register: "Sign up",
      },
      pattern: {
        create: "Create Pattern",
        upload: "Upload Images",
        title: "Title",
        summary: "Summary",
        steps: "Steps",
        materials: "Materials",
        difficulty: "Difficulty",
        tags: "Tags",
        materialPlaceholder: "Add material",
        addMaterial: "Add Material",
        tagsPlaceholder: "Comma-separated tags",
        easy: "Easy",
        medium: "Medium",
        hard: "Hard",
      },
      auth: {
        logout: "Log out",
      },
      cta: {
        learn_more: "Learn more",
      },
      toast: {
        pattern_uploaded: "Pattern uploaded successfully",
      },
      common: {
        saving: "Saving...",
        create: "Create",
        update: "Update",
      },
      chat: {
        global: "Global Chat",
        typeMessage: "Type a message...",
        send: "Send",
      },
    },
  },
  ar: {
    translation: {
      nav: {
        home: "الرئيسية",
        explore: "استكشف",
        create: "انشر موديل",
        login: "تسجيل الدخول",
        register: "إنشاء حساب",
      },
      pattern: {
        create: "أضف موديل جديد",
        upload: "ارفع صور الموديل",
        title: "العنوان",
        summary: "الملخص",
        steps: "الخطوات",
        materials: "المواد",
        difficulty: "الصعوبة",
        tags: "الكلمات الدالة",
        materialPlaceholder: "أضف مادة",
        addMaterial: "إضافة مادة",
        tagsPlaceholder: "كلمات دالة مفصولة بفواصل",
        easy: "سهل",
        medium: "متوسط",
        hard: "صعب",
      },
      auth: {
        logout: "تسجيل الخروج",
      },
      cta: {
        learn_more: "اعرف أكتر",
      },
      toast: {
        pattern_uploaded: "الموديل اتنشر بنجاح 💖",
      },
      common: {
        saving: "جاري الحفظ...",
        create: "إنشاء",
        update: "تحديث",
      },
      chat: {
        global: "الدردشة العامة",
        typeMessage: "اكتب رسالة...",
        send: "إرسال",
      },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem("cfh_lang") || "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
