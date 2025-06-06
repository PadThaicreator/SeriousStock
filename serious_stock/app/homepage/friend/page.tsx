/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  ChevronDown,
  ChevronUp,
  CirclePlus,
  CircleX,
  MessageCircle,
  MessagesSquare,
  X,
} from "lucide-react";
import { useSelector } from "react-redux";
import RequestModal from "./component/request";
import { useEffect, useState } from "react";
import Modal from "@/utility/modal";
import socket from "@/utility/socket";
import axios from "axios";
import { config } from "@/app/config";
import { Cloudinary } from "@cloudinary/url-gen/index";
import Image from "next/image";

export default function Page() {
  const user = useSelector((state: any) => state?.user?.user);
  const [isShowReq, setIsShowReq] = useState<boolean>(false);
  const [isCreate, setCreate] = useState<boolean>(false);
  const [friendList, setFriend] = useState([]);
  const handleClose = () => {
    setCreate(false);
  };

  useEffect(() => {
    socket.emit("get-friend", { userId: user.id });
    socket.on("friend-data", (data) => {
      setFriend(data);
    });

    socket.on("friend-response", (item) => {
      socket.emit("get-friend", { userId: user.id });
    });
  }, []);

  return (
    <div className="flex flex-1 flex-col bg-white p-4">
      <div className=" flex flex-row justify-between">
        <div className="flex gap-2 items-center justify-center text-amber-500">
          <MessagesSquare size={20} />
          Friend
        </div>
        <div className="flex items-center justify-center gap-3 ">
          <div
            className="flex flex-row items-center justify-center gap-2 hover:bg-gray-200 rounded-md p-2 cursor-pointer"
            onClick={() => setCreate(!isCreate)}
          >
            <CirclePlus size={18} /> Create Chat
          </div>
          <div
            className={`${
              user.type === "consultant" ? "" : "hidden"
            } flex flex-row items-center justify-center gap-2 hover:bg-gray-200 rounded-md p-2 cursor-pointer`}
            onClick={() => setIsShowReq(!isShowReq)}
          >
            Friend Request{" "}
            {isShowReq ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
        </div>
      </div>
      <div className="flex flex-col flex-1 gap-3">
        {friendList.map((item, i) => {
          const friend = item.friend.find((id  : string) => id !== user.id);
          return <FriendCard id={friend} key={i} />
        })}
      </div>

      <Modal isOpen={isCreate} onClose={handleClose} title="Create Chat">
        <div></div>
      </Modal>

      {isShowReq && <RequestModal />}
    </div>
  );
}


const FriendCard = ( prop : any ) =>{
  const { id } = prop;
  const [user,setUser] = useState();
  const [url , setUrl] = useState("");

  const fetchUser =  async() =>{
    try {
      const res = await axios.get(`${config.apiBackend}/user/getUser/${id}`)
      if(res){
        setUser(res.data);
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
    if(id){
      fetchUser();
    }
  },[id])

    useEffect(() => {
    if (user) {
      const cld = new Cloudinary({ cloud: { cloudName: "dlsd9groz" } });
      const img = cld.image(user?.profile);
      const imgUrl = img.toURL() + `?t=${Date.now()}`;
      setUrl(imgUrl);
    }
  }, [user]);

  return(
    <div className="bg-gray-100 p-4 rounded-lg shadow-lg flex flex-1 justify-between ">
      <div className="flex flex-1 items-center gap-4">
        <div className="w-24 h-24 rounded-full overflow-hidden">
          { url && <Image
            src={url}
            width={150}
            height={150}
            alt="profile"
            className="w-full h-full object-cover"
          />}
        </div>
        <div className="text-lg">{user?.name} <p className="text-[0.9em]">(@{user?.username})</p></div>
      </div>
      <div className="flex items-center gap-4">
        <MessageCircle size={24} className="text-amber-500 cursor-pointer"/>
        <CircleX  size={24} className="text-red-500 cursor-pointer"/>
      </div>
    </div>
  );
}
