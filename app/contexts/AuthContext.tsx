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
  role?: string;
  delegateType?: string;
}

interface RegisterData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  thaiId?: string;
  licenseId?: string;
  organization?: string;
  university?: string;
  phone?: string;
  recaptchaToken?: string;
  eventCode?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isLoggedIn: boolean;
  login: (email: string, password: string, recaptchaToken?: string) => Promise<boolean>;
  loginWithToken: (user: AuthUser, token: string) => void;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const SESSION_KEY = "pharma-session";
const TOKEN_KEY = "pharma-token";
const ACCP_API_URL = process.env.NEXT_PUBLIC_ACCP_API_URL || "http://localhost:3002";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  // Restore session from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      const savedToken = localStorage.getItem(TOKEN_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as AuthUser;
        setUser(parsed);
      }
      if (savedToken) {
        setToken(savedToken);
      }
    } catch {
      localStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(TOKEN_KEY);
    }
  }, []);

  const login = useCallback(async (email: string, password: string, recaptchaToken?: string): Promise<boolean> => {
    if (!email || !password) return false;

    try {
      const res = await fetch(`${ACCP_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, recaptchaToken }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) return false;

      const sessionUser: AuthUser = {
        ...data.user,
        name: data.user.name || `${data.user.firstName || ""} ${data.user.lastName || ""}`.trim() || data.user.email,
        licenseId: data.user.pharmacyLicenseId || data.user.licenseId,
      };

      localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
      localStorage.setItem(TOKEN_KEY, data.token);
      document.cookie = `pharma-session=1; path=/; max-age=${60 * 60 * 24 * 7}`;
      setUser(sessionUser);
      setToken(data.token);
      return true;
    } catch (err) {
      console.error("[login]", err);
      return false;
    }
  }, []);

  // SSO login: receive user + JWT from accp-api via SSO verify
  const loginWithToken = useCallback((ssoUser: AuthUser, jwtToken: string) => {
    const sessionUser: AuthUser = {
      ...ssoUser,
      name: ssoUser.name || `${ssoUser.firstName || ""} ${ssoUser.lastName || ""}`.trim() || ssoUser.email,
      licenseId: (ssoUser as any).pharmacyLicenseId || ssoUser.licenseId,
    };

    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
    localStorage.setItem(TOKEN_KEY, jwtToken);
    document.cookie = `pharma-session=1; path=/; max-age=${60 * 60 * 24 * 7}`;
    setUser(sessionUser);
    setToken(jwtToken);
  }, []);

  const register = useCallback(async (data: RegisterData): Promise<boolean> => {
    const { email, password, firstName, lastName, thaiId, licenseId, organization, university, phone, recaptchaToken, eventCode } = data;
    if (!email || !password) return false;

    try {
      // Build multipart form data for accp-api /auth/register
      const fd = new FormData();
      fd.append("email", email);
      fd.append("password", password);
      fd.append("firstName", firstName || "");
      fd.append("lastName", lastName || "");
      fd.append("accountType", "pharmacist");
      fd.append("source", "newpharmacist");
      fd.append("country", "Thailand");
      if (thaiId) fd.append("idCard", thaiId);
      if (licenseId) fd.append("pharmacyLicenseId", licenseId);
      if (organization) fd.append("organization", organization);
      if (university) fd.append("university", university);
      if (phone) fd.append("phone", phone);
      if (recaptchaToken) fd.append("recaptchaToken", recaptchaToken);
      if (eventCode) fd.append("eventCode", eventCode);

      const res = await fetch(`${ACCP_API_URL}/auth/register`, {
        method: "POST",
        body: fd,
      });

      const resData = await res.json();

      if (!res.ok || !resData.success) {
        throw new Error(resData.error || "Registration failed");
      }

      // Use token returned directly from register (no separate login call needed)
      if (resData.token && resData.user) {
        const sessionUser: AuthUser = {
          ...resData.user,
          name: `${resData.user.firstName || ""} ${resData.user.lastName || ""}`.trim() || resData.user.email,
          licenseId: resData.user.pharmacyLicenseId || resData.user.licenseId,
        };
        localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
        localStorage.setItem(TOKEN_KEY, resData.token);
        document.cookie = `pharma-session=1; path=/; max-age=${60 * 60 * 24 * 7}`;
        setUser(sessionUser);
        setToken(resData.token);
        return true;
      }

      // Fallback: auto-login if API didn't return token
      const loginOk = await login(email, password);
      return loginOk;
    } catch (err) {
      console.error("[register]", err);
      throw err;
    }
  }, [login]);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(TOKEN_KEY);
    document.cookie = "pharma-session=; path=/; max-age=0";
    setUser(null);
    setToken(null);
    router.refresh();
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, token, isLoggedIn: !!user, login, loginWithToken, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
