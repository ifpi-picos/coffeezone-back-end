import { Router } from 'express';
import prisma from '../config/database'
import UserController from '../controllers/user.controller'
import AuthServices from '../services/auth.services';
import UserServices from '../services/user.services';
import mailer from '../utils/mailer'

const router = Router()
const userController = new UserController(prisma)
const userServices = new UserServices(UserController)
const authServices = new AuthServices()

router.post('/login', async (req, res) => {
    try {
        if (req.body.password && req.body.email) {
            let user = await userController.getByEmail(req.body.email)

            if (user) {
                if (authServices.comparePassword(req.body.password, user.password)) {
                    const token = authServices.createToken(user)

                    res.status(200).json({ token: token })
                }
                else {
                    res.status(401).json({ error: 'Senha incorreta' })
                }
            }
            else {
                res.status(404).json({ error: 'Usuário não encontrado' })
            }
        }
        else {
            res.status(400).json({ error: 'Dados faltando ou incorretos' })
        }
    }
    catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Erro ao tentar autenticar' })
    }
});

router.post('/recovery', async (req, res) => {
    try {
        if (req.body.email && !req.body.token) {
            let user = await userController.getByEmail(req.body.email)

            if (user) {
                const token = authServices.createRecoveryToken(user)
                const mailInfo = await mailer.sendRecoveryEmail(user, token)

                if (mailInfo.accepted.includes(user.email)) {
                    res.status(200).json({ success: 'Email enviado com sucesso' })
                }
                else {
                    res.status(400).json({ error: 'Email enviado mas não aceito pelo usuário' })
                }
            }
            else {
                res.status(404).json({ error: 'Usuário não encontrado' })
            }
        }
        else if (req.body.token && !req.body.email) {
            let token = authServices.verifyToken(req.body.token)

            if (req.body.password) {
                if (token != false) {
                    const user = await userController.getById(token.id)

                    if (user) {
                        const newPassword = userServices.hashPassword(req.body.password)

                        await userController.updateFieldById(user.id, 'password', newPassword)

                        res.status(200).json({ success: 'Senha alterada com sucesso' })
                    }
                    else {
                        res.status(404).json({ error: 'Usuário não encontrado' })
                    }
                }
            }
            else {
                res.status(400).json({ error: 'Nova senha não encontrada' })
            }
        }
        else {
            res.status(400).json({ error: 'Dados faltando ou incorretos' })
        }
    }
    catch (err) {
        if (err.name = 'TokenExpiredError') {
            res.status(401).json({ error: 'Token expirado' })
        }
        else if (err.name = 'JsonWebTokenError') {
            res.status(401).json({ error: 'Token inválido' })
        }
        else {
            console.error(err)
            res.status(500).json({ error: 'Erro ao tentar enviar email de recuperação' })
        }
    }
})

export default router