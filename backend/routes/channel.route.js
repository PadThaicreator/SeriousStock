import { Router } from "express";
import { ChannelController } from "../controllers/ChannelController.js";

const router = Router();

router.post('/create' , ChannelController.create);
router.get('/getChannel/:channelId' , ChannelController.getChannel);

export default router;