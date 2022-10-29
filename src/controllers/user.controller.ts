import { User } from '@prisma/client';
import validator from 'validator';
import bcrypt from 'bcrypt';
import { create, searchByCardId, searchByEmail } from '../services/user.service';
import { ICreateUser } from '../models/ICreateUser';

export default class UserController {

  async verifyInfosUser(body: ICreateUser): Promise<string | undefined> {
    const {name, email, password, card} = body;
    
    if(!name || name.length < 3) return 'Preencha o campo de nome corretamente';
    if(!password || password.length < 8) return 'Preencha o campo de senha corretamente';
    if(!email || !validator.isEmail(email)) return 'Preencha o campo de email corretamente';
    if(await searchByEmail(email)) return 'Esse email já está sendo usado';
    if(card && await searchByCardId(card)) return 'Esse id de cartão já está sendo usado';
  }
  
  encryptPassword (password: string): string {
    const passwordEncrypted = bcrypt.hashSync(password, 10)
    return passwordEncrypted;
  }

  async createUser(user: ICreateUser): Promise<User | undefined> {
    const userPasswordModify = user;
    userPasswordModify.password = this.encryptPassword(user.password);
    const createUser = await create(userPasswordModify);
    return createUser;
  }

}