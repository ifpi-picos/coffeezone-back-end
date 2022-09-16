import { Router } from "express";
import routerUsers from "./user";
import routerRelatory from "./relatory";
import routerAuthorization from "./authentication";
import routerReservation from "./reservation";
import statusRoom from "./statusRoom";

const router = Router();

router.use('/users', routerUsers);
router.use('/relatory', routerRelatory);
router.use('/authorization', routerAuthorization);
router.use('/reservation', routerReservation);
router.use('/statusRoom', statusRoom);

export default router;