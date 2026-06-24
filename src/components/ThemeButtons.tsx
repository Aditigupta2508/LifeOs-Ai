"use client";

import { useTheme } from "@/app/context/ThemeProvider";

export default function ThemeButtons() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex gap-2 p-4">
      <button
        onClick={() => setTheme("light")}
        className={`px-4 py-2 rounded ${
          theme === "light"
            ? "bg-yellow-400"
            : "bg-gray-300 dark:bg-gray-700"
        }`}
      >
        🌞 Light
      </button>

      <button
        onClick={() => setTheme("dark")}
        className={`px-4 py-2 rounded ${
          theme === "dark"
            ? "bg-black text-white"
            : "bg-gray-300 dark:bg-gray-700"
        }`}
      >
        🌙 Dark
      </button>
    </div>
  );
}