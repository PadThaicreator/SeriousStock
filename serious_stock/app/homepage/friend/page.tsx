/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  ChevronDown,
  ChevronUp,
  CirclePlus,
  MessagesSquare,
} from "lucide-react";
import { useSelector } from "react-redux";
import RequestModal from "./component/request";
import { useEffect, useState } from "react";
import Modal from "@/utility/modal";
import socket from "@/utility/socket";

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
      <div>
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


const FriendCard = ( prop ) =>{
  const { id } = prop;

  return(
    <div >
      {id}
    </div>
  );
}
