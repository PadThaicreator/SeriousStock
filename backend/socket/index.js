import { PrismaClient } from "@prisma/client";
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


    socket.on('send-friend-request', async ({ senderId, receiverId }) => {
      console.log(`Friend request from ${senderId} to ${receiverId}`);
      const request = await prisma.friend.create({
        data : {
          friend : [ senderId , receiverId],
          senderId: senderId,

        }
      })

      const amount = await prisma.friend.count({
        where : {
          friend: {
            has: receiverId
          },
          status: 'waiting'
        }
      })
      console.log(`Friend request count for ${receiverId}: ${amount}`);
        io.to(receiverId).emit('friend-request', {  amount });
        // io.to(senderId).emit('friend-request', { status:request.status });
      });

  });
};
