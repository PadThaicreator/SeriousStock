import { PrismaClient } from "@prisma/client";

import dotenv from "dotenv";
import bodyParser from "body-parser";
import { Socket } from "socket.io";

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
          friend: { hasEvery: [userId, friendId] }
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
  updateStatus : async (req ,res) =>{
    try {

      const isAccept = req.body.isAccept;
      console.log(isAccept);

      const data = await prisma.friend.findFirst({
        where : {
            friend : { hasEvery : [req.body.senderId , req.body.userId]}
          }
      })

      if(!data){
        res.status(404).json({message : "Not Found"})
      }
      if(isAccept){
        await prisma.friend.update({
          data : {
              status : "Accepted"
          },
          where : {
            id : data.id
          }
        })
      }else{
        await prisma.friend.delete({
          where : {
            id : data.id
          }
        })
      }
      
      res.json({message : "Successful"});
    } catch (error) {
       res.status(500).json({ error: error.message });
       console.log(error);
    }
  }
};
