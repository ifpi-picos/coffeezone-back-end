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

  async delete(id: number): Promise<User | null>{
    const deleteUser = await this.userRepository.delete({
      where: {
        id
      }
    });
    return deleteUser;
  }

  async update(email: string, data: any): Promise<User | null> {
    const updateUser = await this.userRepository.update({
      where: {
        email
      },
      data
    })
    return updateUser;
  }
  
  async searchByEmail(email: string): Promise<User | null> {
    const searchEmail = await this.userRepository.selectOne({
      where: {
        email
      }
    });
    return searchEmail;
  }
  
  async searchByCardId(card: string): Promise<User | null>{
    const searchCardId = await this.userRepository.selectOne({
      where: {
        card
      }
    });
    return searchCardId;
  }

  async searchById(id: number): Promise<User | null>{
    const searchId = await this.userRepository.selectOne({
      where: {
        id
      }, 
      select: {
        card: true,
        email: true,
        name: true,
        role: true,
        occupation: true,
        linkedin: true,
        create_at: true
      }
    });
    return searchId;
  }

  async searchAllUsers(): Promise<any>{
    const users = await this.userRepository.selectAll({
      select: {
        card: true,
        email: true,
        name: true,
        role: true,
        occupation: true,
        linkedin: true,
        create_at: true
      }
    });
    return users;
  }
}