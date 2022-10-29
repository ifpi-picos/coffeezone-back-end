import { UserRepository } from "../repositories";
import { User } from "@prisma/client";
import { ICreateUser } from "../models/ICreateUser";

const userRepository = new UserRepository();

export async function create(user: ICreateUser): Promise<User | undefined> {
  const createUser = await userRepository.create(user);
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