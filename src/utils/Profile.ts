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

export const FALLBACK_USERS: UserProfile[] = [
  { username: "dev", display_name: "Developer", image: "", logged_in: true },
  { username: "guest", display_name: "Guest User", image: "", logged_in: false },
];
