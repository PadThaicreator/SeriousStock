import { Router } from "express";
import { QuoteController } from "../controllers/QuoteController.js";
const router = Router()

// from database
router.get('/getall', QuoteController.getAll);
router.get('/get/:symbol', QuoteController.get);

// yahoo finance
router.get('/getDetail/:symbol', QuoteController.getDetail);
router.get('/getPrice/:symbol', QuoteController.getPrice);
router.get('/getDetailById/:id' , QuoteController.getDetailById);
export default router;