import { PrismaClient } from "@prisma/client";
import friendSocket from "./friendSocket.js";
import messageSocket from "./messageSocket.js";
const prisma = new PrismaClient();

export default function (io) {
   
  io.on('connection', (socket) => {
    

    socket.on('join', ({ userId }) => {
        console.log(`User ${userId} joined room`);
      socket.join(userId);
    });

    socket.on('private-message', async ({ senderId, receiverId, message }) => {
      // บันทึกข้อความลง DB
      await prisma.message.create({
        data: { senderId, receiverId, content: message }
      });

      // ส่งข้อความให้ผู้รับ
      io.to(receiverId).emit('private-message', { senderId, message });
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });


    

      friendSocket(io,socket);
      messageSocket(io,socket);
  });
};
