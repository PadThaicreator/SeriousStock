/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";


import axios from "axios";
import {  Receipt } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { SellCard } from "./component/sellCard";
import { OrderCard } from "./component/buyCard";

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
       { selectType === "buy" && (
        <div className="flex flex-1 flex-col  gap-3 ">
            { receipt.length > 0 ? (
                receipt.map((item , index) => (
                    <OrderCard key={index} order={item} />
                ))
            )
            : 
            (<p>No receipt found.</p>)
            }
       </div>
       )}
       { selectType === "sell" && (
        <div className="flex flex-1 flex-col  gap-3 ">
            { receipt.length > 0 ? (
                receipt.map((item , index) => (
                    <SellCard key={index} order={item} />
                ))
            )
            : 
            (<p>No receipt found.</p>)
            }
       </div>
       )}
    </div>
  );
}
