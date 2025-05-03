/* eslint-disable @typescript-eslint/no-explicit-any */
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
    const price = await fetchApi(
      `${config.apiBackend}/quote/getDetail/${quote}`
    );
   const res = await fetchApi(`${config.apiBackend}/quote/get/${quote}`)
    if (res && price) {
      setData(res);
      setPrice(price)
    }
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  return (
    <div className="flex flex-col flex-1 overflow-hidden rounded-xl bg-white shadow-lg border border-gray-200">
      {/* Header Section with Gradient */}
      <div className="bg-gradient-to-r from-amber-400 to-amber-600 p-4 h-25">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {data.logo && (
              <img
                src={data.logo}
                alt={`${data.description} logo`}
                className="h-12 w-12 rounded-full bg-white p-1"
              />
            )}
            <div>
              <h3 className="font-bold text-white text-xl">{data.displaySymbol}</h3>
              <p className="text-amber-100 text-sm">{data.description}</p>
            </div>
          </div>
          {data.industryType && (
            <span className="bg-white px-3 py-1 rounded-full text-xs font-medium text-amber-700 shadow-sm">
              {data.industryType}
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
                price.regularMarketPrice || "" ? "text-green-600" : "text-red-600"
              }`}
            >
              ${price.regularMarketPrice?.toFixed(2) || "N/A"}
            </span>
            {price.regularMarketChangePercent && (
              <div
                className={`flex items-center ${
                  price.regularMarketChangePercent ? "text-green-600" : "text-red-600"
                } text-sm`}
              >
                {price.dp ? (
                  <TrendingUp size={16} />
                ) : (
                  <TrendingDown size={16} />
                )}
                <span className="ml-1">{price.regularMarketChangePercent?.toFixed(2)}%</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex flex-col rounded-lg bg-gray-50 p-2 shadow-md">
            <span className="text-gray-500">Previous Close</span>
            <span className="font-medium">
              ${ price.regularMarketPreviousClose?.toFixed(2) || "N/A"}
            </span>
          </div>
          <div className="flex flex-col rounded-lg bg-gray-50 p-2 shadow-md">
            <span className="text-gray-500">Open</span>
            <span className="font-medium">
              ${ price.regularMarketOpen?.toFixed(2) || "N/A"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
