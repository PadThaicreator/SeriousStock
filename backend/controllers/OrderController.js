import { PrismaClient } from "@prisma/client";

import dotenv from "dotenv";
import bodyParser from "body-parser";

const { json } = bodyParser;
const prisma = new PrismaClient();
dotenv.config();

export const OrderController = {
    create : async (req,res) =>{
        try {
            
            
            const quote = await prisma.quoteInPort.findFirst({
                where : { portId : req.body.portId , quoteId : req.body.quoteId }
            })
            
            if(!quote){
                await prisma.quoteInPort.create(
                    {data : {
                    portId : req.body.portId , 
                    quoteId : req.body.quoteId,
                    amountQuote : req.body.amountQuote,
                    avgPrice : req.body.priceQuote
                }})
            }else{
                await prisma.quoteInPort.update({
                    where : { id : quote.id },
                    data : {
                        amountQuote : quote.amountQuote+req.body.amountQuote,
                        avgPrice    : (quote.avgPrice+req.body.priceQuote)/2
                    }
                })
            }

            const quotes = await prisma.quoteInPort.findFirst({
                where : { portId : req.body.portId , quoteId : req.body.quoteId }
            })

            await prisma.order.create({
                data : {
                    portId : req.body.portId,
                    quoteId : req.body.quoteId,
                    priceQuote : req.body.priceQuote,
                    amountQuote : req.body.amountQuote,
                    priceToPay : req.body.priceToPay,
                    quoteInPortId : quotes.id,
                    createdAt : new Date()
                }
            })
            res.json({ message: "Success" });
        } catch (error) {
            res.status(500).json({ error: error.message });
            console.log(error)
        }
    }
}