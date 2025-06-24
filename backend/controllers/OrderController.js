import { PrismaClient } from "@prisma/client";

import dotenv from "dotenv";
import bodyParser from "body-parser";
import puppeteer from "puppeteer";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

const { json } = bodyParser;
const prisma = new PrismaClient();
dotenv.config();

export const OrderController = {
  create: async (req, res) => {
    try {
      const quote = await prisma.quoteInPort.findFirst({
        where: { portId: req.body.portId, quoteId: req.body.quoteId },
      });

      if (!quote) {
        await prisma.quoteInPort.create({
          data: {
            portId: req.body.portId,
            quoteId: req.body.quoteId,
            amountQuote: req.body.amountQuote,
            avgPrice: req.body.priceQuote,
          },
        });
      } else {
        await prisma.quoteInPort.update({
          where: { id: quote.id },
          data: {
            amountQuote: quote.amountQuote + req.body.amountQuote,
            avgPrice: (quote.avgPrice + req.body.priceQuote) / 2,
          },
        });
      }

      const quotes = await prisma.quoteInPort.findFirst({
        where: { portId: req.body.portId, quoteId: req.body.quoteId },
      });

      console.log("PDF Receipt generated successfully");
      // 🧾 Generate PDF
      const html = `
            <html>
                <body>
                <h1>Sell Receipt</h1>
                <p><strong>Port:</strong> ${req.body.portId}</p>
                <p><strong>Quote:</strong> ${req.body.quoteId}</p>
                
                <p><strong>Amount Sell:</strong> ${req.body.amountQuote}</p>
                <p><strong>Price Sell:</strong> ${req.body.priceQuote} THB</p>
                <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
                </body>
            </html>
            `;

      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.setContent(html);
      const pdfBuffer = await page.pdf({ format: "A6" });
      await browser.close();
      console.log("PDF Receipt generated successfully");

      // อัปโหลด Buffer โดยตรง
      const result = await cloudinary.uploader.upload_stream(
        {
          folder: "receipts",
          public_id: `receipt_${req.body.portId}_${
            req.body.quoteId
          }_${new Date().getTime()}`,
          access_control: [
            {
              access_type: "anonymous",
             
            },
          ],

          // กำหนด resource_type เป็น raw หากเป็นไฟล์ PDF
        },
        (error, result) => {
          if (error) {
            console.log("Upload error:", error);
          } else {
            console.log("PDF Receipt URL:", result.secure_url);
          }
        }
      );

      streamifier.createReadStream(pdfBuffer).pipe(result);

      await prisma.order.create({
        data: {
          portId: req.body.portId,
          quoteId: req.body.quoteId,
          priceQuote: req.body.priceQuote,
          amountQuote: req.body.amountQuote,
          priceToPay: req.body.priceToPay,
          quoteInPortId: quotes.id,
          createdAt: new Date(),
        },
      });
      res.json({ message: "Success" });
    } catch (error) {
      res.status(500).json({ error: error.message });
      console.log(error);
    }
  },
  getOrder: async (req, res) => {
    try {
      const userId = req.params.id;
      const port = await prisma.portfolio.findMany({
        where: { userId: userId },
      });

      const orders = await prisma.order.findMany({
        where: { portId: { in: port.map((p) => p.id) } },
        include: {
          quote: true,
          portfolio: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: error.message });
      console.log(error);
    }
  },
  getAll: async (req, res) => {
    try {
      const orders = await prisma.order.findMany({
        include: {
          quote: true,
          portfolio: true,
        },
      });
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: error.message });
      console.log(error);
    }
  },
};
