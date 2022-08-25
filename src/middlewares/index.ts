import express from 'express';
import { verifyToken } from './verifyToken.middleware';

const router = express.Router()

router.use(verifyToken)

export default router