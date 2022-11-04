import { Router,Request, Response } from 'express';
import AuthController from '../controllers/auth.controller';
import { genToken } from '../services/auth.service';

const router = Router();
const authController = new AuthController();

router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await authController.userExist(req.body.email);
    if(!user) throw new Error('Email ou senha incorreto(s).');
    const equalPassword = authController.verifyPasswordLogin(req.body.password, user);
    if(!equalPassword) throw new Error('Email ou senha incorreto(s).');
    const token = genToken(user);
    res.cookie('token', token, {maxAge: 604800000, httpOnly: true, sameSite: 'none', secure: true});
    res.status(200).json('Usuário logado com sucesso');
  } catch (error: any) {
    res.status(400).json(error.message);
  }
})

export default router;