import express from "express";
import cors from "cors";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/check-db-connection", async (req, res) => {
  try {
    await prisma.$connect();
    res.send({ message: "Connect to DataBase" });
  } catch (error) {
    console.log("Error : ", error.message);
    res.status(500).send({ error: error.message });
  }
});

import userRoutes from "./routes/user.route.js";

app.use("/user", userRoutes);

app.listen(port, () => {
  console.log(`server is running on port http://localhost:${port}`);
});
