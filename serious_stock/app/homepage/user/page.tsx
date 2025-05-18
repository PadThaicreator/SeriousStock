"use client";
import axios from "axios";
import { Camera } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function Page() {
  const user = useSelector((state: any) => state.user.user);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [name, setName] = useState<string>(user.name);
  const [username, setUsername] = useState<string>(user.username);
  const [phone, setPhone] = useState<string>(user.phone);
  const [email, setEmail] = useState<string>(user.email);
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [selectedSubDistrict, setSelectedSubDistrict] = useState<string>("");
  
  const [provinceData, setProvinceData] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [subDistricts, setSubDistricts] = useState<any[]>([]);
  const [zipCode, setZipCode] = useState<string>("");







  useEffect(() => {
    axios
      .get(
        "https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province_with_amphure_tambon.json"
      )
      .then((res) => setProvinceData(res.data))
      .catch((err) => console.error("Error fetching provinces", err));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleEdit = () => {
    if (!isEdit) {
      setIsEdit(true);
      return;
    }
  };

  return (
    <div className="flex  flex-col flex-1 items-center">
      <div className="flex  flex-col bg-amber-50 p-4 rounded-lg gap-4 w-200  ">
        <div className=" justify-between flex">
          <p className="bg-amber-300 p-2  text-2xl font-semibold rounded-lg px-6 shadow-lg">
            Profile
          </p>
          <div className="flex gap-2">
            {isEdit && (
              <button className="btn !px-8" onClick={() => setIsEdit(false)}>
                Cancel
              </button>
            )}
            <button className="btn !px-8" onClick={handleEdit}>
              {isEdit ? "Save" : "Edit"}
            </button>
          </div>
        </div>
        <div className="card-profile items-center gap-10">
          <div className="grid grid-cols-4 gap-20 ">
            <div className="flex flex-1  w-50">
              <div className=" flex w-50 h-50 rounded-full bg-white overflow-hidden">
                <Image
                  src={previewUrl || "/image/noImage.png"}
                  alt="Profile Image"
                  width={150}
                  height={150}
                  className="w-full h-full object-cover"
                />
                {isEdit && (
                  <label className="absolute   bg-amber-500 rounded-full p-4 shadow-md cursor-pointer hover:bg-amber-600 transition-colors">
                    <Camera size={20} className="text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4 col-span-3 ">
              <div className="flex flex-col bg-white p-2 rounded-lg shadow-lg col-span-2">
                <p>Name</p>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                  className="input"
                  disabled={!isEdit}
                />
              </div>
              <div className="flex flex-col bg-white p-2 rounded-lg shadow-lg col-span-2">
                <p>Username</p>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                  }}
                  className="input"
                  disabled={!isEdit}
                />
              </div>
              <div className=" col-span-4 p-4  flex flex-col bg-white  rounded-lg shadow-lg">
                Address
                <div className="grid grid-cols-1 gap-4">
                 
                  <div>
                    <p>Province</p>
                    <select
                      disabled={!isEdit}
                      className="input"
                      value={selectedProvince}
                      onChange={(e) => {
                        const code = e.target.value;
                        setSelectedProvince(code);
                        const prov = provinceData.find((p) => p.name_en === code);
                        setDistricts(prov?.amphure || []);
                        setSelectedDistrict("");
                        setSubDistricts([]);
                        setSelectedSubDistrict("");
                        setZipCode("");
                      }}
                    >
                      <option value="">-- Select Province --</option>
                      {provinceData.map((prov) => (
                        <option key={prov.name_en} value={prov.name_en}>
                          {prov.name_en}
                        </option>
                      ))}
                    </select>
                  </div>

                 
                  <div>
                    <p>District</p>
                    <select
                      disabled={!isEdit || !selectedProvince}
                      className="input"
                      value={selectedDistrict}
                      onChange={(e) => {
                        const code = e.target.value;
                        setSelectedDistrict(code);
                        const dist = districts.find((d) => d.name_en === code);
                        setSubDistricts(dist?.tambon || []);
                        setSelectedSubDistrict("");
                        setZipCode("");
                      }}
                    >
                      <option value="">-- Select District --</option>
                      {districts.map((dist) => (
                        <option key={dist.name_en} value={dist.name_en}>
                          {dist.name_en}
                        </option>
                      ))}
                    </select>
                  </div>

                 
                  <div>
                    <p>Sub District</p>
                    <select
                      disabled={!isEdit || !selectedDistrict}
                      className="input"
                      value={selectedSubDistrict}
                      onChange={(e) => {
                        const code = e.target.value;
                        setSelectedSubDistrict(code);
                        const sub = subDistricts.find((s) => s.name_en === code);
                        setZipCode(sub?.zip_code || "");
                      }}
                    >
                      <option value="">-- Select Sub District --</option>
                      {subDistricts.map((sub) => (
                        <option key={sub.name_en} value={sub.name_en}>
                          {sub.name_en}
                        </option>
                      ))}
                    </select>
                  </div>

                  
                  <div>
                    <p>PostCode</p>
                    <input
                      type="text"
                      className="input"
                      disabled
                      value={zipCode}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="card-profile">
          <div>
            <p className="font">Phone Number</p>
            <input
              type="text"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
              }}
              className="input bg-white"
              disabled={!isEdit}
            />
          </div>
        </div>
        <div className="card-profile">
          <div>
            <p className="font">Email</p>
            <input
              type="text"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              className="input bg-white"
              disabled={!isEdit}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
