import { PrismaClient } from "@prisma/client";

import dotenv from "dotenv";
import bodyParser from "body-parser";

const { json } = bodyParser;
const prisma = new PrismaClient();
dotenv.config();

export const SellController = {
  create: async (req, res) => {
    try {
      

      const quote = await prisma.quoteInPort.findFirst({where : { portId: req.body.portId , quoteId: req.body.quoteId}})

      if(!quote){
        res.status(404)
      }
      console.log("BE")
      await prisma.quoteInPort.update({
        where : { id: quote.id },
        data : {
            amountQuote : Math.abs(quote.amountQuote-req.body.amountSell)
        }
      })
      console.log("AF")
      await prisma.sellOrder.create({
        data: {
          createdAt: new Date(),
          portId: req.body.portId,
          quoteId: req.body.quoteId,
          userId: req.body.userId,
          amountSell : req.body.amountSell,
          priceSell : req.body.priceSell,
          createdAt : new Date()
        },
      });
      res.json("create success");
    } catch (error) {
        console.log(error)
      res.status(500).json({ error: error.message });
    }
  },
  getSellOrder : async (req , res) =>{
        try {
            
            const userId = req.params.id;

            const orders = await prisma.sellOrder.findMany({
                where : { userId : userId},
                include : {
                    quote : true,
                    portfolio : true
                }
                
            })

            res.json(orders);
        } catch (error) {
            res.status(500).json({ error: error.message });
            console.log(error)     
        }
    },
};
