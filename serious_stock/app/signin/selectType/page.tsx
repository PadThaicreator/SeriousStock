'use client'

import LoginPage from "@/utility/login";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserIcon, BriefcaseIcon, ArrowRightIcon } from "lucide-react";

export default function Page() {
  const router = useRouter();
  const [role, setRole] = useState<string>("");
  
  const NextPage = () => {
    if (role === "user") {
      router.push("/signup/user");
    } else if (role === "consultant") {
      router.push("/signup/consultant");
    }
  };
  
  return (
    <LoginPage>
      <div className="w-full max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Select Role</h2>
        
        <div className="space-y-6 mb-8">
          <div 
            className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
              role === "user" ? "border-amber-500 bg-amber-50" : "border-gray-200 hover:border-amber-300"
            }`}
            onClick={() => setRole("user")}
          >
            <div className={`w-10 h-10 mr-4 rounded-full flex items-center justify-center ${
              role === "user" ? "bg-amber-500 text-white" : "bg-gray-100 text-gray-500"
            }`}>
              <UserIcon size={20} />
            </div>
            <div className="flex-1">
              <div className="font-medium">User</div>
              <div className="text-sm text-gray-600">สำหรับผู้ที่ต้องการใช้บริการจากที่ปรึกษา</div>
            </div>
            <input 
              type="radio" 
              name="role" 
              checked={role === "user"} 
              onChange={() => setRole("user")} 
              className="h-5 w-5 text-amber-600"
            />
          </div>
          
          <div 
            className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
              role === "consultant" ? "border-amber-500 bg-amber-50" : "border-gray-200 hover:border-amber-300"
            }`}
            onClick={() => setRole("consultant")}
          >
            <div className={`w-10 h-10 mr-4 rounded-full flex items-center justify-center ${
              role === "consultant" ? "bg-amber-500 text-white" : "bg-gray-100 text-gray-500"
            }`}>
              <BriefcaseIcon size={20} />
            </div>
            <div className="flex-1">
              <div className="font-medium">Consultant</div>
              <div className="text-sm text-gray-600">สำหรับผู้เชี่ยวชาญที่ต้องการให้คำปรึกษา</div>
            </div>
            <input 
              type="radio" 
              name="role" 
              checked={role === "consultant"} 
              onChange={() => setRole("consultant")} 
              className="h-5 w-5 text-amber-600"
            />
          </div>
        </div>
        
        <button 
          className={`w-full py-3 px-4 flex items-center justify-center gap-2 rounded-md transition-all ${
            role ? "bg-amber-600 text-white hover:bg-amber-700" : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`} 
          onClick={NextPage}
          disabled={!role}
        >
          ดำเนินการต่อ
          <ArrowRightIcon size={16} />
        </button>
      </div>
    </LoginPage>
  );
}