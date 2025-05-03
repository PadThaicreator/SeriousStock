import { Router } from "express";
import { PortfolioController } from "../controllers/PortfolioController.js";

const router = Router();


router.post('/create', PortfolioController.create);
router.get('/quote/:portId', PortfolioController.getQuote);

export default router;