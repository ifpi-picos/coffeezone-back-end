import { Request, Response } from 'express';
import validator from 'validator';
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

  //_____________//

  async executePost (req: Request, res: Response): Promise<void>{
    try{
      const verifyInfos = await this.verifyInfosUser(req.body);
      if(verifyInfos) throw new Error(verifyInfos);
      const createUser = await create(req.body);
      res.status(201).json('Usuário criado com sucesso!');
    } catch(error: any) {
      res.status(400).json(error.message);
    }
  }
  
}