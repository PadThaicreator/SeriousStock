'use client'
import Image from 'next/image';

export default function LoginPage ({children}:{children : React.ReactNode}){
    return (
        <div className="bg-amber-200  flex flex-1 items-center justify-center  min-h-screen  ">
         <div className='flex  md:w-300 md:h-150    '> 
            <div className="bg-white   rounded-lg shadow-lg    flex  items-center justify-center   flex-1 m-4 ">
              <div className='grid md:grid-cols-2 grid-cols-1 w-full h-full   overflow-hidden m-2'>
                <div className="flex flex-1 items-center justify-center ">
                <Image src="/image/signin.JPG" alt="SignUp" width={300} height={300} />
                </div>
                <div className="flex flex-1 flex-col justify-center items-center p-2  ">
                  {children}
                </div>
              </div>
            </div>
          </div> 
        </div>
    )
}