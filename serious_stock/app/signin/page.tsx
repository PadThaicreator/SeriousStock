"use client";
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { config } from '../config';
import Swal from 'sweetalert2';


import { useDispatch } from 'react-redux';
import { setUser } from '../redux/userSlice';

export default function Page() {
    const router = useRouter();
    const dispatch = useDispatch();
    const [ username , setUsername] = useState("");
    const [ password , setPassword] = useState("");
    const handleSave = async () =>{
        try {
          const payload = {
            username : username,
            password : password
        }
        const res = await axios.post(`${config.apiBackend}/user/signin` , payload)
        if(res){
         
          localStorage.setItem("token", res.data.token);
          dispatch(setUser({token : res.data.token ,user : res.data.user}))
          Swal.fire({
                  title: "Successfully",
                  text: "Sign In Success!",
                  icon: "success",
                  timer: 2000,
                });
          router.push("/homepage/home")
        }
        } catch (error) {
          Swal.fire({
                  title: "Login Failed",
                  text: "Invalid Username Or Password",
                  icon: "warning",
                });
          console.log(error)
        }
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
            <input type="text" className="input" placeholder='Enter Username' value={username} onChange={(e)=>setUsername(e.target.value)}/>
          </div>
          <div>
            <label className="block mb-1 font-semibold">Password</label>
            <input type="password" className="input"  placeholder='Enter Password' value={password} onChange={(e)=>setPassword(e.target.value)}/>
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
