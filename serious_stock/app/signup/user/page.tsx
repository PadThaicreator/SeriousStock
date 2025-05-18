"use client";
import axios from "axios";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { config } from "../../config";
import Swal from "sweetalert2";
import LoginPage from "@/utility/login";
import LoadingPage from "@/utility/loading";

export default function Page() {
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const getAllUser = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${config.apiBackend}/user/getall`);

        if (res) {
          setUser(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getAllUser();
  }, []);

  useEffect(() => {
    console.log(user);
    setLoading(false);
  }, [user]);

  if (loading) {
    return <LoadingPage />;
  }
  return (
    <LoginPage>
      <div>
        <SignUpUser user={user} />
      </div>
    </LoginPage>
  );
}

const SignUpUser = (prop: any) => {
  const { user } = prop;
  const router = useRouter();
  const [name, setName] = useState<string>();
  const [username, setUsername] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [conPass, setConPass] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [phone, setPhone] = useState<string>();
  const handleCreate = async () => {
    try {
      if (!name || !username || !password || !conPass || !email || !phone) {
        Swal.fire({
          title: "Please Check!",
          text: "Enter All Information",
          icon: "warning",
          timer: 2000,
        });
        return;
      }

      if (password != conPass) {
        Swal.fire({
          title: "Please Check!",
          text: "Password Not Match",
          icon: "warning",
          timer: 2000,
        });
        return;
      }

      const isUsernameDuplicate = user.some(
        (item: User) => item.username === username
      );
      if (isUsernameDuplicate) {
        Swal.fire({
          title: "Error!",
          text: "Username already exists",
          icon: "warning",
          timer: 2000,
        });
        return;
      }

      const isEmailDuplicate = user.some((item: User) => item.email === email);
      if (isEmailDuplicate) {
        Swal.fire({
          title: "Error!",
          text: "Email already exists",
          icon: "warning",
          timer: 2000,
        });
        return;
      }

      // เช็คเบอร์โทร 10 หลัก
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(phone)) {
        Swal.fire({
          title: "Invalid Phone Number",
          text: "Phone number must be exactly 10 digits",
          icon: "warning",
          timer: 2000,
        });
        return;
      }

      const payload = {
        name: name,
        username: username,
        password: password,
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
        title: " Failed",
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
          maxLength={10}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d*$/.test(value) && value.length <= 10) {
              setPhone(value);
            }
          }}
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
          onClick={() => router.push("/signin")}
        >
          Cancel
        </button>
        <button
          className="mt-4 bg-amber-400 hover:bg-amber-500 text-white font-bold py-2 px-6 rounded-lg shadow-lg"
          onClick={handleCreate}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  username: string;
  password: string;
  type: "user" | "admin" | "consultant"; // ขึ้นอยู่กับระบบคุณมี type อะไรบ้าง
  status: "active" | "inactive";
  doc: string | null;
  createdAt: string | null;
}
