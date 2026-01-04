import { AuthStatus } from "@/enums/AuthStatus.enum";
import { SafeUser } from "@/types/user.types";

export interface RegisterPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
  ageVerified: boolean;
  profileFileId?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthSuccessResponse {
  user: SafeUser;
  token?: string;
}

export interface AuthErrorResponse {
  error: string;
  fieldErrors?: Record<string, string[]>;
}

export interface AuthState {
  user?: SafeUser;
  status: AuthStatus;
  error?: string;
}

export type AuthAction =
  | { type: "SET_USER"; payload?: SafeUser }
  | { type: "SET_STATUS"; payload: AuthStatus }
  | { type: "SET_ERROR"; payload?: string };

export interface AuthContextValue {
  state: AuthState;
  login: (payload: LoginPayload) => Promise<AuthResult>;
  register: (payload: RegisterPayload) => Promise<AuthResult>;
  logout: () => void;
  isAdmin: boolean;
  isAuthenticated: boolean;
}

export interface AuthResult {
  success: boolean;
  message?: string;
  user?: SafeUser;
  fieldErrors?: Record<string, string[]>;
}
