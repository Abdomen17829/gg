import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Heart, Sun, Moon } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../hooks/useTheme";
import { useLanguage } from "../hooks/useLanguage";

const Header = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { currentLanguage, toggleLanguage } = useLanguage();

  return (
    <header className="bg-cfh-card shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Heart className="text-cfh-accent" />
          <span className="text-xl font-semibold">Crochet From Heart</span>
        </div>

        <nav className="flex items-center space-x-4 rtl:space-x-reverse">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          <button
            onClick={toggleLanguage}
            className="px-3 py-1 rounded border border-cfh-accent text-cfh-accent hover:bg-cfh-accent hover:text-white"
          >
            {currentLanguage === "en" ? "AR" : "EN"}
          </button>

          {user ? (
            <>
              <a
                href="/create-pattern"
                className="text-gray-700 dark:text-gray-300 hover:text-cfh-accent"
              >
                {t("nav.create")}
              </a>
              <button
                onClick={logout}
                className="text-gray-700 dark:text-gray-300 hover:text-cfh-accent"
              >
                {t("auth.logout")}
              </button>
            </>
          ) : (
            <>
              <a
                href="/login"
                className="text-gray-700 dark:text-gray-300 hover:text-cfh-accent"
              >
                {t("nav.login")}
              </a>
              <a
                href="/register"
                className="text-gray-700 dark:text-gray-300 hover:text-cfh-accent"
              >
                {t("nav.register")}
              </a>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
