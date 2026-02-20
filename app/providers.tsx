"use client";

import { ThemeProvider } from "./contexts/ThemeContext";
import { LangProvider } from "./contexts/LangContext";
import { AuthProvider } from "./contexts/AuthContext";
import SmoothScroll from "./components/ui/SmoothScroll";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <LangProvider>
        <AuthProvider>
          <SmoothScroll>
            {children}
          </SmoothScroll>
        </AuthProvider>
      </LangProvider>
    </ThemeProvider>
  );
}


