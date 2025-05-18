'use client'
import Image from 'next/image';

export default function LoginPage ({children}:{children : React.ReactNode}){
    return (
        <div className="bg-amber-200 h-screen flex items-center justify-center">
          <div className="bg-white w-3/4 h-3/4 rounded-lg shadow-lg grid grid-cols-2 ">
            <div className="flex items-center justify-center">
              <Image src="/image/signin.JPG" alt="SignUp" width={300} height={300} />
            </div>
            <div className="flex flex-col justify-center px-8 space-y-4 ">
              {children}
            </div>
          </div>
        </div>
    )
}