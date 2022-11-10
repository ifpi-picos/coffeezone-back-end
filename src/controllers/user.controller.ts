import { Request, Response } from 'express';
import validator from 'validator';
import UserService from '../services/user.service';
import { UserRepository } from '../repositories';
import { ICreateUser } from '../models/ICreateUser';

export default class UserController {

  private userService = new UserService(new UserRepository);

  async verifyInfosUser(body: ICreateUser): Promise<string | undefined> {
    const {name, email, password, card} = body;
    
    if(!name || name.length < 3) return 'Preencha o campo de nome corretamente';
    if(!password || password.length < 8) return 'Preencha o campo de senha corretamente';
    if(!email || !validator.isEmail(email)) return 'Preencha o campo de email corretamente';
    if(await this.userService.searchByEmail(email)) return 'Esse email já está sendo usado';
    if(card && await this.userService.searchByCardId(card)) return 'Esse id de cartão já está sendo usado';
  }



  async executePost (req: Request, res: Response): Promise<void>{
    try{
      const verifyInfos = await this.verifyInfosUser(req.body);
      if(verifyInfos) throw new Error(verifyInfos);
      const createUser = await this.userService.create(req.body);
      res.status(201).json('Usuário criado com sucesso!');
    } catch(error: any) {
      res.status(400).json(error.message);
    }
  }

  async executeGetUser (req: Request, res: Response): Promise<void>{
    try {
      const user = await this.userService.searchById(res.locals.userId)
      if(!user) throw new Error('Usuário não encontrado');
      res.status(200).json(user);
    } catch (error: any) {
      res.status(400).json(error.message);
    }
  }

  async executeGetAllUsers (req: Request, res: Response): Promise<void>{
    try {
      const users = await this.userService.searchAllUsers();
      res.status(200).json(users);
    } catch (error: any) {
      res.status(400).json(error.message);
    }
  }

  async executeDeleteUser (req: Request, res: Response): Promise<void>{
    try {
      const user = await this.userService.searchById(res.locals.userId)
      if(!user) throw new Error('Usuário não encontrado');
      const deleteUser = await this.userService.delete(res.locals.userId);
      res.status(200).json('Usuário deletado com sucesso');
    } catch (error: any) {
      res.status(400).json(error.message);
    }
  }
}