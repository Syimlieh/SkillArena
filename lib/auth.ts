const POST_LOGIN_REDIRECT_KEY = "postLoginRedirect";

export const rememberPostLoginRedirect = (path: string) => {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(POST_LOGIN_REDIRECT_KEY, path);
};

export const consumePostLoginRedirect = (): string | null => {
  if (typeof window === "undefined") return null;
  const value = sessionStorage.getItem(POST_LOGIN_REDIRECT_KEY);
  if (value) {
    sessionStorage.removeItem(POST_LOGIN_REDIRECT_KEY);
  }
  return value;
};
