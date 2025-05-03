/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';


export default function Sell (prop : any){
    const { quote } = prop;
    return(
        <div className="bg-red-400 hover:bg-red-600 cursor-pointer flex flex-1 items-center justify-center rounded-lg shadow-lg shadow-red-800  hover:shadow-xl transition-shadow duration-300">
            <p className="text-white text-2xl">Sell</p>
        </div>
    );
}