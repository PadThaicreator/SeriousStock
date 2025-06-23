/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { formatDate } from "@/utility/formatTime";
import axios from "axios";
import { Calendar, DollarSign, Hash, Receipt, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function Page() {

    const [selectType, setSelectType] = useState<string>("buy");
    const user = useSelector((state : any) => state?.user?.user);

     const [receipt, setReceipt] = useState<any[]>([]);
     const router = useRouter();

     const fetchReceipt = async () =>{
        try {
            if(!user){
                return router.push("/signin");
            }
            if(selectType === "buy"){
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BACKEND}/order/getOrder/${user.id}`);
                setReceipt(res.data);
            }
            else if(selectType === "sell"){
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BACKEND}/sell/getSellOrder/${user.id}`);
                setReceipt(res.data);
            }
        } catch (error) {
            console.error("Error fetching receipt:", error);
        }
     }

     useEffect(()=>{
         fetchReceipt();
     },[selectType])
  return (
    <div className="flex flex-1 flex-col bg-white p-4 rounded-lg gap-2">
      <div className=" flex  text-xl items-center ">
        <Receipt size={24} className="mr-3" />
        <h1>All Receipt</h1>
      </div>
      <hr />
      {/* select Type */}
      <div className="flex ">
        <div className="grid grid-cols-2 bg-gray-100 gap-3 p-2 rounded-lg items-center">
          <div className={`${selectType === "buy" ?"bg-green-400 shadow-lg rounded-lg  p-2 text-white" : ""}  cursor-pointer`} onClick={()=>{setSelectType("buy")}}>Buy Orders</div>
          <div className={`${selectType === "sell" ?"bg-red-400 shadow-lg rounded-lg  p-2 text-white" : ""} cursor-pointer`}onClick={()=>{setSelectType("sell")}}>Sell Orders</div>
        </div>
      </div>

       {/* Show Receipt */}
       <div className="flex flex-1 flex-col p-2 gap-3 ">
            { receipt.length > 0 ? (
                receipt.map((item , index) => (
                    <OrderCard key={index} order={item} />
                ))
            )
            : 
            (<p>No receipt found.</p>)
            }
       </div>
    </div>
  );
}

const OrderCard = (prop : any) => {
    const { order } = prop;
    
    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Hash className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-gray-600">Order ID</span>
                </div>
                <span className="text-lg font-bold text-gray-900">#{order.id}</span>
            </div>
            
            {/* Main Content */}
            <div className="space-y-4">
                {/* Quote Info */}
                <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">Quote Details</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2">
                            <p className=" text-blue-600 text-xl ">{order.quote.displaySymbol}</p>
                            <p className=" text-blue-600  ">{order.quote.description}</p>
                        </div>
                        <div>
                            <p className="text-xs text-blue-600 uppercase tracking-wide">Amount</p>
                            <p className="text-lg font-semibold text-blue-900">{order.amountQuote}</p>
                        </div>
                        <div>
                            <p className="text-xs text-blue-600 uppercase tracking-wide">Quote Price</p>
                            <p className="text-lg font-semibold text-blue-900">฿{order.priceQuote?.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
                
                {/* Payment Info */}
                <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">Total Payment</span>
                    </div>
                    <p className="text-2xl font-bold text-green-900">฿{order.priceToPay?.toLocaleString()}</p>
                </div>
                
                {/* Date */}
                <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Created:</span>
                    <span className="text-sm font-medium text-gray-900">{formatDate(order.createdAt)}</span>
                </div>
            </div>
        </div>
    );
};

