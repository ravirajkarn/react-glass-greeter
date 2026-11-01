import { useMemo } from "react";
import { type UserProfile, FALLBACK_USERS } from "../utils/Profile";

export function useLightDMUsers(): UserProfile[] {
  return useMemo(() => {
    const ldm = typeof window !== "undefined" ? (window as any).lightdm : undefined;
    if (ldm?.users && Array.isArray(ldm.users) && ldm.users.length > 0) {
      return ldm.users as UserProfile[];
    }
    return FALLBACK_USERS;
  }, []);
}
