import { User } from "@prisma/client";

export interface IUserRepository{
  create(data: User): Promise<User>;
  selectOne(where: any): Promise<User | null>;
  update(data: User): Promise<User | null>;
  delete(conditions: any): any;
}