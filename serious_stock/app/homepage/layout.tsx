import React from "react";
import Sidebar from "./sidebar";


export default function Layout ({children} : {children : React.ReactNode}){
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