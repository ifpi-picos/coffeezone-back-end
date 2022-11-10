import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken';
import UserService from '../services/user.service';
import { UserRepository } from '../repositories';

export default function verifyToken(req: Request, res: Response, next: NextFunction){

  const userService = new UserService(new UserRepository);

  const token = req.cookies ? req.cookies.token : null;
  if(!token){
    return res.status(400).json('Token não enviado')
  }
  jwt.verify(token, `${process.env.JWT_KEY}`, async (error: any, decoded: any) => {
    if(error){
      res.status(400).json('Falha na autenticação')
    }
    res.locals.userId = decoded.id;
    const id = res.locals.userId;
    res.locals.user = await userService.searchById(id);
    next();
  })
}