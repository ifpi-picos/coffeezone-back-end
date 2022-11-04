import { UserRepository } from "../repositories";
import { User } from "@prisma/client";
import { ICreateUser } from "../models/ICreateUser";
import { encryptPassword } from './auth.service';

const userRepository = new UserRepository();

export async function create(user: ICreateUser): Promise<User | undefined> {
  const userPasswordModify = user;
  userPasswordModify.password = encryptPassword(user.password);
  const createUser = await userRepository.create(userPasswordModify);
  if(createUser) return createUser;
  throw new Error('Não foi possível se cadastrar!');
}

export async function searchByEmail(email: string): Promise<User | null> {
  const searchEmail = await userRepository.selectOne({email});
  return searchEmail;
}

export async function searchByCardId(card: string): Promise<User | null>{
  const searchCardId = await userRepository.selectOne({card});
  return searchCardId;
}