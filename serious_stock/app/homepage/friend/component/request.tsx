/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { config } from "@/app/config";
import { Cloudinary } from "@cloudinary/url-gen/index";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Image from 'next/image';
import {  CircleCheck, CircleUserRound, CircleX } from "lucide-react";
import socket from "@/utility/socket";

export default function RequestModal() {
  const user = useSelector((state: any) => state.user.user);
  const [request, setRequest] = useState([]);

  const fetchReqFriend = async () => {
    try {
      if (!user || !user.id) {
        console.error("User ID is not available");
        return;
      }

      const res = await axios.get(
        `${config.apiBackend}/friend/getrequest/${user.id}`
      );
      if (res) {
        setRequest(res.data);
      }
    } catch (error) {
      console.error("Error fetching friend requests:", error);
    }
  };

  useEffect(() => {
    fetchReqFriend();
  }, []);

  

  return (
    <div className="absolute top-25  right-18  w-100 border  bg-white flex  p-2 rounded-lg">
      <div className="flex flex-1 flex-col">
        {request.map((item, index) => (
        <div key={index} className="border-b flex flex-1">
            <RequestCard key={index}  id={item.senderId} fetchReq={fetchReqFriend} />
        </div>
        ))}

        {request.length == 0 && <div className="flex flex-1 justify-center text-gray-400">No Friend Request</div>}
      </div>
    </div>
  );
}

const RequestCard = (prop: any) => {
  const { id , fetchReq } = prop;

  const [user, setUser] = useState();
  const [url, setUrl] = useState("");
  const owner = useSelector((state : any) => state.user.user)

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${config.apiBackend}/user/getUser/${id}`);
      if (res) {
        setUser(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchUser();
    }
  }, [id]);

  useEffect(() => {
    if (user) {
      const cld = new Cloudinary({ cloud: { cloudName: "dlsd9groz" } });
      const img = cld.image(user?.profile);
      const imgUrl = img.toURL() + `?t=${Date.now()}`;
      setUrl(imgUrl);
    }
  }, [user]);

  const handleRequest = async ( isAccept : boolean) =>{
    try {

      socket.emit("respond-friend-request" ,{ isAccept : isAccept , userId : owner.id ,senderId : id})
      
      
      
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    socket.on("friend-response" , (item) => {
     
      fetchReq();
    })
  },[])

  return (
    <div className="flex flex-1 items-center justify-between p-2 ">
        <div className="flex items-center gap-4">
            <div className="rounded-full overflow-hidden w-18 h-18 outline-2 outline-amber-500">
                { url ? (<Image 
                src={url }
                width={150}
                height={150}
                alt="profile"
                className="object-cover w-full h-full"/>)
                :(
                    <CircleUserRound   className="w-full h-full text-gray-400"/>
                )
                }
                
            </div>
            <div className=" text-lg ">
                {user?.name}
            </div>
        </div>
        <div className="flex gap-2">
            <CircleCheck className="text-green-500 hover:text-green-700 cursor-pointer" onClick={() => {handleRequest(true)}}/>
            <CircleX className="text-red-500 hover:text-red-700 cursor-pointer"  onClick={() => {handleRequest(false)}}/>
        </div>
    </div>
  );
};
