import { UserRole } from "@/enums/UserRole.enum";

export interface Profile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}
