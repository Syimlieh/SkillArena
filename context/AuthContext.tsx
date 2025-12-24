"use client";

import React, { createContext, useContext, useReducer, ReactNode, Dispatch } from "react";
import { User } from "@/types/user.types";
import { UserRole } from "@/enums/UserRole.enum";

type AuthState = {
  user?: User;
};

type AuthAction =
  | { type: "LOGIN"; payload: User }
  | { type: "LOGOUT" }
  | { type: "SET_ROLE"; payload: UserRole };

const initialAuthState: AuthState = {};

const AuthStateContext = createContext<AuthState | undefined>(undefined);
const AuthDispatchContext = createContext<Dispatch<AuthAction> | undefined>(undefined);

const reducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN":
      return { user: action.payload };
    case "LOGOUT":
      return {};
    case "SET_ROLE":
      return state.user ? { user: { ...state.user, role: action.payload } } : state;
    default:
      return state;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialAuthState);
  return (
    <AuthStateContext.Provider value={state}>
      <AuthDispatchContext.Provider value={dispatch}>{children}</AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  );
};

export const useAuthState = (): AuthState => {
  const ctx = useContext(AuthStateContext);
  if (!ctx) throw new Error("useAuthState must be used within AuthProvider");
  return ctx;
};

export const useAuthDispatch = (): Dispatch<AuthAction> => {
  const ctx = useContext(AuthDispatchContext);
  if (!ctx) throw new Error("useAuthDispatch must be used within AuthProvider");
  return ctx;
};
