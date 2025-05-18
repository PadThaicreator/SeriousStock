import { Router } from "express";
import { FileController, upload } from "../controllers/FileController.js";

const router = Router();

router.post('/approve', upload.single('file'), FileController.uploadApprove);

export default router;
