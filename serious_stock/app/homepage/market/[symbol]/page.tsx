/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useParams } from "next/navigation";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";
import { config } from "@/app/config";
import { useEffect, useState } from "react";

import dayjs from "dayjs";
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);
import { Filler } from "chart.js";
import DetailQuote from "./DetailQuote";
import Sell from "./sell";
import Buy from "./buy";
import LoadingPage from "@/utility/loading";
import MyLineChart from "./component/chart";
ChartJS.register(Filler);

export default function Page() {
  const params = useParams();
  const symbol = params.symbol;

  const [dataPrice, setDataPrice] = useState([]);
  const [loading, setLoading] = useState(false);
  const [quote, setQuote] = useState<any>({});
  const [day ,setDay] = useState(30)
  const [isSelected , setSelect] = useState<string>("")
  const fetchPrice = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${config.apiBackend}/quote/getPrice/${symbol}`,
        {
          params: { day: day },
        }
      );

      const quote = await axios.get(
        `${config.apiBackend}/quote/getDetail/${symbol}`
      );

      if (res && quote) {
        setDataPrice(res.data);
        setQuote(quote.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPrice();
  }, [day]);

  const [labels, setLable] = useState<string[]>([]);
  const [data, setData] = useState<number[]>([]);

  useEffect(() => {
    //console.log(dataPrice);
    const newLabels = dataPrice.map((item: any) =>
      dayjs(item.date).format("DD MMM")
    );
    const newDataPoints = dataPrice.map((item: any) => item.close);

    setLable(newLabels);
    setData(newDataPoints);
  }, [dataPrice]);


  if(loading){
    return <LoadingPage />
  }
  
  const startPrice = data[0] || 0;
  const endPrice = data[data.length - 1] || 0;
  const isPositiveTrend = endPrice >= startPrice;
  return (
    <div className="flex flex-1 bg-white p-4 rounded-lg shadow-lg flex-col">
      <div className="border-b text-amber-400 flex flex-1 justify-between">
        <div>
          <h1 className={`text-2xl font-semibold`}>{symbol}</h1>
        </div>
        <div className={`flex flex-col font-semibold items-end ${isPositiveTrend ? "text-green-500" : "text-red-500"}   `}>
          <h1>{quote.regularMarketPrice} USD</h1>
          <h1>
            {quote?.regularMarketChangePercent !== undefined
              ? quote.regularMarketChangePercent.toFixed(2) + " %"
              : "N/A"}
          </h1>
        </div>
      </div>
      <div className="flex flex-1  m-2 p-6 rounded-lg shadow-lg shadow-gray-300 flex-col">
        <div className="flex flex-1 ">
          <div className="grid grid-cols-9 text-center gap-4 bg-gray-100 p-2 rounded-lg">
            <TimeSelect setSelect={setSelect} setDay={setDay} Day="3D"  calDay="3"  isSelected={isSelected}/>
            <TimeSelect setSelect={setSelect} setDay={setDay} Day="1W"  calDay="7"  isSelected={isSelected} />
            <TimeSelect setSelect={setSelect} setDay={setDay} Day="2W"  calDay="14"  isSelected={isSelected} />
            <TimeSelect setSelect={setSelect} setDay={setDay} Day="3W"  calDay="21"  isSelected={isSelected} />
            <TimeSelect setSelect={setSelect} setDay={setDay} Day="1M"  calDay="30" isSelected={isSelected} />
            <TimeSelect setSelect={setSelect} setDay={setDay} Day="6M"  calDay="180" isSelected={isSelected} />
            <TimeSelect setSelect={setSelect} setDay={setDay} Day="12M" calDay="365" isSelected={isSelected} />
            <TimeSelect setSelect={setSelect} setDay={setDay} Day="5Y"  calDay="1825"isSelected={isSelected} />
            <TimeSelect setSelect={setSelect} setDay={setDay} Day="10Y" calDay="3650"isSelected={isSelected} />
          </div>
         
        </div>
        <MyLineChart labels={labels} dataPoints={data} />
        
      </div>

      <DetailQuote quote={quote} symbol={symbol}/>
      <div className="grid grid-cols-2  m-2 gap-4">
              <Buy  quote={quote}/>
              <Sell  quote={quote}/>
      </div>
    </div>
  );
}
const  TimeSelect  = (prop : any) =>{
  const {setSelect , setDay , Day , isSelected , calDay} = prop;
  return(
    <div className={`${isSelected === Day ? "day-select" : ""} cursor-pointer text-center justify-center items-center flex flex-1 w-10 h-10`} onClick={()=>{
      setDay(calDay);
      setSelect(Day)
    }} >{Day}</div>
  );
}

