/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import { config } from "@/app/config";
import LoadingPage from "@/utility/loading";
import { fetchApi } from "@/utility/useApi";
import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import { NewsSection } from "./newSection";



interface Symbol {
  displaySymbol: string;
}


export default function Page() {
  const [dataQuotes, setDataQuotes] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await fetchApi(config.apigetAllQoute);
        if (res){
          const sorted = res.sort((a : Symbol, b : Symbol) =>
            a.displaySymbol.localeCompare(b.displaySymbol)
          );
          setDataQuotes(sorted);
        }
      } catch (error) {
        console.log("Error : ", error);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);


  if (loading) {
    return <LoadingPage />;
  }
  return (
    <div className="flex flex-1 flex-col">
      
    
    <div className="border-b flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold text-gray-800 ">Stock</h1>
      <h2 className="text-blue-500  cursor-pointer">See all</h2>
    </div>
      <div className="grid grid-cols-4 gap-3">
        {dataQuotes.slice(0, 8).map((item: object, index) => (
          <QuoteCard key={index} quote={item} />
        ))}
      </div>

      
        <NewsSection />
      
    </div>
  );
}



const QuoteCard = (prop: any) => {
  const [quote, setQuote] = useState<any>({});
  const [quotePrice, setQuotePrice] = useState<any>({});
  const { quote: originalQuote } = prop;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetchApi(`${config.apilgetQoute}${originalQuote.displaySymbol}${config.apiToken}`);
        const price = await fetchApi(`${config.apigetPriceQoute}${originalQuote.displaySymbol}${config.apiToken}`);
        if (res) setQuote(res);
        if (price) setQuotePrice(price);
      } catch (error) {
        console.log("Error: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [originalQuote.displaySymbol]);

  // Calculate price change percentage
  const priceChange = quotePrice.c - quotePrice.pc;
  const changePercentage = quotePrice.pc ? (priceChange / quotePrice.pc) * 100 : 0;
  const isPositive = priceChange >= 0;

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-amber-100 to-amber-200 hover:shadow-xl transition-all duration-300">
      {loading ? (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
        </div>
      ) : (
        <div className="flex p-3">
          <div className="flex-shrink-0 mr-4">
            <div className="bg-white p-2 rounded-lg shadow">
              <img
                src={quote.logo || "/image/noImage.png"}
                alt={`${originalQuote.displaySymbol} logo`}
                className="w-16 h-16 object-contain rounded"
              />
            </div>
          </div>
          
          <div className="flex flex-col flex-grow">
            <div className="flex items-center justify-between">
              <h3 className=" font-bold">{originalQuote.displaySymbol}</h3>
              <span className="text-[0.7rem] font-medium bg-amber-300 px-2 py-1 rounded">{originalQuote.type}</span>
            </div>
            
            <p className="text-gray-700 text-sm mt-1">{originalQuote.description || "N/A"}</p>
            <p className="text-gray-600 text-xs mt-1">{quote.finnhubIndustry || "N/A"}</p>
            
            <div className="mt-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 text-sm">Current:</span>
                <span className="font-bold text-lg">${quotePrice.c?.toFixed(2) || "N/A"}</span>
              </div>
              
              <div className="flex items-center justify-between mt-1">
                <span className="text-gray-600 text-sm">Open:</span>
                <span className="font-medium">${quotePrice.o?.toFixed(2) || "N/A"}</span>
              </div>
              
              <div className={`flex items-center justify-between mt-2 p-1 rounded ${isPositive ? 'bg-green-100' : 'bg-red-100'}`}>
                <div className="flex items-center">
                  {isPositive ? (
                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                  )}
                  <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {priceChange.toFixed(2)} ({changePercentage.toFixed(2)}%)
                  </span>
                </div>
                <span className="text-xs text-gray-500">24h</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


