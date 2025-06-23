import { Router } from "express";

import { OrderController } from "../controllers/OrderController.js";
const router = Router();

router.post('/create', OrderController.create);
router.get('/getOrder/:id', OrderController.getOrder);
router.get('/getAll', OrderController.getAll);
export default router;