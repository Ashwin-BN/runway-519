"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState("system");

  useEffect(() => {
    // Initialize theme from localStorage or system
    const stored = typeof window !== "undefined" && localStorage.getItem("theme");
    if (stored) {
      setTheme(stored);
      applyTheme(stored);
    } else {
      const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(prefersDark ? "dark" : "light");
      applyTheme(prefersDark ? "dark" : "light");
    }
  }, []);

  const applyTheme = (value) => {
    const html = document.documentElement;
    if (value === "dark") {
      html.classList.add("dark");
    } else if (value === "light") {
      html.classList.remove("dark");
    } else {
      // system: remove explicit class to allow prefers-color-scheme to apply
      html.classList.remove("dark");
    }
  };

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    applyTheme(next);
  };

  return (
    <button
      aria-label={`Toggle color theme (current: ${theme})`}
      aria-pressed={theme === "dark"}
      onClick={toggle}
      className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 bg-slate-100 dark:bg-slate-700"
      title="Toggle theme"
    >
      {theme === "dark" ? (
        <svg className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 24 24">
          <path d="M21.752 15.002A9 9 0 118.998 2.248 7 7 0 0021.752 15z" />
        </svg>
      ) : (
        <svg className="w-5 h-5 text-slate-800" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 3v2M12 19v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      )}
    </button>
  );
}
