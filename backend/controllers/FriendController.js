import { PrismaClient } from "@prisma/client";

import dotenv from "dotenv";
import bodyParser from "body-parser";

const { json } = bodyParser;
const prisma = new PrismaClient();
dotenv.config();

export const FriendController = {
  getStatus : async (req ,res) =>{
    try {
      
      const userId = req.params.userId;
      const friendId = req.params.friendId;
      const friendStatus = await prisma.friend.findFirst({
        where: {
          friend: { has: userId && friendId }
        }
      });
      if(!friendStatus) {
        return res.json({ status: "Send Resquest" });
      }

      console.log(friendStatus.status);
      res.json(friendStatus);


    } catch (error) {
      res.status(500).json({ error: error.message });
      console.log(error);
    }
  },
  getRequest: async (req, res) => {
    try {
      const userId = req.params.userId;
     
      const requests = await prisma.friend.findMany({
        where: {
          friend: { has: userId },
          status: 'waiting',
          senderId : { not: userId }
        }
      });

      res.json(requests);
    } catch (error) {
      res.status(500).json({ error: error.message });
      
    }
  },
};
