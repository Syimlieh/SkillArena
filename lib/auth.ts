const REDIRECT_KEY = "post_login_redirect";

export const rememberPostLoginRedirect = (url: string) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(REDIRECT_KEY, url);
  } catch {
    // ignore storage failures
  }
};

export const consumePostLoginRedirect = (): string | null => {
  if (typeof window === "undefined") return null;
  try {
    const value = localStorage.getItem(REDIRECT_KEY);
    if (value) {
      localStorage.removeItem(REDIRECT_KEY);
      return value;
    }
  } catch {
    return null;
  }
  return null;
};

// Server-only helpers live in lib/auth.server.ts; import directly where needed.
