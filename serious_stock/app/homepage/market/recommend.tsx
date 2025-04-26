"use client";

import { config } from "@/app/config";
import { fetchApi } from "@/utility/useApi";
import { TrendingDown, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

export default function RecommendCard(prop: any) {
  const { quote } = prop;
  const [data, setData] = useState<any>({});
  const [price, setPrice] = useState<any>({});
  const fetchInfo = async () => {
    const res = await fetchApi(
      `${config.apilgetQoute}${quote}${config.apiToken}`
    );
    const prices = await fetchApi(
      `${config.apigetPriceQoute}${quote}${config.apiToken}`
    );

    if (res && price) {
      setData(res);
      setPrice(prices);
    }
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  return (
    <div className="flex flex-col flex-1 overflow-hidden rounded-xl bg-white shadow-lg border border-gray-200">
      {/* Header Section with Gradient */}
      <div className="bg-gradient-to-r from-amber-400 to-amber-600 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {data.logo && (
              <img
                src={data.logo}
                alt={`${data.name} logo`}
                className="h-12 w-12 rounded-full bg-white p-1"
              />
            )}
            <div>
              <h3 className="font-bold text-white text-xl">{data.ticker}</h3>
              <p className="text-amber-100 text-sm">{data.name}</p>
            </div>
          </div>
          {data.finnhubIndustry && (
            <span className="bg-white px-3 py-1 rounded-full text-xs font-medium text-amber-700 shadow-sm">
              {data.finnhubIndustry}
            </span>
          )}
        </div>
      </div>

      {/* Price Information */}
      <div className="p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-gray-500 text-sm font-medium">
            Current Price
          </span>
          <div className="flex items-center space-x-1">
            <span
              className={`text-xl font-bold ${
                price.dp ? "text-green-600" : "text-red-600"
              }`}
            >
              ${price.c ? price.c.toFixed(2) : "N/A"}
            </span>
            {price.dp !== undefined && (
              <div
                className={`flex items-center ${
                  price.dp ? "text-green-600" : "text-red-600"
                } text-sm`}
              >
                {price.dp ? (
                  <TrendingUp size={16} />
                ) : (
                  <TrendingDown size={16} />
                )}
                <span className="ml-1">{Math.abs(price.dp).toFixed(2)}%</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex flex-col rounded-lg bg-gray-50 p-2 shadow-md">
            <span className="text-gray-500">Previous Close</span>
            <span className="font-medium">
              ${price.pc ? price.pc.toFixed(2) : "N/A"}
            </span>
          </div>
          <div className="flex flex-col rounded-lg bg-gray-50 p-2 shadow-md">
            <span className="text-gray-500">Open</span>
            <span className="font-medium">
              ${price.o ? price.o.toFixed(2) : "N/A"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
