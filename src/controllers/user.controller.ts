import { User, Role } from '@prisma/client';
import validator from 'validator';
import { create, searchByCardId, searchByEmail } from '../services/user.service';

export default class UserController {

  async verifyInfosUser(body: any){
    const {name, email, password, role, card} = body;
    
    if(!name || name.length < 3) return 'Preencha o campo de nome corretamente';
    if(!password || password.length < 8) return 'Preencha o campo de senha corretamente';
    if(!email || !validator.isEmail(email)) return 'Preencha o campo de email corretamente';
    if(role !== Role) return 'Utilize o tipo de usuário correto';
    if(await searchByEmail(email)) return 'Esse email já está sendo usado';
    if(card && await searchByCardId(card)) return 'Esse id de cartão já está sendo usado';
  }

  async createUser(user: User){
    return await create(user);
  }

}