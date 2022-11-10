import { NextFunction, Request, Response } from 'express'

export default function authUserType(type: string){
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if(res.locals.user.role !== 'Coordinator'){
        throw new Error('Permissão negada')
      }
      next();
    } catch (error: any) {
      res.status(400).json(error.message)
    } 
  }
}