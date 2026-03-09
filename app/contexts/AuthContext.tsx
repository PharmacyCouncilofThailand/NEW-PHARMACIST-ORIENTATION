"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface AuthUser {
  id?: number;
  email: string;
  firstName?: string;
  lastName?: string;
  thaiId?: string;
  licenseId?: string;
  organization?: string;
  university?: string;
  phone?: string;
  name?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: any) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const SESSION_KEY = "pharma-session";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const router = useRouter();

  // Restore session from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as AuthUser;
        setUser(parsed);
      }
    } catch {
      localStorage.removeItem(SESSION_KEY);
    }
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    if (!email || !password) return false;

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) return false;

      const { user: dbUser } = await res.json();
      const sessionUser: AuthUser = {
        ...dbUser,
        name: `${dbUser.firstName} ${dbUser.lastName}`,
      };

      localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
      document.cookie = `pharma-session=1; path=/; max-age=${60 * 60 * 24 * 7}`;
      setUser(sessionUser);
      return true;
    } catch (err) {
      console.error("[login]", err);
      return false;
    }
  }, []);

  const register = useCallback(async (data: any): Promise<boolean> => {
    const { email, password, firstName, lastName, thaiId, licenseId, organization, university, phone } = data;
    if (!email || !password) return false;

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, firstName, lastName, thaiId, licenseId, organization, university, phone }),
      });

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error);
      }

      const { user: dbUser } = await res.json();
      const sessionUser: AuthUser = {
        ...dbUser,
        name: `${dbUser.firstName} ${dbUser.lastName}`,
      };

      localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
      document.cookie = `pharma-session=1; path=/; max-age=${60 * 60 * 24 * 7}`;
      setUser(sessionUser);
      return true;
    } catch (err) {
      console.error("[register]", err);
      // Re-throw so the register page can display the exact error message
      throw err;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    document.cookie = "pharma-session=; path=/; max-age=0";
    setUser(null);
    router.refresh();
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
