import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default function (io, socket) {
  socket.on("send-friend-request", async ({ senderId, receiverId }) => {
    console.log(`Friend request from ${senderId} to ${receiverId}`);
    const request = await prisma.friend.create({
      data: {
        friend: [senderId, receiverId],
        senderId: senderId,
      },
    });

    const amount = await prisma.friend.count({
      where: {
        friend: {
          has: receiverId,
        },
        status: "waiting",
      },
    });
    console.log(`Friend request count for ${receiverId}: ${amount}`);
    io.to(receiverId).emit("friend-request", { amount });
    // io.to(senderId).emit('friend-request', { status:request.status });
  });

  socket.on(
    "respond-friend-request",
    async ({ senderId, userId, isAccept }) => {
      try {
        const data = await prisma.friend.findFirst({
          where: {
            friend: { hasEvery: [senderId, userId] },
          },
        });

        if (!data) {
          return socket.emit("friend-response", {
            success: false,
            message: "Not Found",
          });
        }

        if (isAccept) {
          await prisma.friend.update({
            data: { status: "Accepted" },
            where: { id: data.id },
          });
        } else {
          await prisma.friend.delete({ where: { id: data.id } });
        }

        // ส่งสถานะกลับให้ทั้งสองคน
        io.to(senderId).emit("friend-response", {
          success: true,
          message: "Updated",
          
        });
        io.to(userId).emit("friend-response", {
          success: true,
          message: "Updated",
          accepted: isAccept,
        });
      } catch (error) {
        console.error(error);
        socket.emit("friend-response", {
          success: false,
          message: error.message,
        });
      }
    }
  );

  socket.on("get-friend", async ({ userId }) => {
    try {
        const friends = await prisma.friend.findMany({
            where : {
                friend : { has : userId } ,
                status : "Accepted"
            }
        })

        

        socket.emit("friend-data" ,friends )
    } catch (error) {
      console.error(error);
      socket.emit("friend-response", {
        success: false,
        message: error.message,
      });
    }
  });
}
