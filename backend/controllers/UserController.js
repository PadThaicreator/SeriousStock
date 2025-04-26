import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bodyParser from "body-parser";


const { json } = bodyParser;
const prisma = new PrismaClient();
dotenv.config();

export const UserController = {
  create: async (req, res)   => {
    try {
      
      const user = await prisma.user.findFirst({
        where: {
          email: req.body.email,
        },
      });
      
      if (user) {
        return res.status(401).json({ message: "Username already exists" });
      }
      
      await prisma.user.create({
        data: {
          name: req.body.name,
          username: req.body.username,
          password: req.body.password,
          email: req.body.email,
          phone: req.body.phone,
          type: req.body.type,
        },
      });
      
      res.json({ message: "Success" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  signIn: async (req, res)  => {
    try {
      const username = req.body.username;
      const password = req.body.password;
      const user = await prisma.user.findFirst({
        where: {
          username: username,
          password: password,
          status: "active",
        },
      });

      if (!user) {
        return res.status(401).json({ message: "Invalid username or password" });
      }

      if (!process.env.SECRET_KEY) {
        throw new Error("SECRET_KEY is not defined");
      }
      const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, { expiresIn: "7d" });
      res.json({token: token || ""});
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  check : async (req  , res ) =>{
    res.json("In User");
  }
};
