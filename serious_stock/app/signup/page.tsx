"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

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

const SignUpConsultant = () =>{
  const router = useRouter();
  return(
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
}
