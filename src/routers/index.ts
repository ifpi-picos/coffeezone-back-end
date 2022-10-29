import { Router } from "express";
import routerUsers from "./user.route";
import routerAuth from "./auth.route";
import routerRelatory from "./relatory";
import routerAuthorization from "./authentication";
import routerReservation from "./reservation";
import statusRoom from "./statusRoom";

const router = Router();

router.use('/user', routerUsers);
router.use('/auth', routerAuth);
router.use('/relatory', routerRelatory);
router.use('/authorization', routerAuthorization);
router.use('/reservation', routerReservation);
router.use('/statusRoom', statusRoom);

export default router;