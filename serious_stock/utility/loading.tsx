import React from "react";

const LoadingPage = () => {
  return (
    <div className="flex flex-1 items-center justify-center h-screen bg-black-100/100">
        <div className="h-screen flex items-center justify-center flex-col gap-3">
            <div className="animate-spin h-24 w-24 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            <div> Please Wait For Loading</div>
        </div>

    </div>
  );
};

export default LoadingPage;