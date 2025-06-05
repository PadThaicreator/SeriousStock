import { Router } from "express";
import { FriendController} from "../controllers/FriendController.js";

const router = Router();

router.get('/getrequest/:userId', FriendController.getRequest);
router.get('/status/:userId/:friendId', FriendController.getStatus);
router.put('/updateStatus', FriendController.updateStatus);
export default router;
