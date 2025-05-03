import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import dayjs from "dayjs";
import yahooFinance from "yahoo-finance2"; 

const { json } = bodyParser;
const prisma = new PrismaClient();
dotenv.config();

export const QuoteController = {
  getAll: async (req, res) => {
    try {
      const data = await prisma.quote.findMany();

      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  get: async (req, res) => {
    try {
      const data = await prisma.quote.findFirst({
        where: { displaySymbol: req.params.symbol },
      });
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getDetail: async (req, res) => {
    const symbol = req.params.symbol;
   
    try {
      const result = await yahooFinance.quote(symbol);

      res.json(result);
    } catch (err) {
      console.error("🔥 ERROR:", err);
      res
        .status(500)
        .json({ error: "Failed to fetch stock data", message: err.message });
    }
  },
  getPrice: async (req, res) => {
    const symbol = req.params.symbol;
    const day = parseInt(req.query.day) || 30;

    const today = dayjs().format("YYYY-MM-DD");
    const daysAgo = dayjs().subtract(day, "day").format("YYYY-MM-DD");

    try {
      const result = await yahooFinance.historical(symbol, {
        period1: daysAgo,
        period2: today,
        interval: "1d",
      });

      res.json(result);
    } catch (err) {
      console.error("🔥 ERROR:", err);
      res
        .status(500)
        .json({ error: "Failed to fetch stock data", message: err.message });
    }
  },
};
