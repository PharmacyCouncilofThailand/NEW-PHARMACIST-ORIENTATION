"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
  isDark: false,
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("pharma-theme") as Theme | null;
    if (saved) setTheme(saved);
    setMounted(true);
  }, []);

  // Apply to <html>
  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    localStorage.setItem("pharma-theme", theme);
  }, [theme, mounted]);

  // Memoize toggleTheme to prevent new function reference on every render
  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  // Memoize context value to prevent re-renders of all consumers
  const value = useMemo<ThemeContextType>(
    () => ({ theme, toggleTheme, isDark: theme === "dark" }),
    [theme, toggleTheme]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
