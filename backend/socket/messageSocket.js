import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default function (io, socket) {
  socket.on("send-message" , async ({ senderId , channelId , content , file}) =>{
      const message = await prisma.message.create({
        data : {
            channelId : channelId,
            senderId : senderId,
            content : content || "",
            file : file || "",
            type : file ? "file" : "text"
        }
      })

      const channel = await prisma.channel.findFirst({
        where : { id : channelId}
      })

      channel.user.forEach(item => {
        if(item !=senderId){
          io.to(item).emit('get-message', message);
        }
      });
  })
}
