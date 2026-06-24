"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark" | "auto";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("auto");

  // load saved theme
  useEffect(() => {
    const saved = localStorage.getItem("theme") as Theme;
    if (saved) setTheme(saved);
  }, []);

  // apply theme
  useEffect(() => {
    const root = document.documentElement;

    function apply(t: Theme) {
      let finalTheme = t;

      if (t === "auto") {
        const hour = new Date().getHours();
        finalTheme = hour >= 18 || hour < 6 ? "dark" : "light";
      }

      root.classList.remove("light", "dark");
      root.classList.add(finalTheme);
    }

    apply(theme);

    const interval = setInterval(() => apply(theme), 60000); // auto update hourly

    localStorage.setItem("theme", theme);

    return () => clearInterval(interval);
  }, [theme]);

  return { theme, setTheme };
}