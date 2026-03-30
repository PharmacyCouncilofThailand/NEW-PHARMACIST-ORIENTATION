"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

const API_URL = process.env.NEXT_PUBLIC_ACCP_API_URL || "http://localhost:3002";
const EVENT_CODE = process.env.NEXT_PUBLIC_ORIENTATION_EVENT_CODE || "NPHA-2026";

interface RegistrationStatus {
  isRegistered: boolean;
  loading: boolean;
  regCode: string | null;
}

export function useRegistrationStatus(): RegistrationStatus {
  const { isLoggedIn, token } = useAuth();
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [regCode, setRegCode] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoggedIn || !token) {
      setIsRegistered(false);
      setRegCode(null);
      return;
    }

    let cancelled = false;

    async function check() {
      setLoading(true);
      try {
        // 1. Get event numeric ID from event code
        const eventRes = await fetch(`${API_URL}/api/events/${EVENT_CODE}`);
        const eventData = await eventRes.json();

        if (!eventRes.ok || !eventData.event?.id) {
          setIsRegistered(false);
          return;
        }

        const eventId = eventData.event.id;

        // 2. Check registration status from registrations table directly
        const regRes = await fetch(`${API_URL}/api/registrations/check?eventId=${eventId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const regData = await regRes.json();

        if (!cancelled && regData.success) {
          setIsRegistered(!!regData.isRegistered);
          setRegCode(regData.regCode || null);
        }
      } catch (err) {
        console.error("[useRegistrationStatus]", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    check();
    return () => { cancelled = true; };
  }, [isLoggedIn, token]);

  return { isRegistered, loading, regCode };
}
