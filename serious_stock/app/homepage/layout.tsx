/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useEffect } from "react";
import Sidebar from "./sidebar";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import socket from "@/utility/socket";


export default function Layout ({children} : {children : React.ReactNode}){

    const user = useSelector((state: any) => state.user.user);
    const router =  useRouter();

    

    useEffect(()=>{
        
        if(!user){
            router.push("/signin");
        }

        socket.emit('join', { userId: user.id });


    },[user])
    return(
        <div className="flex flex-1 flex-col md:flex-row ">
            <div className="flex flex-1 top-0 sticky">
                <Sidebar  />
            </div>
            <div className="md:p-4  bg-amber-50   flex flex-5  flex-col ">
            
                <div className="bg-amber-100 md:p-5 md:rounded-lg md:shadow-lg shadow-gray-500 flex flex-1  border-amber-300 border-2 ">
                    {children}
                </div>
                
            </div>
        </div>
    );
}