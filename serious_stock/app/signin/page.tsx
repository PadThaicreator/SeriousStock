'use client'
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Page() {
    const router = useRouter();
    const [ username , setUsername] = useState("");
    const [ password , setPassword] = useState("");
    const handleSave = () =>{
        const payload = {
            username : username,
            password : password
        }

        router.push("/homepage/home")
    }
  return (
    <div className="bg-amber-200 h-screen flex items-center justify-center">
      <div className="bg-white w-3/4 h-3/4 rounded-lg shadow-lg grid grid-cols-2 ">
        <div className="flex items-center justify-center">
          <Image src="/image/signin.JPG" alt="SignUp" width={300} height={300} />
        </div>
        <div className="flex flex-col justify-center px-8 space-y-4 ">
          <div>
            <label className="block mb-1 font-semibold">Username</label>
            <input type="text" className="input" placeholder='Enter Username'/>
          </div>
          <div>
            <label className="block mb-1 font-semibold">Password</label>
            <input type="password" className="input"  placeholder='Enter Password'/>
          </div>
          <button className="mt-4 bg-amber-400 hover:bg-amber-500 text-white font-bold py-2 px-4 rounded-lg mx-45" onClick={handleSave}>
            Sign In
          </button>
          <div className='text-center text-sm p-2'>
            if you don&apos;t have an account ? <span className='ml-2 text-blue-500 cursor-pointer hover:font-semibold' onClick={()=>router.push("/signup")}>SignUp</span>
          </div>
        </div>
      </div>
    </div>
  );
}
