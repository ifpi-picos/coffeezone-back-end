import { Router, Request, Response } from 'express';
import UserController from '../controllers/user.controller';

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
    const verifyInfos = await userController.verifyInfosUser(req.body);
    if(verifyInfos) throw new Error(verifyInfos);
    const createUser = await userController.createUser(req.body);
    res.status(201).json('Usuário criado com sucesso!');
  } catch(error: any) {
    res.status(400).json(error.message);
  }
})

// router.post('/login', async (req: Request, res: Response) => {
//   try{
//     if(!req.body.email || !req.body.password) throw new Error('Informações faltando')
//     const searchByEmail = await userController.searchByEmail(req.body.email);
//     if(!searchByEmail) throw new Error('Email inválido');
//     if(searchByEmail.password !== req.body.password) throw new Error('Senha incorreta')
    
//   } catch(error: any) {
//     res.status(400).json(error.message);
//   }
// })

router.put('/', (req: Request, res: Response) => {
  res.json('usuario alterado');
})

router.delete('/', (req: Request, res: Response) => {
  res.json('usuario deletado');
})

export default router;