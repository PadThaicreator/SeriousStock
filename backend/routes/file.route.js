import { Router } from "express";
import { FileController, upload , uploadArray } from "../controllers/FileController.js";

const router = Router();

router.post('/approve', upload.single('file'), FileController.uploadApprove);
router.post('/uploadMany' , uploadArray.array('files'), FileController.uploadMany);

export default router;
