import { Prisma, PrismaClient, User } from "@prisma/client";
import { ICreateUser } from "../models/ICreateUser";
import { IUserRepository } from "./interfaces/user.repository.interface";

export class UserRepository implements IUserRepository {
  private repository: Prisma.UserDelegate<Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined> = new PrismaClient().user;

  async create(data: ICreateUser): Promise<User> {
    const createUser = this.repository.create({data});
    return createUser;
  }

  // async delete(){
    
  // }

  // async update(){
    
  // }

  async selectOne(where: Prisma.UserWhereInput): Promise<User | null> {
    const searchUser = this.repository.findFirst({
      where
    });
    return searchUser;
  }
}