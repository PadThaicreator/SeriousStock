/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { config } from "@/app/config";
import socket from "@/utility/socket";

import { Cloudinary } from "@cloudinary/url-gen/index";
import axios from "axios";
import {
  ArrowLeft,
  SendHorizontal,
  Users,
  Image as Pic,
  X,
} from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

export default function Page() {
  const params = useParams();
  const user = useSelector((state: any) => state?.user?.user);
  const [channel, setChannel] = useState();
  const [nameCh, setNameCh] = useState();
  const [messages, setMessages] = useState([]);
  const id = params.friendChat;

  const fetchChannel = async () => {
    try {
      const res = await axios.get(
        `${config.apiBackend}/channel/getChannel/${id}`
      );
      if (res) {
        setChannel(res.data);
      }
      if (!res.data.channelName) {
        const friend = res.data.user.find((item: any) => {
          return item != user.id;
        });
        const response = await axios.get(
          `${config.apiBackend}/user/getUser/${friend}`
        );
        setNameCh(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchChannel();
    }
  }, [id]);

  useEffect(() => {
    setMessages(channel?.message);
  }, [channel]);

  useEffect(() => {
    socket.on("get-message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("get-message");
    };
  }, []);

  return (
    <div className="flex flex-1 bg-gray-100 rounded-lg p-4 flex-col">
      <div className=" rounded-lg shadow-lg">
        <div className="flex flex-1 p-4 border-b ">
          <HeaderChat head={nameCh} />
        </div>
        <div className="flex flex-6 p-4  ">
          <MessageZone messages={messages} user={user} channel={channel} />
        </div>
        <div className="flex flex-1 p-4  ">
          <TypingZone chId={id} setMessages={setMessages} user={user} />
        </div>
      </div>
    </div>
  );
}

const HeaderChat = (prop: any) => {
  const { head } = prop;
  const [url, setUrl] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (head) {
      const cld = new Cloudinary({ cloud: { cloudName: "dlsd9groz" } });
      const img = cld.image(head?.profile);
      const imgUrl = img.toURL() + `?t=${Date.now()}`;
      setUrl(imgUrl);
      console.log(head);
    }
  }, [head]);

  return (
    <div className="flex flex-1 flex-row items-center gap-4 ">
      <ArrowLeft
        size={28}
        className="hover:bg-gray-200 rounded-full p-1 cursor-pointer"
        onClick={() => {
          router.push("/homepage/friend");
        }}
      />
      <div className="w-18 h-18 overflow-hidden rounded-full">
        {url ? (
          <Image
            src={url}
            width={150}
            height={150}
            alt="pic"
            className="w-full h-full object-cover"
          />
        ) : (
          <Users className="w-full h-full" />
        )}
      </div>
      <div className="text-xl font-semibold">{head?.name}</div>
    </div>
  );
};

const TypingZone = (prop: any) => {
  const { chId, setMessages, user } = prop;
  const [text, setText] = useState<string>("");
  const [file, setFile] = useState([]);
  const [image, setImage] = useState([]);

  const handleSend = () => {
    socket.emit("send-message", {
      senderId: user.id,
      content: text,
      channelId: chId,
    });

    setMessages((prev) => [
      ...prev,
      { senderId: user.id, content: text, channelId: chId },
    ]);

    setText("");
  };
  const fileInputRef = useRef(null);
  const handleFile = (e) => {
    const files = e.target.files;
    setFile(files);

    if (files) {
      const urls = Array.from(files).map((file) => URL.createObjectURL(file));
      setImage(urls);
    }
  };
  const clickFile = () => {
    fileInputRef.current?.click();
  };
  return (
    <div className="flex flex-1 p-1  rounded-2xl  gap-4 flex-col">
      <div
        className={`flex gap-4 mt-4  ${
          image.length > 0 ? "h-40 overflow-x-auto" : ""
        }`}
      >
        {image.map((src, index) => (
          <div key={index} className="relative inline-block">
            <X
              size={20}
              className="absolute right-1 top-1 z-20 bg-white rounded-full text-black cursor-pointer"
              onClick={() => {
                const newImages = [...image];
                newImages.splice(index, 1);
                setImage(newImages);

                const newFiles = [...file];
                newFiles.splice(index, 1);
                setFile(newFiles);
              }}
            />
            {file[index]?.type.startsWith("image/") ? (
              <a href={src} target="_blank" rel="noopener noreferrer">
                <Image
                  src={src}
                  alt={`upload-${index}`}
                  width={200}
                  height={200}
                  className="w-auto h-full object-cover rounded cursor-pointer"
                />
              </a>
            ) : (
            <a href={src} target="_blank" rel="noopener noreferrer">
              <div className="w-40 h-full bg-gray-200 border hover:border-blue-500  shadow-xl rounded-lg flex items-center justify-center flex-col p-2">
                
                <div
                  className="font-medium text-sm truncate max-w-full"
                  title={file[index].name}
                >
                  {file[index].name}
                </div>

                <div className="text-xs text-gray-600">
                  {(file[index].size / 1024).toFixed(1)} KB
                </div>
              </div>
            </a>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <textarea
          className="focus:outline-1 outline-gray-500 rounded-lg border p-1 w-full resize-none"
          rows={2}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
          }}
        />

        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          multiple
          onChange={handleFile}
        />
        <Pic onClick={clickFile} />

        <SendHorizontal onClick={handleSend} />
      </div>
    </div>
  );
};

const MessageZone = (prop: any) => {
  const { messages, user, channel } = prop;
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  return (
    <div className="flex flex-1 h-85 flex-col overflow-y-auto gap-2">
      {messages?.map((item, index) => (
        <div
          key={index}
          className={`flex   rounded-lg  ${
            user.id == item.senderId ? "justify-end" : ""
          }`}
        >
          <div className="  rounded-lg p-2 px-4 bg-blue-300">
            {item.content}
          </div>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
};
