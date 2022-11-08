import { Router, Request, Response } from 'express';
import AuthController from '../controllers/auth.controller';
import auth from '../middleware/auth.middleware';

const router = Router();
const authController = new AuthController();

router.post('/', async (req: Request, res: Response): Promise<void> => {
  authController.executePost(req, res);
})

export default router;