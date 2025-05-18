import { PrismaClient } from "@prisma/client";
import { v2 as cloudinary } from 'cloudinary';
import dotenv from "dotenv";
import multer from "multer";
import streamifier from 'streamifier';

dotenv.config();
const prisma = new PrismaClient();



// multer setup
const storage = multer.memoryStorage();
export const upload = multer({ storage });

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

      // Optionally save to DB
      // await prisma.upload.create({
      //   data: {
      //     userId,
      //     url: uploadResult.secure_url,
      //     publicId: uploadResult.public_id,
      //   },
      // });

      return res.status(200).json({ message: "Uploaded successfully", data: uploadResult });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Upload failed", error });
    }
  },
};
