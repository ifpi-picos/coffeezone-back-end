import { User } from "@prisma/client";
import { ICreateUser } from "../models/ICreateUser";
import bcrypt from 'bcrypt';

export default class UserService {
  private userRepository: any;

  constructor(userRepository: any){
    this.userRepository = userRepository;
  }

  encryptPassword (password: string): string {
    const passwordEncrypted = bcrypt.hashSync(password, 10)
    return passwordEncrypted;
  }

  async create(user: ICreateUser): Promise<User | undefined> {
    const userPasswordModify = user;
    userPasswordModify.password = this.encryptPassword(user.password);
    const createUser = await this.userRepository.create(userPasswordModify);
    if(createUser) return createUser;
    throw new Error('Não foi possível se cadastrar!');
  }
  
  async searchByEmail(email: string): Promise<User | null> {
    const searchEmail = await this.userRepository.selectOne({email});
    return searchEmail;
  }
  
  async searchByCardId(card: string): Promise<User | null>{
    const searchCardId = await this.userRepository.selectOne({card});
    return searchCardId;
  }
}