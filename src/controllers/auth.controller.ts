import { Request, Response } from 'express';
import UserService from '../services/user.service';
import { UserRepository } from '../repositories';
import { User } from '@prisma/client';
import AuthService from '../services/auth.service';

export default class AuthController {

  private userService = new UserService(new UserRepository);
  private authService = new AuthService();

  async executeLogin (req: Request, res: Response): Promise<void>{
    try {
      const user: User | null = await this.userService.searchByEmail(req.body.email);
      if(!user) throw new Error('Email ou senha incorreto(s).');
      const equalPassword = this.authService.verifyPasswordLogin(req.body.password, user);
      if(!equalPassword) throw new Error('Email ou senha incorreto(s).');
      const token = this.authService.genToken(user);
      res.cookie('token', token, {
        maxAge: 604800000, 
        httpOnly: true, 
        sameSite: 'none', 
        secure: process.env.COOKIE_SECURE === "true"
      });
      // res.status(200).json('Usuário logado com sucesso');
      const {name, card, role} = user;
      res.status(200).json({name, card, role});
    } catch (error: any) {
      res.status(400).json(error.message);
    }
  }

}