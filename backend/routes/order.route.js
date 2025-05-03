import { Router } from "express";

import { OrderController } from "../controllers/OrderController.js";
const router = Router();

router.post('/create', OrderController.create);


export default router;