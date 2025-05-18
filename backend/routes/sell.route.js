import { Router } from "express";
import { SellController } from "../controllers/SellController.js";
const router = Router()

router.post('/create', SellController.create);

export default router;