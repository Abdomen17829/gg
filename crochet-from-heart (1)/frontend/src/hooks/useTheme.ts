import { useState, useEffect } from "react";

export const useTheme = () => {
  const [theme, setTheme] = useState(
    localStorage.getItem("cfh_theme") || "light"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("cfh_theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return { theme, toggleTheme };
};
