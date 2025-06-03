'use client'

import React, { useEffect } from "react";
import Sidebar from "./sidebar";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";


export default function Layout ({children} : {children : React.ReactNode}){

    const user = useSelector((state: any) => state.user.user);
    const router =  useRouter();

    useEffect(()=>{
        
        if(!user){
            router.push("/signin");
        }
    },[user])
    return(
        <div className="flex flex-1 flex-row ">
            <Sidebar  />
            <div className="p-5  bg-amber-50   flex flex-5  flex-col">
            
                <div className="bg-amber-100 p-5 rounded-lg shadow-lg shadow-gray-500 flex  top-2 border-amber-300 border-2 ">
                    {children}
                </div>
                
            </div>
        </div>
    );
}