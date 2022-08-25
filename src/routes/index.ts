import { Router } from 'express'
import authRoute from './auth.route'
import userRoute from './user.route'
import authorizationRoute from './authorization.route'
import reservationRoute from './reservation.route'
import equipmentRoute from './equipment.route'
import relatoryRoute from './relatory.route'

const router = Router()

router.use('/auth', authRoute)
router.use('/user', userRoute)
router.use('/reservation', reservationRoute)
router.use('/authorization', authorizationRoute)
router.use('/equipment', equipmentRoute)
router.use('/relatory', relatoryRoute)

export default router