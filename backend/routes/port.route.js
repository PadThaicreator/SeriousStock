import { Router } from "express";
import { PortfolioController } from "../controllers/PortfolioController.js";

const router = Router();


router.post('/create', PortfolioController.create);


export default router;