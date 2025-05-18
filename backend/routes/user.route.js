import { Router } from "express";
import { UserController } from '../controllers/UserController.js';

const router = Router();

router.post('/signin' , UserController.signIn);
router.post('/create', UserController.create);
router.get('/port/:id', UserController.getPort);
router.get('/getall', UserController.getAllUser);

export default router;