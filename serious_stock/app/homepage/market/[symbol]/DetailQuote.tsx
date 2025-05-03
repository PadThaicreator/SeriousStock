/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { config } from "@/app/config";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  ArrowUp,
  ArrowDown,
  RefreshCw,
  DollarSign,
  TrendingUp,
  Building,
  Activity,
  AlertCircle,
} from "lucide-react";

export default function DetailQuote(prop: any) {
  const { quote, symbol } = prop;
  const [detail, setDetail] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchQuote = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${config.apiBackend}/quote/get/${symbol}`);
      if (res) {
        setDetail(res.data);
      }
      setError("");
    } catch (error: any) {
      console.log("Error : ", error.message);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
    // Don't add this empty dependency array to avoid infinite loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbol]);

  const isPositive = quote?.regularMarketChangePercent > 0;
  const changeColor = isPositive ? "text-green-600" : "text-red-600";
  const ArrowIcon = isPositive ? ArrowUp : ArrowDown;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("en-US").format(value);
  };

  if (loading) {
    return (
      <div className="flex flex-1 justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row flex-1 gap-4 m-2 ">
      <Box>
        <div className="flex flex-col  flex-1 h-full">
          <div className="flex flex-col  md:flex-row gap-4 mb-4">
            <div className="flex  items-start">
              {detail.logo ? (
                <img
                  src={detail.logo}
                  alt={`${symbol} logo`}
                  className="w-16 h-16 object-contain border-r-2 pr-2"
                  onError={(e) => {
                    e.currentTarget.src = "/api/placeholder/100/100";
                    e.currentTarget.alt = "Logo placeholder";
                  }}
                />
              ) : (
                <div className="w-16 h-16 bg-gray-200 flex items-center justify-center rounded">
                  <Building size={32} className="text-gray-400" />
                </div>
              )}
            </div>
            <div className="flex flex-1 ">
              <div className="flex  gap-2 ">
                <h1 className="text-2xl font-bold">{symbol}</h1>
                <p className="text-gray-600 text-lg">
                  {quote.longName || detail.name}
                </p>
              </div>

              <div className="flex flex-1 gap-2 mt-2 flex-col items-end justify-start  ">
                <div className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">
                  {detail.type}
                </div>

                <div className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                  {detail.industryType}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div className="flex flex-col">
              <p className="text-gray-500 text-sm">Current Price</p>
              <div className="flex items-end gap-2">
                <p className="text-3xl font-bold">
                  {formatCurrency(quote.regularMarketPrice || 0)}
                </p>
                <div className={`flex items-center ${changeColor} mb-1`}>
                  <ArrowIcon size={16} className="mr-1" />
                  <span className="font-medium">
                    {quote.regularMarketChangePercent?.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col">
              <p className="text-gray-500 text-sm">Day Range</p>
              <div className="flex items-center gap-1">
                <span>{formatCurrency(quote.regularMarketDayLow || 0)}</span>
                <div className="flex-1 h-1 bg-gray-200 rounded-full mx-2">
                  <div
                    className="h-1 bg-blue-500 rounded-full"
                    style={{
                      width: `${
                        ((quote.regularMarketPrice -
                          quote.regularMarketDayLow) /
                          (quote.regularMarketDayHigh -
                            quote.regularMarketDayLow)) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
                <span>{formatCurrency(quote.regularMarketDayHigh || 0)}</span>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <button
              onClick={() =>window.location.reload() }
              className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
            >
              <RefreshCw size={14} /> Refresh Data
            </button>
          </div>
        </div>
      </Box>

      <Box>
        <div className="h-full">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Activity size={18} className="mr-2" />  Financial 
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <MetricCard
              title="Market Cap"
              value={formatNumber(quote.marketCap || 0)}
              icon={<DollarSign size={16} className="text-blue-500" />}
            />

            <MetricCard
              title="52 Week High"
              value={formatCurrency(quote.fiftyTwoWeekHigh || 0)}
              icon={<TrendingUp size={16} className="text-green-500" />}
            />

            <MetricCard
              title="52 Week Low"
              value={formatCurrency(quote.fiftyTwoWeekLow || 0)}
              icon={
                <TrendingUp
                  size={16}
                  className="text-red-500 transform rotate-180"
                />
              }
            />

            <MetricCard
              title="Volume"
              value={formatNumber(quote.regularMarketVolume || 0)}
              icon={<Activity size={16} className="text-purple-500" />}
            />

            <MetricCard
              title="P/E Ratio"
              value={quote.trailingPE?.toFixed(2) || "N/A"}
              icon={<AlertCircle size={16} className="text-amber-500" />}
            />

            
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-800 rounded-lg flex items-center">
              <AlertCircle size={16} className="mr-2" />
              {error}
            </div>
          )}
        </div>
      </Box>
    </div>
  );
}

const Box = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-1 rounded-lg shadow-lg bg-white border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
      {children}
    </div>
  );
};

const MetricCard = (prop: any) => {
  const { title, value, icon } = prop;
  return (
    <div className={`bg-gray-50 p-3 rounded-lg ${title === "Market Cap" ? "row-span-2" : ""}`}>
      <div className="flex items-center gap-1 text-gray-500 text-xs mb-1">
        {icon}
        {title}
      </div>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  );
};
