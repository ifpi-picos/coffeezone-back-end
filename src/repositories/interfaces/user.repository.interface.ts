import { User } from "@prisma/client";

export interface IUserRepository{
  create(data: User): Promise<User>;
  // selectOne(where): Promise<User | null>;
  // update(): ;
  // delete(): ;
}