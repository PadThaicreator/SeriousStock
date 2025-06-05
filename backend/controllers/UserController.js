import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bodyParser from "body-parser";

import { v2 as cloudinary } from 'cloudinary';
import multer from "multer";
import streamifier from 'streamifier';
const { json } = bodyParser;
const prisma = new PrismaClient();
dotenv.config();

const storage = multer.memoryStorage();
export const upload = multer({ storage });

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
          doc : "approve/"+req.body.doc || "",
          createdAt : new Date()
        },
      });

      res.json({ message: "Success" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  signIn: async (req, res) => {
    try {
      console.log("IN");
      const username = req.body.username;
      const password = req.body.password;
      const user = await prisma.user.findFirst({
        where: {
          username: username,
          password: password,
          status: "active",
        },
        include: {
          address : true
        }
      });
      console.log(user);
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
  getPort: async (req, res) => {
    try {
      console.log(req.params.userId);
      if(!req.params.userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      const port = await prisma.user.findFirst({
        where: { id: req.params.userId },
        include: {
          portfolio: true,
        },
      });
      res.json(port);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  },
  getAllUser : async (req,res) =>{
    try {
      const users = await prisma.user.findMany();
      res.json(users);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  },
  updateUser : async (req,res) =>{
    try {
      console.log("In Update")
      console.log(req.body);
      const file = req.file;
      const userId = req.body.userId;
      const name = req.body.name;
      const username = req.body.username;
      const phone = req.body.phone;
      const email = req.body.email;
      const province = req.body.province;
      const district = req.body.district;
      const subDistrict = req.body.subDistrict;
      const zipCode = req.body.zipCode;
      const detail = req.body.detail;
      
      const user = await prisma.user.findFirst({
        where: { id: userId },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if(file){
        const streamUpload = (buffer) => {
          return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
               {
                folder: "profile",
                public_id: `profile_${userId}`,
                resource_type: "auto", 
                
              },
               (error, result) => {
                 if (result) resolve(result);
                else reject(error);
               }
             );
             streamifier.createReadStream(buffer).pipe(stream);
           });
         };

          const  uploadResult = await streamUpload(file.buffer);
      }
      
      await prisma.user.update({
        where: { id: userId },
        data: {
          name: name,
          username: username,
          phone: phone,
          email: email,
          profile : `profile/profile_${userId}`
        },
      });

      await prisma.address.upsert({
        where: { userId: userId },
        update: {
          province: province,
          district: district,
          subDistrict: subDistrict,
          postCode: zipCode,
          detail: detail,
        },
        create: {
          userId: userId,
          province: province,
          district: district,
          subDistrict: subDistrict,
          postCode: zipCode,
          detail: detail,
        },
      });

      res.status(200).json({message : "User updated Successfully"})

    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  },
  getConsultant : async (req,res) =>{
    try {
      
      const con = await prisma.user.findMany({
        where : {
          type : "consultant",
          status : "active"
        }
      })
      res.status(200).json(con);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
      
    }
  },
  getUser : async (req ,res) =>{
    try {
      const user = await prisma.user.findFirst({
        where : { id : req.params.id }
      })
      
      res.json(user);
    } catch (error) {
       res.status(500).json({ error: error.message });
    }
  }
};
