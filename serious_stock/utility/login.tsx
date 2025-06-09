'use client'
import Image from 'next/image';

export default function LoginPage ({children}:{children : React.ReactNode}){
    return (
        <div className="bg-amber-200 h-screen flex flex-1 items-center justify-center ">
          <div className='flex w-1/2 lg:h-1/2 sm:h3/4'>
            <div className="bg-white  rounded-lg shadow-lg   flex  items-center justify-center  flex-1 ">
              <div className='grid lg:grid-cols-2 sm:grid-cols-1 w-full h-full  '>
                <div className="flex flex-1 items-center justify-center ">
                <Image src="/image/signin.JPG" alt="SignUp" width={300} height={300} />
                </div>
                <div className="flex flex-1 flex-col justify-center items-center p-4 space-y-4 ">
                  {children}
                </div>
              </div>
            </div>
          </div>
        </div>
    )
}