"use client";

import React, { createContext, useContext, useReducer, ReactNode, useCallback } from "react";
import { AuthStatus } from "@/enums/AuthStatus.enum";
import { API_ROUTES } from "@/lib/constants";
import {
  AuthAction,
  AuthContextValue,
  AuthResult,
  AuthState,
  LoginPayload,
  RegisterPayload,
} from "@/types/auth.types";

const initialAuthState: AuthState = {
  status: AuthStatus.UNAUTHENTICATED,
};

const reducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload, status: action.payload ? AuthStatus.AUTHENTICATED : AuthStatus.UNAUTHENTICATED };
    case "SET_STATUS":
      return { ...state, status: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const performAuthRequest = async (
  endpoint: string,
  payload: LoginPayload | RegisterPayload
): Promise<{ success: boolean; message?: string; user?: AuthState["user"]; fieldErrors?: Record<string, string[]> }> => {
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({}));
    if (data?.success === false) {
      const message =
        typeof data?.error?.message === "string"
          ? data.error.message
          : typeof data?.error === "string"
            ? data.error
            : "Unable to complete authentication request";
      return { success: false, message, fieldErrors: data?.error?.fieldErrors };
    }
    if (!response.ok) {
      const message = typeof data?.error === "string" ? data.error : "Unable to complete authentication request";
      return { success: false, message };
    }

    const user = data?.data?.user ?? data?.user;
    return { success: true, user, message: "Authenticated" };
  } catch {
    return { success: false, message: "Network error. Please try again." };
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialAuthState);

  const login = useCallback(
    async (payload: LoginPayload): Promise<AuthResult> => {
      dispatch({ type: "SET_STATUS", payload: AuthStatus.LOADING });
      dispatch({ type: "SET_ERROR", payload: undefined });
      const result = await performAuthRequest(API_ROUTES.authLogin, payload);
      if (!result.success || !result.user) {
        dispatch({ type: "SET_STATUS", payload: AuthStatus.UNAUTHENTICATED });
        dispatch({ type: "SET_ERROR", payload: result.message });
        return { success: false, message: result.message, fieldErrors: result.fieldErrors };
      }
      dispatch({ type: "SET_USER", payload: result.user });
      dispatch({ type: "SET_STATUS", payload: AuthStatus.AUTHENTICATED });
      return { success: true, message: "Logged in" };
    },
    []
  );

  const register = useCallback(
    async (payload: RegisterPayload): Promise<AuthResult> => {
      dispatch({ type: "SET_STATUS", payload: AuthStatus.LOADING });
      dispatch({ type: "SET_ERROR", payload: undefined });
      const result = await performAuthRequest(API_ROUTES.authRegister, payload);
      if (!result.success || !result.user) {
        dispatch({ type: "SET_STATUS", payload: AuthStatus.UNAUTHENTICATED });
        dispatch({ type: "SET_ERROR", payload: result.message });
        return { success: false, message: result.message, fieldErrors: result.fieldErrors };
      }
      dispatch({ type: "SET_USER", payload: result.user });
      dispatch({ type: "SET_STATUS", payload: AuthStatus.AUTHENTICATED });
      return { success: true, message: "Registered" };
    },
    []
  );

  const logout = useCallback(() => {
    dispatch({ type: "SET_USER", payload: undefined });
    dispatch({ type: "SET_STATUS", payload: AuthStatus.UNAUTHENTICATED });
  }, []);

  const value: AuthContextValue = {
    state,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
