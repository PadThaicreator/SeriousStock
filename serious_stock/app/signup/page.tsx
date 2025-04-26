"use client";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { config } from "../config";
import Swal from "sweetalert2";

export default function Page() {
  return (
    <div className="bg-amber-200 h-screen flex items-center justify-center">
      <div className="bg-white w-3/4 h-3/4 rounded-lg shadow-lg grid grid-cols-2 ">
        <div className="flex items-center justify-center">
          <Image
            src="/image/signin.JPG"
            alt="SignUp"
            width={300}
            height={300}
          />
        </div>
        <div className="flex flex-col justify-center px-8 space-y-4 ">
          <SignUpUser />
        </div>
      </div>
    </div>
  );
}

const SignUpUser = () => {
  const router = useRouter();
  const [name, setName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [conPass, setConPass] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const handleCreate = async () => {
    try {
      

      if(password != conPass){
        Swal.fire({
          title: "Error!",
          text: "Password Not Match",
          icon: "warning",
          timer: 2000,
        });
        return;
      }

      const payload = {
        name: name,
        username: username,
        password : password,
        email: email,
        phone: phone,
        status: "active",
        type: "user",
      };
      const response = await axios.post(
        `${config.apiBackend}/user/create`,
        payload
      );
      if (response) {
        
        Swal.fire({
          title: "Sign Up Success!",
          text: "successfully SignUp",
          icon: "success",
          timer: 2000,
        });
        router.push("/signin");
      } else {
        Swal.fire({
          title: "Error!",
          text: "Already have user !!!",
          icon: "warning",
          timer: 2000,
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Login Failed",
        text: "error for sign up",
        icon: "warning",
      });
      console.log(error);
    }
  };
  return (
    <div>
      <div>
        <label className="block mb-1 font-semibold">Name</label>
        <input
          type="text"
          className="input"
          placeholder="Enter name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label className="block mb-1 font-semibold">Username</label>
        <input
          type="text"
          className="input"
          placeholder="Enter Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label className="block mb-1 font-semibold">Email</label>
        <input
          type="text"
          className="input"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label className="block mb-1 font-semibold">Phone Number</label>
        <input
          type="text"
          className="input"
          placeholder="Enter Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>
      <div>
        <label className="block mb-1 font-semibold">Password</label>
        <input
          type="password"
          className="input"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div>
        <label className="block mb-1 font-semibold">Confirm Password</label>
        <input
          type="password"
          className="input"
          placeholder="Enter Confirm Password"
          value={conPass}
          onChange={(e) => setConPass(e.target.value)}
        />
      </div>

      <div className="flex flex-row gap-5 items-center justify-center">
        <button
          className="mt-4 bg-white border hover:bg-gray-200 text-amber-400 font-bold py-2 px-6 rounded-lg shadow-lg "
          onClick={()=>router.push('/signin')}
        >
          Cancel
        </button>
        <button className="mt-4 bg-amber-400 hover:bg-amber-500 text-white font-bold py-2 px-6 rounded-lg shadow-lg" onClick={handleCreate}>
          Sign Up
        </button>
      </div>
    </div>
  );
};

const SignUpConsultant = () => {
  const router = useRouter();
  return (
    <div>
      <div>
        <label className="block mb-1 font-semibold">Username</label>
        <input type="text" className="input" placeholder="Enter Username" />
      </div>
      <div>
        <label className="block mb-1 font-semibold">Email</label>
        <input type="text" className="input" placeholder="Enter Username" />
      </div>
      <div>
        <label className="block mb-1 font-semibold">Phone Number</label>
        <input type="text" className="input" placeholder="Enter Username" />
      </div>
      <div>
        <label className="block mb-1 font-semibold">Password</label>
        <input type="password" className="input" placeholder="Enter Password" />
      </div>
      <div>
        <label className="block mb-1 font-semibold">Confirm Password</label>
        <input type="password" className="input" placeholder="Enter Password" />
      </div>
      <div className="flex flex-row gap-5 items-center justify-center">
        <button
          className="mt-4 bg-white border hover:bg-gray-200 text-amber-400 font-bold py-2 px-6 rounded-lg shadow-lg "
          onClick={() => router.push("/signin")}
        >
          Cancel
        </button>
        <button className="mt-4 bg-amber-400 hover:bg-amber-500 text-white font-bold py-2 px-6 rounded-lg shadow-lg">
          Sign Up
        </button>
      </div>
    </div>
  );
};
