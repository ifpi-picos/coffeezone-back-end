import { Router, Request, Response } from 'express';

const router = Router();

router.post('/login', (req: Request, res: Response) => {
  res.json('usuario logado');
})

router.post('/recoverPassword', (req: Request, res: Response) => {
  res.json('senha recuperada');
})

export default router;