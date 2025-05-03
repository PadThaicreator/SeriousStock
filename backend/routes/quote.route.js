import { Router } from "express";
import { QuoteController } from "../controllers/QuoteController.js";
const router = Router()

router.get('/getall', QuoteController.getAll);
router.get('/get/:symbol', QuoteController.get);
router.get('/getDetail/:symbol', QuoteController.getDetail);
router.get('/getPrice/:symbol', QuoteController.getPrice);
export default router;