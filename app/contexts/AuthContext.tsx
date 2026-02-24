"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface AuthUser {
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  licenseId?: string;
  university?: string;
  phone?: string;
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

  // Restore session on mount
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

  const login = useCallback(async (email: string, _password: string): Promise<boolean> => {
    // Simple demo auth — accept any non-empty email+password
    // Replace this with a real API call when ready
    if (!email || !_password) return false;

    const sessionUser: AuthUser = { 
      email, 
      name: email.split("@")[0] 
    };
    
    // Check if there's an existing registered user in local storage to pull more details?
    // For this simple demo, we just recreate the session
    
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
    document.cookie = `pharma-session=1; path=/; max-age=${60 * 60 * 24 * 7}`;
    setUser(sessionUser);
    return true;
  }, []);

  const register = useCallback(async (data: any): Promise<boolean> => {
    const { email, password, firstName, lastName, licenseId, university, phone } = data;
    if (!email || !password) return false;

    const sessionUser: AuthUser = {
      email,
      name: `${firstName} ${lastName}`,
      firstName,
      lastName,
      licenseId,
      university,
      phone
    };

    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
    document.cookie = `pharma-session=1; path=/; max-age=${60 * 60 * 24 * 7}`;
    setUser(sessionUser);
    return true;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    document.cookie = "pharma-session=; path=/; max-age=0";
    setUser(null);
    // Explicitly stay on current page or redirect to home if desired, but user requested "don't jump to login"
    // router.push("/"); // Optional: redirect to home. If not, just stay.
    // Given the request "don't bounce to login", simply clearing state is enough.
    // However, if on a protected route, middleware might bounce them. 
    // Assuming we are mostly public pages now.
    router.refresh(); // Refresh to update server components/middleware state if any
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
