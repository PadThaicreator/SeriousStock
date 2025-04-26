import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bodyParser from "body-parser";

const { json } = bodyParser;
const prisma = new PrismaClient();
dotenv.config();

export const UserController = {
  create: async (req, res) => {
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
  signIn: async (req, res) => {
    try {console.log("IN")
      const username = req.body.username;
      const password = req.body.password;
      const user = await prisma.user.findFirst({
        where: {
          username: username,
          password: password,
          status: "active",
        },
      });
      console.log(user)
      if (!user) {
        return res
          .status(403)
          .json({ message: "Invalid username or password" });
      }

      const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
        expiresIn: "7d",
      });
      res.json({ token: token, user: user });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  },
  check: async (req, res) => {
    res.json("In User");
  },
  getPort : async (req,res) =>{
    try {
      const port = await prisma.user.findFirst({
        where : {id : req.params.userId},
        include : {
          portfolio : true
        }
      })
      res.json(port)
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  }
};
