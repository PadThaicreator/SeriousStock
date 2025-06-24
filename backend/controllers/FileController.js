import { PrismaClient } from "@prisma/client";

import dotenv from "dotenv";
import multer from "multer";
import streamifier from "streamifier";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
dotenv.config();
const prisma = new PrismaClient();

// multer setup
const storage = multer.memoryStorage();
export const upload = multer({ storage });
export const uploadArray = multer({ dest: "temp/" });

export const FileController = {
  uploadApprove: async (req, res) => {
    try {
      const user = req.body.user;
      const file = req.file;

      if (!file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const streamUpload = (buffer) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "approve",
              public_id: `user_${user}_approve`,
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

      const uploadResult = await streamUpload(file.buffer);
      console.log("Upload result:", uploadResult);

      // Optionally save to DB
      // await prisma.upload.create({
      //   data: {
      //     userId,
      //     url: uploadResult.secure_url,
      //     publicId: uploadResult.public_id,
      //   },
      // });

      return res
        .status(200)
        .json({ message: "Uploaded successfully", data: uploadResult });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Upload failed", error });
    }
  },
  uploadMany: async (req, res) => {
    try {
      const fileUrls = [];

      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "chat_uploads",
        });

        fileUrls.push(result.secure_url);

        
        fs.unlinkSync(file.path);
      }

      res.status(200).json({ file: fileUrls });
      
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Upload failed", error });
    }
  },
};
