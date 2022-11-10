import { NextFunction, Request, Response } from 'express'

export default function authUserType(authorizedTypes: string[]){
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if(!authorizedTypes.includes(res.locals.user.role)){
        throw new Error('Permissão negada')
      }
      next();
    } catch (error: any) {
      res.status(403).json(error.message)
    } 
  }
}