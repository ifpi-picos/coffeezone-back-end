import { Role } from "@prisma/client";

export interface ICreateUser {
  card: string | null;
  email: string;
  name: string;
  password: string;
  role: Role;
  occupation: string | null;
  linkedin: string | null;
}