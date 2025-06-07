import { PrismaClient } from "@prisma/client";

import bodyParser from "body-parser";


const { json } = bodyParser;
const prisma = new PrismaClient();


export const ChannelController = {
  create : async (req ,res)  =>{
    try {
        const user = req.body.user;
        const find = await prisma.channel.findFirst({
            where : { user : 
                {
                    hasEvery : user
                }
            }
        })

        if(find){
           return res.json(find)
        }

        const response = await prisma.channel.create({
            data : {
                user : user
            }
        })

        res.json(response)
    } catch (error) {
        res.status(500).json({ error: error.message })
        console.log(error)
    }
  },
  getChannel : async (req ,res) =>{
    try {
        const chId = req.params.channelId;
        const ch = await prisma.channel.findFirst({
            where : {id : chId},
            include : {
                message : {
                    orderBy : {
                        createAt : 'asc'
                    }
                }
            }
        })

        if(!ch){
            res.status(404).json("Not Found")
        }

        res.json(ch)
    } catch (error) {
        res.status(500).json({ error: error.message })
        console.log(error)
    }
  }
};
