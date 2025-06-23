import { Router } from "express";
import { SellController } from "../controllers/SellController.js";
const router = Router()

router.post('/create', SellController.create);
router.get('/getSellOrder/:id', SellController.getSellOrder);
export default router;