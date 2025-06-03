import express from "express";

import cors from "cors";
import { PrismaClient } from "@prisma/client";


import initSocket from './socket/index.js';
import http from "http";
import { Server } from "socket.io";


const prisma = new PrismaClient();

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import { v2 as cloudinary } from 'cloudinary';
cloudinary.config({ 
  cloud_name: 'dlsd9groz', 
  api_key: '695342417365959', 
  api_secret: 'xBmeSy1yVMOAfrdfeCdDl1LohEU'
});

app.get("/check-db-connection", async (req, res) => {
  try {
    await prisma.$connect();
    res.send({ message: "Connect to DataBase" });
  } catch (error) {
    console.log("Error : ", error.message);
    res.status(500).send({ error: error.message });
  }
})


import userRoutes from "./routes/user.route.js";
import portRoutes from "./routes/port.route.js";
import quoteRoutes from "./routes/quote.route.js";
import orderRoute from "./routes/order.route.js";
import sellRoute from "./routes/sell.route.js";
import fileRoute from "./routes/file.route.js";


app.use("/user", userRoutes);
app.use("/port", portRoutes);
app.use("/quote", quoteRoutes);
app.use("/order", orderRoute);
app.use("/sell" , sellRoute);
app.use("/upload" , fileRoute);




const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});



initSocket(io);


server.listen(port, () => {
  console.log(`server is running on port http://localhost:${port}`);
});
