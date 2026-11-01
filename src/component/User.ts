import { useMemo } from "react";

export interface UserProfile {
  background?: string;
  display_name?: string;
  home_directory?: string;
  image?: string;
  language?: string;
  layout?: string;
  logged_in?: boolean;
  session?: string;
  username?: string;
}

const FALLBACK_USERS: UserProfile[] = [
  {
    username: "dev",
    display_name: "Developer",
    image: "",
    logged_in: true,
  },
  {
    username: "guest",
    display_name: "Guest User",
    image: "",
    logged_in: false,
  },
];

export function useLightDMUsers(): UserProfile[] {
  return useMemo(() => {
    const ldm = typeof window !== "undefined" ? (window as any).lightdm : undefined;
    if (ldm?.users && Array.isArray(ldm.users) && ldm.users.length > 0) {
      return ldm.users as UserProfile[];
    }
    return FALLBACK_USERS;
  }, []);
}
