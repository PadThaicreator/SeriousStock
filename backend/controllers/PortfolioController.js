import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bodyParser from "body-parser";


const { json } = bodyParser;
const prisma = new PrismaClient();
dotenv.config();


export const PortfolioController = {
    create : async (req,res) =>{
        try {
           
            const user = await prisma.user.findFirst({
              where: {
                id: req.body.userId,
              },
            });
            
            if (!user) {
                
              return res.status(403).json({ message: "Error" });
              
            }
            
            await prisma.portfolio.create({
              data: {
                name: req.body.name,
                reason: req.body.reason,
                description: req.body.description,
                status: "pending",
                createdAt: new Date(),
                userId : req.body.userId     
              },
            });
            res.json({ message: "Success" });
          } catch (error) {
            res.status(500).json({ error: error.message });
            console.log(error)
          }
    }
}