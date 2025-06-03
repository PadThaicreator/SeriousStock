/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { TrendingUp, Home, PieChart, BarChart2, LogOut, BookUser, Newspaper } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';

import { useDispatch } from 'react-redux';
import { logout } from '../redux/userSlice';
import { useEffect, useState } from 'react';
import { Cloudinary } from '@cloudinary/url-gen/index';
import Image from 'next/image';

export default function Sidebar() {
    const router = useRouter();
    const dispatch = useDispatch();
    const  user  = useSelector((state : any) => state?.user?.user);
    const [url, setUrl] = useState<string>("");
    const Logout = () =>{
        
        router.push("/signin")
        dispatch(logout())
    }

    useEffect(() => {
    if (user.profile) {
      const cld = new Cloudinary({ cloud: { cloudName: "dlsd9groz" } });
      const img = cld.image(user?.profile);
      const imgUrl = img.toURL() + `?t=${Date.now()}`;
      if(user)
        console.log(user)
        setUrl(imgUrl);
    }
  }, [user]);


  
        
  return (
    <div className="flex flex-1 h-screen top-0 sticky bg-gradient-to-b from-amber-100 to-amber-200 flex-col shadow-lg">
      {/* Logo and Header */}
      <div className="p-4 border-b border-amber-300">
        <h1 className="text-center text-xl font-bold flex items-center justify-center text-amber-800">
          <TrendingUp className="mr-2 text-amber-600" size={20} />
          Serious Stock
        </h1>
      </div>
      
      {/* Navigation Menu */}
      <div className="flex-1 px-3 py-6">
        <nav className="space-y-2">
          <button className="sidebtn" onClick={()=>router.push("/homepage/home")}>
            <Home size={18} className="mr-3" />
            Home
          </button>

          <button className="sidebtn" onClick={()=>router.push("/homepage/news")}>
            <Newspaper size={18} className="mr-3" />
            InvestNews
          </button>
          
          <button className="sidebtn" onClick={()=>router.push("/homepage/market")}>
            <BarChart2 size={18} className="mr-3" />
            Markets
          </button>
          
          <button className="sidebtn" onClick={()=>router.push("/homepage/portfolio")}>
            <PieChart size={18} className="mr-3" />
            Portfolio
          </button>
          
          <button className="sidebtn" onClick={()=>router.push("/homepage/consultant")}>
            <BookUser size={18} className="mr-3" />
             Consultant
          </button>
        </nav>
      </div>
      
      {/* User Profile */}
      <div className="flex  bottom-0 mb-10 p-2 w-full cursor-pointer" onClick={()=>router.push("/homepage/user")}>
        <div className="bg-white bg-opacity-80 flex items-center p-3 rounded-lg shadow-sm border border-amber-300 gap-4">
          <div className="bg-amber-500 text-white rounded-full   w-15 h-15 items-center justify-center font-bold outline-3 outline-amber-300 overflow-hidden relative">
            <Image 
              src={url || "/image/noImage.png"}
              alt="User Profile"
              width={150}
              height={150}
              className="rounded-full object-cover w-full h-full"
            />
          </div>
          <div className="flex-1">
            <div className="font-medium text-amber-900">{user.name || 'Guest'}</div>
            
          </div>
          <button className="p-2 rounded-full hover:bg-amber-200 text-amber-700 cursor-pointer" onClick={(e)=>{
            e.stopPropagation();
            Logout()
            }}>
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}