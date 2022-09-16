import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.json('suas reservas');
})

router.post('/', (req: Request, res: Response) => {
  res.json('reserva feita');
})

router.put('/', (req: Request, res: Response) => {
  res.json('reserva alterada');
})

router.delete('/', (req: Request, res: Response) => {
  res.json('reserva deletada');
})

router.get('/all', (req: Request, res: Response) => {
  res.json('todas reservas');
})

router.post('/authorize', (req: Request, res: Response) => {
  res.json('reserva julgada');
})

export default router;

/* 

vist
  criar 
  alterar
  deletar
  ver (todas as reservas dele) 

coord
  ver (todas)
  autorizar

*/