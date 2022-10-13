import { Router, Request, Response } from 'express';
import UserController from '../controllers/user';
import {verifyInfosUser} from '../services/user';

const router = Router();
const userController = new UserController();

router.get('/', (req: Request, res: Response)=>{
  res.json({
    nome: 'wda',
    dado2: 'dw',
    dado3: 'dawdwa'
  });
})

router.get('/all', (req: Request, res: Response)=>{
  res.json({
    user1: {},
    user2: {},
    user3: {},
    user4: {}
  });
})

router.post('/', async (req: Request, res: Response) => {
  try{
    const verifyInfos = await verifyInfosUser(req.body);
    if(verifyInfos) {
      throw new Error(verifyInfos);
    }
    const createUser = await userController.create(req.body);
    res.status(201).json(createUser);
  } catch(error: any) {
    res.status(400).json(error.message);
  }
})

router.put('/', (req: Request, res: Response) => {
  res.json('usuario alterado');
})

router.delete('/', (req: Request, res: Response) => {
  res.json('usuario deletado');
})

export default router;