import { prisma } from '../config/database';
import { Router, Request, Response } from 'express';

const router = Router();

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

async function verifyDuplicateEmail(email: string){
  const emailUsed = await prisma.user.findUnique({
    where: {
      email
    }
  })
  return emailUsed;
}

async function verifyDuplicateCard(card: string){
  const cardUsed = await prisma.user.findUnique({
    where: {
      card
    }
  })
  return cardUsed;
}

router.post('/', async (req: Request, res: Response) => {
  const {name, email, password, role, card} = req.body;
  try{
    if(!name || name.length < 3) throw new Error('Preencha o campo de nome corretamente');
    if(!password || password.length < 8) throw new Error('Preencha o campo de senha corretamente');
    if(!email || !email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/g)) throw new Error('Preencha o campo de email corretamente');
    if(await verifyDuplicateEmail(email)) throw new Error('Esse email já está sendo usado');
    if(card && await verifyDuplicateCard(card)) throw new Error('Esse id de cartão já está sendo usado');

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
        role,
        card
      }
    })
    res.status(201).json(user);
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