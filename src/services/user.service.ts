import { UserRepository } from "../repositories";
import { User } from "@prisma/client";

const userRepository = new UserRepository();

export async function create(user: User){
  const {name, email, password, role, card} = user;

  const createUser = await userRepository.create(user);
  if(createUser) return createUser;
  throw new Error('Não foi possível se cadastrar!');
}

export async function searchByEmail(email: string){
  const searchEmail = await userRepository.selectOne({email});
  return searchEmail;
}

export async function searchByCardId(card: string){
  const searchCardId = await userRepository.selectOne({card});
  return searchCardId;
}