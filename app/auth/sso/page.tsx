"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";

const API_URL = process.env.NEXT_PUBLIC_ACCP_API_URL || "http://localhost:3002";

function sanitizeRedirect(redirect: string | null): string {
  if (!redirect) return "/";
  if (!redirect.startsWith("/") || redirect.startsWith("//")) return "/";
  return redirect;
}

function SSOCallbackInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { loginWithToken, isLoggedIn } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);
  const verifiedRef = useRef(false);

  useEffect(() => {
    if (verifiedRef.current) return;

    const ssoToken = searchParams.get("sso");
    const redirectTo = sanitizeRedirect(searchParams.get("redirect"));

    if (isLoggedIn && !ssoToken) {
      router.replace(redirectTo);
      return;
    }

    if (!ssoToken) {
      setError("ไม่พบข้อมูล SSO token");
      setIsVerifying(false);
      return;
    }

    verifiedRef.current = true;

    const verifySSO = async () => {
      try {
        const res = await fetch(`${API_URL}/auth/sso-verify`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ssoToken }),
        });

        const data = await res.json();

        if (data.success && data.token && data.user) {
          loginWithToken(data.user, data.token);
          router.replace(redirectTo);
        } else {
          verifiedRef.current = false;
          setError(data.error || "SSO verification failed");
        }
      } catch {
        verifiedRef.current = false;
        setError("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
      } finally {
        setIsVerifying(false);
      }
    };

    verifySSO();
  }, [searchParams, router, loginWithToken, isLoggedIn]);

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">กำลังเข้าสู่ระบบ...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center max-w-md">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
          <button
            onClick={() => router.push("/login")}
            className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
          >
            ไปยังหน้า Login
          </button>
        </div>
      </div>
    );
  }

  return null;
}

export default function SSOCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-600 dark:text-slate-400">กำลังเข้าสู่ระบบ...</p>
          </div>
        </div>
      }
    >
      <SSOCallbackInner />
    </Suspense>
  );
}
