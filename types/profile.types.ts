import { UserRole } from "@/enums/UserRole.enum";

export interface Profile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  phoneLocked?: boolean;
  profileFileId?: string;
  avatarUrl?: string;
  emailVerified?: boolean;
}
