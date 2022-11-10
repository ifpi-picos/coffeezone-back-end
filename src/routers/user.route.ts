import { Router, Request, Response } from 'express';
import UserController from '../controllers/user.controller';
import authToken from '../middleware/auth.middleware';
import authUserType from '../middleware/authUserType.middleware';

const router = Router();
const userController = new UserController();

router.get('/', authToken, (req: Request, res: Response)=>{
  userController.executeGetUser(req, res);
})

router.get('/all', authToken, authUserType(['Coordinator']), (req: Request, res: Response)=>{
  userController.executeGetAllUsers(req, res);
})

router.post('/', async (req: Request, res: Response): Promise<void> => {
  userController.executePost(req, res);
})

router.put('/', authToken, (req: Request, res: Response) => {
  userController.executeUpdateUser(req, res);
})

router.delete('/', authToken, (req: Request, res: Response) => {
  userController.executeDeleteUser(req, res);
})

export default router;