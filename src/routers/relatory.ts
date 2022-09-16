import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.json([]);
})

export default router;


/* 

relatório será apenas um histórico, o coordenador poderá ver a locação da sala em dias anteriores (até 1 mês)

*/