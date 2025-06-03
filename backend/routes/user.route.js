import { Router } from "express";
import { UserController , upload } from '../controllers/UserController.js';

const router = Router();

router.post('/signin' , UserController.signIn);
router.post('/create', UserController.create);
router.get('/port/:userId', UserController.getPort);
router.get('/getall', UserController.getAllUser);
router.get('/getConsult', UserController.getConsultant);
router.put('/update', upload.single('file'), UserController.updateUser);
export default router;