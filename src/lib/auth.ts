import type { AuthUser, UserRole } from "@/types";

const SESSION_KEY = "jb_session";

/**
 * Session (token + user) lives in a plain (non-httpOnly) cookie so client
 * components can attach the token as a Bearer header when calling the
 * FastAPI backend directly. This trades some XSS surface for a much simpler
 * client-side data flow. Hardening path: proxy authenticated calls through
 * Next.js Route Handlers that hold the token in an httpOnly cookie instead —
 * see README "Known gaps".
 */
export function setSession(token: string, user: AuthUser) {
  const maxAge = 60 * 60 * 8; // 8h, matches typical backend token expiry
  const value = encodeURIComponent(JSON.stringify({ token, user }));
  document.cookie = `${SESSION_KEY}=${value}; path=/; max-age=${maxAge}; SameSite=Lax`;
  // Lightweight role-only cookie so middleware (edge, no JSON parsing needed) can guard routes.
  document.cookie = `jb_role=${user.role}; path=/; max-age=${maxAge}; SameSite=Lax`;
  document.cookie = `jb_token=${token}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function clearSession() {
  document.cookie = `${SESSION_KEY}=; path=/; max-age=0`;
  document.cookie = `jb_role=; path=/; max-age=0`;
  document.cookie = `jb_token=; path=/; max-age=0`;
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function getSession(): { token: string; user: AuthUser } | null {
  const raw = getCookie(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function getToken(): string | null {
  return getCookie("jb_token");
}

export function getRole(): UserRole | null {
  return getCookie("jb_role") as UserRole | null;
}

export function decodeJwtSub(token: string): number | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.sub ? Number(payload.sub) : null;
  } catch {
    return null;
  }
}
