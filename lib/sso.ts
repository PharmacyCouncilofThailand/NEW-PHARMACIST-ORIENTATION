const API_URL = process.env.NEXT_PUBLIC_ACCP_API_URL || "http://localhost:3002";
const CONFERENCE_WEB_URL = process.env.NEXT_PUBLIC_CONFERENCE_WEB_URL || "http://localhost:3003";

/**
 * Generate OTT via accp-api and redirect to conference-web with SSO
 * ใช้เมื่อ user ต้องการไปหน้า conference-web (เช่น checkout, events)
 */
export async function ssoRedirectToConferenceWeb(
  token: string,
  redirectPath: string = "/events"
): Promise<void> {
  if (!token) {
    window.location.href = CONFERENCE_WEB_URL + redirectPath;
    return;
  }

  try {
    const res = await fetch(`${API_URL}/auth/sso-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Source-App": "newpharmacist",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ targetApp: "conference-web" }),
    });

    const data = await res.json();

    if (data.success && data.ssoToken) {
      const redirect = encodeURIComponent(redirectPath);
      const targetUrl = data.targetUrl || CONFERENCE_WEB_URL;
      window.location.href = `${targetUrl}/auth/sso?sso=${data.ssoToken}&redirect=${redirect}`;
      return;
    }
  } catch (error) {
    console.error("[SSO] Failed to generate SSO token:", error);
  }

  // Fallback: redirect without SSO
  window.location.href = CONFERENCE_WEB_URL + redirectPath;
}

/**
 * Generate OTT via accp-api and redirect to a specific event website
 * ใช้เมื่อ event มี websiteUrl ของตัวเอง
 */
export async function ssoRedirectToEventWebsite(
  token: string,
  eventId: number,
  redirectPath: string = "/"
): Promise<void> {
  if (!token) {
    window.location.href = CONFERENCE_WEB_URL + redirectPath;
    return;
  }

  try {
    const res = await fetch(`${API_URL}/auth/sso-token?eventId=${eventId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Source-App": "newpharmacist",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({}),
    });

    const data = await res.json();

    if (data.success && data.ssoToken && data.targetUrl) {
      const redirect = encodeURIComponent(redirectPath);
      window.location.href = `${data.targetUrl}/auth/sso?sso=${data.ssoToken}&redirect=${redirect}`;
      return;
    }
  } catch (error) {
    console.error("[SSO] Failed to generate SSO token:", error);
  }

  // Fallback
  window.location.href = CONFERENCE_WEB_URL + redirectPath;
}
