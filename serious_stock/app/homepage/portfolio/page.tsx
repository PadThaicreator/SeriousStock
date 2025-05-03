/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart2,
  Briefcase,
  Plus,
  Save,
  ChevronDown,
  ChevronUp,
  Percent,
} from "lucide-react";
import Modal from "@/utility/modal";
import { useSelector } from "react-redux";
import axios from "axios";
import { config } from "@/app/config";
import Swal from "sweetalert2";
import LoadingPage from "@/utility/loading";

interface itemProps  {
  id : string,
  name : string
}
export default function Page() {
  const [isShow, setShow] = useState(false);
  const [portName, setPortName] = useState("");
  const {  user } = useSelector((state :any) => state.user);
  const [description, setDescription] = useState("");
  const [port , setPort] = useState([])

  const reasons = [
    "To earn extra income",
    "To save for the future",
    "To prepare for retirement",
    "To build long-term wealth",
    "To build short-term wealth",
    "To learn about investing",
  ];
  const [reasonPort, setReseansonPort] = useState(reasons[0]);
  const fetchPort = async () =>{
    try {
      const res = await axios.get(`${config.apiBackend}/user/port/${user.id}`)
      if(res)
        setPort(res.data.portfolio)
    } catch (error : any) {
      Swal.fire({
                              title: "Error!",
                              text: error.message,
                              icon: "warning",
                              timer: 2000,
                            });
    }
  }

  useEffect(()=>{
    fetchPort();
  },[])

  const handleOpen = () => {
    setShow(true);
  };
  const handleClose = () => {
    setShow(false);
    clearForm();
  };

  const clearForm = () => {
    setPortName("");
    setReseansonPort(reasons[0]);
    setDescription("");
  };
  const handleSave =async () => {
    try {
      const payload = {
        name: portName,
        reason: reasonPort,
        description: description,
       
        status: "pending",
        userId : user.id
      };
  
      await axios.post(`${config.apiBackend}/port/create` , payload) 
      Swal.fire({
                title: "Sign Up Success!",
                text: "successfully SignUp",
                icon: "success",
                timer: 2000,
              });
      fetchPort();
      handleClose();
    } catch (error : any) {
      Swal.fire({
                title: "Error!",
                text: error.message,
                icon: "warning",
                timer: 2000,
              });
    }
  };
  return (
    <div className="flex flex-1 flex-col gap-6 bg-gray-50 p-6">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">My Portfolios</h1>
        <div className="flex items-center gap-4">
          <button
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded-lg transition-colors"
            onClick={handleOpen}
          >
            <Plus size={18} />
            <span>Add Portfolio</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1 flex-col bg-white shadow-lg rounded-xl overflow-hidden ">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 ">
          <div className="flex items-center gap-2">
            <BarChart2 className="text-amber-500" size={24} />
            <h2 className="text-2xl font-semibold text-gray-800">
              Portfolio Overview
            </h2>
          </div>
          <div className="text-sm font-medium text-gray-500">
            Last updated: April 25, 2025
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
          {port.map((item : itemProps)=>(
            <PortDashboard key={item.id}
            name={item.name}
            portId = {item.id}
            
          />
          ))}
          
          
        </div>
      </div>

      <div className="flex flex-col bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="flex   flex-1 flex-col ">
          <div className="flex items-center gap-2  flex-1  text-amber-500 px-6 py-4 border-b border-gray-200">
            <Briefcase className="text-amber-500 " size={24} />
            <h2 className="text-2xl font-semibold text-black ">
              All Portfolio
            </h2>
          </div>
          <div className="flex flex-1  px-6 py-4 flex-col gap-4">
          {port.map((item : itemProps)=>(
            <PortCard key={item.id}
            port={item}
          />
          ))}
          </div>
        </div>
      </div>
      <Modal title="New Portfolio" isOpen={isShow} onClose={handleClose}>
        <div className="flex flex-1 flex-col gap-3">
          <div>
            <p>Portfolio Name</p>
            <input
              type="text"
              className="input"
              value={portName}
              onChange={(e) => setPortName(e.target.value)}
            />
          </div>
          <div>
            <p className="block mb-2 text-sm font-medium text-gray-700">
              Reason for opening a portfolio
            </p>
            <select
              value={reasonPort}
              onChange={(e) => setReseansonPort(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              {reasons.map((reason, index) => (
                <option key={index} value={reason}>
                  {reason}
                </option>
              ))}
            </select>
          </div>
          <div>
            <p>Description</p>
            <textarea
              className="input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="flex flex-1 justify-center items-center">
            <button className="btn " onClick={handleSave}>
              <Save className="mr-2" />
              Save
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

interface Quote {
  id: string;
  quoteId: string;
  amountQuote: number;
  avgPrice: number;
  portId: string;
}
interface Order{
  priceQuote : number;
  amountQuote : number;
  priceToPay : number;

}
interface PortProps {
  QuoteInPort: Quote[];
  Order : Order[];
}

const PortDashboard = ({ name, portId  }: any) => {
  const [loading , setLoading] = useState<boolean>(false)
  const [isHovered, setIsHovered] = useState(false);
  const [port , setPort] = useState<PortProps>();
  const [quoteCost , setQuoteCost] = useState(0);
  const [presentPrice , setPresentPrice] = useState(0);
  const [percent , setPercent] = useState<number>(0);
  const [quoteDetail , setQuoteDetail] = useState();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
      maximumFractionDigits: 2,
    }).format(value);
  };

  const fetchPortData = async()=>{
    try {
      
      const res = await axios.get(`${config.apiBackend}/port/quote/${portId}`)
      

      if(res){
        setPort(res.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const calQuoteOrder = async () => {
    if (!port) return;
  
    try {
      const priceList = await Promise.all(
        port.Order.map(async (item: Order) => {
         
            return item.priceToPay ;
          
          
        })
      );
  
      const totalPrice = priceList.reduce((acc, val) => acc + val, 0);
      setQuoteCost(totalPrice);
    } catch (err) {
      console.error("Error calculating present price:", err);
    }
  };
  

  const calPresentPrice = async () => {
    if (!port) return;
  
    try {
      const priceList = await Promise.all(
        port.QuoteInPort.map(async (item: Quote) => {
          const q = await axios.get(`${config.apiBackend}/quote/getDetailById/${item.quoteId}`);
          if (q.data) {
            return item.amountQuote * q.data.postMarketPrice;
          }
          return 0;
        })
      );
  
      const totalPrice = priceList.reduce((acc, val) => acc + val, 0);
      setPresentPrice(totalPrice);
    } catch (err) {
      console.error("Error calculating present price:", err);
    }
  };

  useEffect(()=>{
    setLoading(false)
    setPercent((quoteCost-presentPrice)/presentPrice*100)
  },[presentPrice , quoteCost])

  useEffect(()=>{
    setLoading(true)
    calPresentPrice();
    calQuoteOrder();
    
    
  },[port])

  useEffect(()=>{
    fetchPortData();
  },[])

  const positive = percent > 0 

  if(loading){
    return <LoadingPage />
  }
  return (
    <div
      className={`flex flex-col rounded-xl p-6 shadow-md transition-all duration-300 ${
        isHovered ? "transform scale-105" : ""
      } ${
        positive
          ? "bg-gradient-to-br from-amber-400 to-amber-600"
          : "bg-gradient-to-br from-gray-600 to-gray-800"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-between items-center mb-4">
        <div className="text-lg font-bold text-white">{name}</div>
        <div
          className={`p-2 rounded-full ${
            positive ? "bg-amber-300" : "bg-gray-500"
          }`}
        >
          <DollarSign size={16} className="text-white" />
        </div>
      </div>

      <div className="text-2xl font-bold text-white mb-2">
        {formatCurrency(presentPrice)} 
        <p className="text-xs">( {formatCurrency(quoteCost)} )</p>
      </div>

      <div className="flex items-center mb-4">
        {positive ? (
          <TrendingUp size={18} className="text-green-300 mr-1" />
        ) : (
          <TrendingDown size={18} className="text-red-300 mr-1" />
        )}
        <span className={positive ? "text-green-300" : "text-red-300"}>
          {positive ? "+" : "-"}
          {Math.abs(Number(percent.toFixed(2)))}%
        </span>
      </div>

    </div>
  );
};


const PortCard = (prop : any) => {
  const { port } = prop;
  const [showDetail, setShownDetail] = useState(false);
  const handleOpenDetail = () => {
    setShownDetail(true);
  };
  const handleCloseDetail = () => {
    setShownDetail(false);
  };
  return (
    <div className="flex flex-1 flex-col gap-1 hover:shadow-xl hover:duration-400">
      <div className="flex flex-1 border p-4 rounded-lg shadow-md bg-white  justify-between items-center">
        <div>{port.name}</div>
        <div>{port.reason}</div>
        <div className="flex gap-2 items-center justify-center">
          <TrendingUp />
          <div>2.5%</div>
          {!showDetail && (<ChevronDown
            className="cursor-pointer hover:bg-gray-300 rounded-full p-2 "
            size={32}
            onClick={handleOpenDetail}
          />)}
          {showDetail && (<ChevronUp
            className="cursor-pointer hover:bg-gray-300 rounded-full p-2 "
            size={32}
            onClick={handleCloseDetail}
          />)}
        </div>
        
      </div>
      <PortDetail
          handleCloseDetail={handleCloseDetail}
          showDetail={showDetail}
        />
    </div>
  );
};
interface PortDetailProps {
  handleCloseDetail: () => void;
  showDetail: boolean;
}
const PortDetail = (prop: PortDetailProps) => {
  const { handleCloseDetail, showDetail } = prop;
  if (!showDetail) return null;
  return (
    <div className="flex flex-1 bg-amber-200 p-4 rounded-b-md ">
      Detail
      <button onClick={handleCloseDetail}>Close</button>
    </div>
  );
};
