/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { config } from "@/app/config";
import LoadingPage from "@/utility/loading";
import { fetchApi } from "@/utility/useApi";
import { useEffect, useState } from "react";
import Image from "next/image";
import {  Search, TrendingDown, TrendingUp } from "lucide-react";
import RecommendCard from "./recommend";
import { useRouter } from "next/navigation";

interface Symbol {
  displaySymbol: string;
  description?: string;
  type?: string;
  id : string;
  logo : string;
  industryType :string;
}

export default function Page() {
  const [dataQuotes, setDataQuotes] = useState<Symbol[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<string>("");
  const [OriginalQuote, setOriginalQuote] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await fetchApi(`${config.apiBackend}/quote/getall`);
        if (res) {
          const sorted = res.sort((a: Symbol, b: Symbol) =>
            a.displaySymbol.localeCompare(b.displaySymbol)
          );
          setDataQuotes(sorted);
          setOriginalQuote(sorted);
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

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = dataQuotes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(dataQuotes.length / itemsPerPage);

  const handleSearch = (input: string) => {
    const terms = input.toLowerCase().split(" ").filter(Boolean);
  
    if (terms.length === 0) {
      setDataQuotes(OriginalQuote);
      return;
    }
  
    const filtered = OriginalQuote.filter((quote: { displaySymbol: string; description: string; }) => {
      const symbol = quote.displaySymbol?.toLowerCase() || "";
      const description = quote.description?.toLowerCase() || "";
  
      return terms.every((term) =>
        symbol.includes(term) || description.includes(term)
      );
    });
  
    setDataQuotes(filtered);
  };
  
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col mb-5 bg-white p-4 rounded-lg shadow-lg">
        <div className="text-2xl font-bold text-amber-500 border-b flex flex-1 mb-5">
          Recommend Stock
        </div>
        <div className="flex flex-1 gap-2">
          <RecommendCard quote="AAPL" />
          <RecommendCard quote="TSLA" />
          <RecommendCard quote="MSFT" />
          <RecommendCard quote="NVDA" />
        </div>
      </div>
      <div className="flex flex-1 flex-col bg-white p-4 rounded-lg shadow-lg">
        <div className="border-b flex flex-1 mb-5 text-amber-500">
          <div className="flex flex-1 items-center justify-between mb-2 ">
            <h1 className="text-2xl font-bold text-amber-500">All Stock</h1>

            <div className="flex relative ">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-amber-400" />
              </div>
              <input
                type="text"
                className="text-amber-400 w-64 py-2 pl-10 pr-4  bg-white border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Search Quote..."
                value={filter}
                onChange={(e) =>{ 
                  setFilter(e.target.value)
                  handleSearch(e.target.value)
                }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1">
  {currentItems.map((item) => (
    <StockCard key={item.id} item={item} />
  ))}
</div>

        {/* Pagination Controls */}
        <div className="flex justify-center mt-4 gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="px-3 py-1 bg-amber-300 rounded disabled:opacity-50"
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <span className="flex gap-1 px-3 py-1 bg-white border rounded">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              if (page < 5 || page > totalPages - 5) {
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-2 py-1 rounded ${
                      currentPage === page
                        ? "bg-amber-300 text-white"
                        : "bg-white"
                    }`}
                  >
                    {page}
                  </button>
                );
              } else if (page === 5 && totalPages > 5) {
                return (
                  <span key="dots" className="px-2 py-1 text-gray-400">
                    ...
                  </span>
                );
              }
              return null;
            })}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            className="px-3 py-1 bg-amber-300 rounded disabled:opacity-50"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

const StockCard = ({ item }: { item: Symbol }) => {
  
  const [quoteDetail, setQuoteDetail] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const price = await fetchApi(`${config.apiBackend}/quote/getDetail/${item.displaySymbol}`);
       
        if (price) setQuoteDetail(price);
      } catch (error) {
        console.log("Error: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [item.displaySymbol]);

  if (loading  || !quoteDetail ||!quoteDetail.regularMarketChangePercent ) {
    return <LoadingPage />;
  }


  const isPositive = quoteDetail.regularMarketChangePercent >= 0;

  return (
    <div className="flex flex-1 m-2 p-2 rounded-lg bg-amber-200 shadow-lg" onClick={() => router.push(`/homepage/market/${item.displaySymbol}`)}>
      <div className="flex flex-1">
        <Image
          src={item.logo || "/image/noImage.png"}
          alt={`${item.displaySymbol} logo`}
          width={64}
          height={64}
          className="object-contain rounded"
        />
      </div>
      <div className="flex flex-5 gap-25">
        <div className="flex flex-1 flex-col">
          <div className="font-semibold">{item.displaySymbol}</div>
          <div className="text-gray-400">
            {item.description || "No description"}
          </div>
        </div>
        <div className="flex flex-2">{item.industryType || "N/A"}</div>
        <div className="flex flex-1 items-end justify-start flex-col gap-2">
          <div className="bg-white p-2 rounded-lg shadow-md shadow-amber-300 text-amber-600 text-xs">
            {item.type || "N/A"}
          </div>
          <div className="bg-white p-2 rounded-lg shadow-md shadow-amber-300 text-amber-600 text-xs flex">
            {isPositive ? (
              <TrendingUp className="h-4 w-4 text-green-600 mr-2" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600 mr-2" />
            )}
            {quoteDetail.regularMarketChangePercent.toFixed(2) || 0}%
          </div>
        </div>
      </div>
    </div>
  );
};
