import { Prisma, PrismaClient, User } from "@prisma/client";
import { ICreateUser } from "../models/ICreateUser";
import { IUserRepository } from "./interfaces/user.repository.interface";

export class UserRepository implements IUserRepository {
  private repository: Prisma.UserDelegate<Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined> = new PrismaClient().user;

  async create(data: ICreateUser): Promise<User> {
    const createUser = await this.repository.create({data});
    return createUser;
  }

  async delete(conditions: any): Promise<User | null>{
    const deleteUser = await this.repository.delete(conditions);
    return deleteUser;
  }

  // async update(){
    
  // }

  // async selectOne(where: Prisma.UserWhereInput): Promise<User | null> {
  //   const searchUser = await this.repository.findFirst({
  //     where
  //   });
  //   return searchUser;
  // }

  async selectOne(conditions: any): Promise<User | null> {
    const searchUser = await this.repository.findFirst(conditions);
    return searchUser;
  }

  async selectAll(conditions: any): Promise<User[] | null> {
    const searchUser = await this.repository.findMany(conditions);
    return searchUser;
  }
}