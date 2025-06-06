/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { config } from "@/app/config";
import { Cloudinary } from "@cloudinary/url-gen/index";
import axios from "axios";
import { use, useEffect, useState } from "react";
import Image from "next/image";
import {
  ArrowDown,
  ArrowUp,
  Divide,
  Mail,
  Phone,
  TrendingUp,
} from "lucide-react";
import LoadingPage from "@/utility/loading";
import socket from "@/utility/socket";
import { useSelector } from "react-redux";

export default function Page() {
  const [consult, setConsult] = useState([]);
  const [selectedConsultant, setSelectedConsultant] = useState<string>("");
  const [detail, setDetail] = useState<any>();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isRequestSent, setIsRequestSent] = useState("Send Request");
  const user = useSelector((state: any) => state?.user?.user);
  const fetchConsultant = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${config.apiBackend}/user/getConsult`);

      setConsult(res.data);
    } catch (error) {
      console.error("Error fetching consultant data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchConDetail = async () => {
    try {
      const res = await axios.get(
        `${config.apiBackend}/user/port/${selectedConsultant}`
      );
      const reqfri = await axios.get(
        `${config.apiBackend}/friend/status/${user.id}/${selectedConsultant}`
      );
      if (reqfri) setIsRequestSent(reqfri.data);

      setDetail(res.data);
    } catch (error) {
      console.error("Error fetching consultant data:", error);
    }
  };

  useEffect(() => {
    if (detail) {
      const cld = new Cloudinary({ cloud: { cloudName: "dlsd9groz" } });
      const img = cld.image(detail?.profile);
      console.log("DEta");
      console.log(detail);
      const imgUrl = img.toURL() + `?t=${Date.now()}`;
      setUrl(imgUrl);
    }
  }, [detail]);

  useEffect(() => {
    fetchConsultant();

    // socket.on("friend-response" , (( ) =>{
    //     alert(selectedConsultant)
    //     if (selectedConsultant && user?.id) {
    //       fetchConDetail();
    //     }
    // }))
  }, []);

 

  useEffect(() => {
    if (!selectedConsultant) return;
    fetchConDetail();
    console.log("Selected Consultant ID:", selectedConsultant);
  }, [selectedConsultant]);

  

  if (loading) {
    return <LoadingPage />;
  }

  const handleRequest = () => {
    if (isRequestSent?.status != "Send Resquest") {
      return;
    }
    socket.emit("send-friend-request", {
      senderId: user.id,
      receiverId: selectedConsultant,
    });
    fetchConDetail();
    alert(selectedConsultant)
  };

  return (
    <div className="flex flex-1 bg-white flex-col gap-5 p-4">
      <div className="flex flex-col  p-2 gap-2">
        <div className="flex flex-1 p-4  bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200 text-xl font-semibold text-white rounded-lg">
          Our Consultant
        </div>
        <div className="flex gap-4 overflow-y-auto flex-wrap mb-4 p-2">
          {consult.map((item, index) => (
            <ConsultantCard
              key={index}
              consultant={item}
              setSelectedConsultant={setSelectedConsultant}
            />
          ))}
        </div>
      </div>
      <div
        className={`flex flex-1  flex-col  p-2 rounded-lg  ${
          !selectedConsultant ? "hidden" : ""
        }`}
      >
        <div className="flex flex-1 p-4 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200 text-xl font-semibold text-white rounded-t-lg ">
          Consultant Detail
        </div>
        <div className="flex flex-1 p-4 shadow-2xl bg-gray-100 rounded-b-lg flex-col gap-4">
          <div className="card-consult-detail">
            <div className="flex flex-1 items-center  flex-col">
              <div className="w-36 h-36 rounded-full overflow-hidden mb-4 outline-amber-500  outline-offset-2 outline-2">
                <Image
                  src={url || "/image/noImage.png"}
                  alt=""
                  width={150}
                  height={150}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-200"
                />
              </div>
              <div className="text-xl font-bold ">{detail?.name}</div>
              <div className=" text-gray-400 ">@{detail?.username}</div>
            </div>
            <div className="flex flex-1   flex-col">
              <div className="flex p-2 bg-gradient-to-r bg-yellow-500 via-amber-300 to-amber-100 rounded-lg shadow-md mb-2 text-gray-700 font-semibold items-center gap-2 text-xl">
                <Mail
                  size={36}
                  className=" text-amber-500 bg-amber-50 rounded-full p-1"
                />
                Contract Information
              </div>
              <div className="flex  gap-2 ">
                <div className="bg-white p-4 rounded-lg shadow-lg  gap-2  flex flex-1 items-center">
                  <Phone
                    size={28}
                    className=" text-green-500 bg-green-200 p-1 rounded-lg"
                  />
                  <div>{detail?.phone}</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-lg  gap-2  flex flex-1 items-center">
                  <Mail
                    size={28}
                    className=" text-red-500 p-1 bg-red-200 rounded-lg"
                  />
                  <div>{detail?.email}</div>
                </div>
              </div>
            </div>
            <div className="flex flex-1  items-end  flex-col gap-2">
              <div className="hover:bg-green-400 hover:text-black  bg-green-300 p-1 px-3 rounded-2xl text-gray-600">
                {detail?.status}
              </div>
              <div
                className={`${
                  user.id === selectedConsultant ? "hidden" : ""
                } flex items-center bg-amber-300 py-1 px-3 rounded-lg shadow-lg text-white hover:bg-amber-500  transition-colors duration-200 cursor-pointer`}
                onClick={handleRequest}
              >
                {isRequestSent?.status}
              </div>
            </div>
          </div>
          <div className="card-consult-detail flex-col gap-4">
            <div className="p-2 rounded-lg bg-gradient-to-r from-yellow-500 via-amber-300 to-[#FEF3E2] text-white text-xl">
              Consultant Port
            </div>
            {detail?.portfolio && detail?.portfolio?.length > 0 ? (
              detail.portfolio.map((item: any, index: number) => (
                <PortCard port={item} key={index} />
              ))
            ) : (
              <div className=" flex flex-col p-6  rounded-lg shadow-lg hover:shadow-amber-200 text-gray-300 bg-white  transition-colors duration-200 cursor-pointer border-t-4 border-amber-300">
                This consultant doesn&apos;t have portfolio{" "}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const ConsultantCard = (prop: any) => {
  const { consultant, setSelectedConsultant } = prop;
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    const cld = new Cloudinary({ cloud: { cloudName: "dlsd9groz" } });
    const img = cld.image(consultant.profile);
    const imgUrl = img.toURL() + `?t=${Date.now()}`;
    setUrl(imgUrl);
  }, [consultant]);
  return (
    <div
      className=" flex flex-col p-6  rounded-lg shadow-lg hover:shadow-amber-200 hover:text-amber-500 bg-white  transition-colors duration-200 cursor-pointer border-t-4 border-amber-300"
      onClick={() => {
        setSelectedConsultant(consultant.id);
      }}
    >
      <div className="rounded-full overflow-hidden w-36 h-36 ">
        <Image
          src={url || "/image/noImage.png"}
          alt=""
          width={150}
          height={150}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-200 "
        />
      </div>
      <div className="flex flex-col items-center mt-4">
        <h2 className="text-xl font-bold ">{consultant.name}</h2>
        <div className="text-gray-700 flex items-center gap-2 ">
          <Phone size={18} className=" text-amber-500" />
          <div>{consultant.phone}</div>
        </div>
        <div className="text-gray-700 flex items-center gap-2 ">
          <Mail size={18} className=" text-amber-500" />
          <div>{consultant.email}</div>
        </div>
      </div>
    </div>
  );
};

const PortCard = (prop: any) => {
  const { port } = prop;
  const [quote, setQuote] = useState<quote>();

  const fetchQuote = async () => {
    try {
      const res = await axios.get(`${config.apiBackend}/port/quote/${port.id}`);
      if (res) {
        setQuote(res.data);
      }
    } catch (error) {
      console.error("Error fetching quote data:", error);
    }
  };

  useEffect(() => {
    if (port) {
      fetchQuote();
    }
  }, []);

  return (
    <div className=" flex flex-col p-6  rounded-lg shadow-lg hover:shadow-amber-200  bg-white  transition-colors duration-200 cursor-pointer border-t-4 border-amber-300 gap-2">
      <div className="">{port?.name}</div>
      {quote?.QuoteInPort && quote?.QuoteInPort?.length > 0 ? (
        <div className="flex gap-2 flex-col">
          {quote.QuoteInPort.map((item: any, index: number) => (
            <QuoteCard key={index} quote={item} order={quote?.Order} />
          ))}
        </div>
      ) : (
        <div className="text-gray-500">No quotes available for this port.</div>
      )}
    </div>
  );
};

const QuoteCard = (prop: any) => {
  const { quote, order } = prop;
  const [allOrderPrice, setOrderPrice] = useState<number>(0);
  const [presentPrice, setPresentPrice] = useState<number>(0);
  const [changePrice, setChangePrice] = useState<number>(0);

  const fetchPrice = async () => {
    try {
      const res = await axios.get(
        `${config.apiBackend}/quote/getDetail/${quote?.quote?.displaySymbol}`
      );

      if (res) {
        setPresentPrice(res.data);
      }
    } catch (error) {
      console.error("Error fetching price data:", error);
    }
  };

  useEffect(() => {
    if (order) {
      const totalPrice = order.reduce((acc: number, item: any) => {
        if (item.quoteId === quote.quoteId) {
          return acc + item.priceToPay;
        }
        return acc;
      }, 0);

      setOrderPrice(totalPrice);
    }
  }, [order]);

  const [percentChange, setPercentChange] = useState<number>(0);

  useEffect(() => {
    if (allOrderPrice) {
      const changePrice =
        presentPrice?.regularMarketPrice * quote?.amountQuote - allOrderPrice;
      setChangePrice(changePrice);
      setPercentChange(
        ((presentPrice?.regularMarketPrice * quote?.amountQuote -
          allOrderPrice) /
          allOrderPrice) *
          100
      );
    }
  }, [allOrderPrice, presentPrice, quote]);

  useEffect(() => {
    if (quote) {
      fetchPrice();
    }
  }, [quote]);

  const isPositive = changePrice >= 0;

  return (
    <div className="flex flex-1 p-4 bg-gray-100 rounded-lg  duration-500 flex-col  hover:shadow-2xl hover:-translate-y-1 border-blue-300 hover:border-1 transition-all  ">
      <div className="flex flex-1 gap-2 ">
        <div className="flex flex-1 flex-col   ">
          <div className="flex">{quote?.quote?.displaySymbol}</div>
          <div className="flex text-xs ">({quote?.quote?.description})</div>
        </div>
        <div className="flex flex-1 justify-end items-start  ">
          <div className="bg-violet-300 py-1 px-3 rounded-lg opacity-70">
            {quote?.quote?.industryType}
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col  p-4 gap-4">
        <div className="grid grid-cols-2 bg-white p-4 gap-4 rounded-lg shadow-lg">
          <div>
            <div>Total Quote </div>
            <div>{quote?.amountQuote}</div>
          </div>
          <div>
            <div>Avg Price </div>
            <div>{quote?.avgPrice}</div>
          </div>
          <div>
            <div>Total Cost </div>
            <div>{allOrderPrice}</div>
          </div>
          <div>
            <div>Current Price </div>
            <div>{((presentPrice?.regularMarketPrice * quote?.amountQuote).toFixed(2)).toString()}</div>
          </div>
        </div>
        <div
          className={`${
            isPositive
              ? "text-green-500 bg-green-200"
              : "text-red-500 bg-red-200"
          }  p-4  rounded-lg shadow-lg flex items-center justify-between`}
        >
          <div className="flex items-center  gap-2 ">
            {isPositive ? (
              <ArrowUp className="bg-green-300 p-1 rounded-full" size={32} />
            ) : (
              <ArrowDown className="bg-red-300 p-1 rounded-full" size={32} />
            )}
            <div>
              <span className="mr-1">
                {isPositive ? "+" : ""}
                {changePrice}
              </span>
              <span>
                ({isPositive ? "+" : ""}
                {percentChange.toFixed(2)}%)
              </span>
            </div>
          </div>
          <div className="text-lg font-semibold">
            {isPositive ? <p>Profit</p> : <p>Loss</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

interface quote {
  id: string;
  portId: string;
  quote: string;
  createdAt: Date;
  updatedAt: Date;
  QuoteInPort?: quote[];
  Order?: quote[];
}
