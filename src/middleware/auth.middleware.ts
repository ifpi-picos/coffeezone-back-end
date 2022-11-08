import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken';

export default function verifyToken(req: Request, res: Response, next: NextFunction){
  const token = req.cookies ? req.cookies.token : null;
  if(!token){
    return res.status(400).json('Token não enviado')
  }
  jwt.verify(token, `${process.env.JWT_KEY}`, (error: any, decoded: any) => {
    if(error){
      res.status(400).json('Falha na autenticação')
    }
    res.locals.userId = decoded.id;
    next();
  })
}