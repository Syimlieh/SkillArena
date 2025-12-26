import { Profile } from "@/types/profile.types";
import { API_ROUTES } from "@/lib/constants";

export const fetchProfile = async (): Promise<Profile | null> => {
  try {
    const res = await fetch(API_ROUTES.profile ?? "/api/profile", { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.profile ?? data?.data?.profile ?? null;
  } catch {
    return null;
  }
};
