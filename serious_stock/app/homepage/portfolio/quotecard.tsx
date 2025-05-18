'use client'


/* eslint-disable @typescript-eslint/no-explicit-any */
import { config } from "@/app/config";
import LoadingPage from "@/utility/loading";
import axios from "axios";
import { DollarSign, TrendingUp, TrendingDown, BarChart2 } from "lucide-react";
import { useEffect, useState } from "react";

interface QuoteDataProps {
  symbol: string;
  longName: string;
  shortName: string;
  region: string;
  regularMarketPrice: number;
  regularMarketChangePercent: number;
}

const QuoteCard = (prop: any) => {
  const { quote, port } = prop;
  const [quoteData, setQuoteData] = useState<QuoteDataProps>();
  const [loading, setLoading] = useState(false);
  const [quoteCost, setQuoteCost] = useState<number>();
  const [profit, setProfit] = useState<number>();
  const [profitPercentage, setProfitPercentage] = useState<number>();

  const fetchQuote = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${config.apiBackend}/quote/getDetailById/${quote.quoteId}`);
      if (res) {
        setQuoteData(res.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  useEffect(() => {
    if (!quoteData || !port?.Order) return;

    const relatedOrders = port.Order.filter((order: any) => order.quoteId === quote.quoteId);

    const totalPrice = relatedOrders.reduce((acc: number, order: any) => {
      return acc + order.priceToPay;
    }, 0);

    setQuoteCost(totalPrice);

    // Calculate profit
    const presentValue = quoteData.regularMarketPrice * quote.amountQuote;
    const calculatedProfit = presentValue - totalPrice;
    setProfit(calculatedProfit);

    // Calculate profit percentage
    if (totalPrice > 0) {
      const percentage = (calculatedProfit / totalPrice) * 100;
      setProfitPercentage(percentage);
    }
  }, [quoteData, port]);

  if (loading && !quoteData) {
    return <LoadingPage />;
  }

  const isPositive = quoteData?.regularMarketChangePercent > 0;
  const isProfitable = profit > 0;

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-amber-100 transition-all hover:shadow-lg">
      <div className="flex flex-col md:flex-row">
   
        <div className="p-5 md:w-1/3 flex flex-col justify-between border-b md:border-b-0 md:border-r border-amber-100">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
                <BarChart2 className="text-amber-500" size={20} />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">{quoteData?.symbol}</h3>
                <p className="text-xs text-gray-500">{quoteData?.shortName}</p>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="flex items-center">
                <span className="text-2xl font-bold text-gray-800">{formatCurrency(quoteData?.regularMarketPrice)}</span>
                <div className={`ml-2 flex items-center rounded-full px-2 py-1 text-xs ${isPositive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {isPositive ? <TrendingUp size={12} className="mr-1" /> : <TrendingDown size={12} className="mr-1" />}
                  {quoteData?.regularMarketChangePercent.toFixed(2)}%
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 text-sm">
            <span className="text-gray-500">Holdings:</span>
            <span className="ml-2 font-medium text-gray-700">{quote.amountQuote} shares</span>
          </div>
        </div>
        
     
        <div className="p-5 md:w-2/3 bg-gray-50">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-3 rounded-lg border border-gray-100">
              <p className="text-xs text-gray-500">Average Price</p>
              <div className="flex items-center mt-1">
                <DollarSign size={14} className="text-amber-500" />
                <span className="text-gray-800 font-semibold">{formatCurrency(quote.avgPrice)}</span>
              </div>
            </div>
            
            <div className="bg-white p-3 rounded-lg border border-gray-100">
              <p className="text-xs text-gray-500">Total Cost</p>
              <p className="text-gray-800 font-semibold mt-1">{quoteCost ? formatCurrency(quoteCost) : '-'}</p>
            </div>
            
            <div className="bg-white p-3 rounded-lg border border-gray-100">
              <p className="text-xs text-gray-500">Present Value</p>
              <p className="text-gray-800 font-semibold mt-1">
                {quoteData ? formatCurrency(quoteData.regularMarketPrice * quote.amountQuote) : '-'}
              </p>
            </div>
            
            <div className={`p-3 rounded-lg ${isProfitable ? "bg-green-50 border border-green-100" : "bg-red-50 border border-red-100"}`}>
              <p className="text-xs text-gray-500">Profit/Loss</p>
              <div className="flex flex-col mt-1">
                <span className={`font-semibold ${isProfitable ? "text-green-600" : "text-red-600"}`}>
                  {profit !== undefined ? formatCurrency(profit) : '-'}
                </span>
                {profitPercentage !== undefined && (
                  <span className={`text-xs ${isProfitable ? "text-green-600" : "text-red-600"}`}>
                    ({profitPercentage.toFixed(2)}%)
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteCard;