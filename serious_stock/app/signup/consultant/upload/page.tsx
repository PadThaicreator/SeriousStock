/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import LoginPage from "@/utility/login";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import Swal from "sweetalert2";
import { config } from "@/app/config";
import { 
  Upload, 
  FileText, 
  XCircle, 
  Loader2, 
  CheckCircle2 
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function Page() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const sign = useSelector((state: any) => state.user.sign);
  
  const router = useRouter();

  useEffect(() => {
    console.log("sign from redux:", sign);
  }, [sign]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileUpload = async () => {
    if (!file) {
      Swal.fire({
        icon: 'warning',
        title: 'No file selected',
        text: 'Please select a file before uploading.',
      });
      return;
    }
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("user", sign.name);

    try {
      setIsUploading(true);
      const response = await axios.post(`${config.apiBackend}/upload/approve`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      await axios.post(`${config.apiBackend}/user/create` , sign)
      // const result = response.data;
      // console.log("Upload result:", result);
      
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'SignUp Successfully.',
      });
      
      // Reset file input
      setFile(null);
    } catch (error) {
      console.error("Error uploading file:", error);
      
      Swal.fire({
        icon: 'error',
        title: 'Upload Failed',
        text: 'There was an error uploading your file. Please try again.',
      });
    } finally {
      setIsUploading(false);
      router.push("/")
    }
  };

  return (
    <LoginPage>
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <FileText className="mr-3 text-blue-600" />
          Upload Document for Approval
        </h1>
        
        <div 
          className={`border-2 border-dashed rounded-lg p-8 text-center mb-6 
          ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'} 
          ${file ? 'bg-green-50 border-green-300' : ''} 
          cursor-pointer transition-colors duration-300`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => document.getElementById('fileInput')?.click()}
        >
          <input
            type="file"
            id="fileInput"
            onChange={handleFileChange}
            className="hidden"
          />
          
          <div className="flex flex-col items-center">
            {file ? (
              <CheckCircle2 className="h-16 w-16 mb-4 text-green-500" />
            ) : (
              <Upload className="h-16 w-16 mb-4 text-gray-400" />
            )}
            
            {file ? (
              <div>
                <p className="font-medium text-green-600">File selected:</p>
                <p className="text-gray-600 mt-1 truncate max-w-xs">{file.name}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            ) : (
              <div>
                <p className="font-medium text-gray-700">
                  Drag and drop your file here or click to browse
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Supported formats: PDF, JPG, PNG
                </p>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          {file && (
            <button 
              className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center"
              onClick={(e) => {
                e.stopPropagation();
                setFile(null);
              }}
            >
              <XCircle className="h-4 w-4 mr-1" />
              Remove file
            </button>
          )}
          
          <button 
            className={`px-6 py-2 rounded-md text-white font-medium ml-auto
            ${isUploading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} 
            transition-colors duration-300 flex items-center`}
            onClick={handleFileUpload}
            disabled={isUploading || !file}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-1" />
                <span>Upload</span>
              </>
            )}
          </button>
        </div>
      </div>
    </LoginPage>
  );
}