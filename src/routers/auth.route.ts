import { Router,Request, Response } from 'express';
import AuthController from '../controllers/auth.controller';

const router = Router();
const authController = new AuthController();

router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await authController.userExist(req.body.email);
    if(!user) throw new Error('Email ou senha incorreto(s).');
    const equalPassword = authController.verifyPasswordLogin(req.body.password, user);
    if(!equalPassword) throw new Error('Email ou senha incorreto(s).');
    const token = authController.genToken(user);
    res.status(200).json(token);
  } catch (error: any) {
    res.status(400).json(error.message);
  }
})

export default router;