/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { config } from "@/app/config";
import LoadingPage from "@/utility/loading";
import Modal from "@/utility/modal";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

interface itemProps {
  id: string;
  name: string;
}

export default function Sell(prop: any) {
  const { quote } = prop;
  const [isOpen, setOpen] = useState(false);
  const [quotePort, setQuotePort] = useState();
  const [port, setPort] = useState([]);
  const [portId, setPortId] = useState<string>();
  const [amountQuote, setAmountQuote] = useState<number>();
  const [want, setWant] = useState("");
  const [quoteId, setQuoteId] = useState("");
  const [amountSell, setAmountSell] = useState<number>();
  const [priceSell, setPriceSell] = useState<number>();

  const { user } = useSelector((state: any) => state.user);

  const fetchData = async () => {
    try {
      const detail = await axios.get(
        `${config.apiBackend}/quote/get/${quote.symbol}`
      );
      const port = await axios.get(`${config.apiBackend}/user/port/${user.id}`);
      if (port) {
        setPort(port.data?.portfolio);
      }

      if (detail) {
        setQuoteId(detail.data?.id);
      }
    } catch (error: any) {
      console.log(error);
      Swal.fire({
        title: "Error!",
        text: error.message,
        icon: "warning",
        timer: 2000,
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, [quote]);

  useEffect(() => {
    setPortId(port[0]?.id);
  }, [port]);

  const fetchQuote = async () => {
    try {
      const res = await axios.get(
        `${config.apiBackend}/port/quote/${portId}`
      );
      if (res) {
        setQuotePort(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    
    if (portId) fetchQuote();
  }, [portId]);

  useEffect(() => {
    console.log(quoteId);
    setAmountQuote(0);
    if (quotePort) {
      const data = quotePort.QuoteInPort.find(
        (item: any) => item.quoteId === quoteId
      );
      if (data) {
        console.log(data);
        setAmountQuote(data?.amountQuote || 0);
      }
    }
  }, [quotePort, quoteId, portId]);

  useEffect(() => {
    setAmountSell(amountQuote);
  }, [amountQuote]);

  const handleAmountChange = (value: number) => {
    setAmountSell(value);
    setPriceSell(Number((value * quote.regularMarketPrice).toFixed(8)));
  };

  const handlePriceChange = (value: number) => {
    setPriceSell(value);
    setAmountSell(Number((value / quote.regularMarketPrice).toFixed(8)));
  };

  const handleClose = () => {
    setOpen(false);
    clearForm()
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const handleSave = async () => {
    try {

      if (want !== "Yes") {
        return Swal.fire({
          title: "Invalid Action",
          text: "Please confirm you want to sell.",
          icon: "warning",
        });
      }

      if (amountQuote === 0) {
        return Swal.fire({
          title: "Invalid Action",
          text: "You don't have this code",
          icon: "warning",
        });
      }

      if (!portId) {
        return Swal.fire({
          title: "Missing Portfolio",
          text: "Please select a portfolio.",
          icon: "warning",
        });
      }
    
      if (!amountSell || amountSell <= 0) {
        return Swal.fire({
          title: "Invalid Amount",
          text: "Please enter a valid amount to sell.",
          icon: "warning",
        });
      }
    
      if (amountSell > (amountQuote || 0)) {
        return Swal.fire({
          title: "Amount Too High",
          text: "You cannot sell more than you own.",
          icon: "warning",
        });
      }
    
      if (!priceSell || priceSell <= 0) {
        return Swal.fire({
          title: "Invalid Price",
          text: "Price must be greater than zero.",
          icon: "warning",
        });
      }
    

      const payload = {
        portId: portId,
        quoteId: quoteId,
        amountSell: amountSell,
        priceSell : priceSell,
        userId: user.id,
      };

       const res = await axios.post(`${config.apiBackend}/sell/create`, payload);
       
      if(!res){
        return <LoadingPage />
      }
        Swal.fire({
          title: "Successfully",
          text: "Create Success!",
          icon: "success",
          timer: 2000,
        });

        fetchData()
        fetchQuote()
        handleClose();

      
    } catch (error: any) {
      console.log(error);
      Swal.fire({
        title: "Error!",
        text: error.message,
        icon: "warning",
        timer: 2000,
      });
    }
  };
  const clearForm =()=>{
    setAmountSell(amountQuote);
    setPriceSell(amountQuote*quote.regularMarketPrice)
    setWant("No")
  }
  return (
    <div className="flex flex-1">
      <div
        onClick={handleOpen}
        className="bg-red-400 hover:bg-red-600 cursor-pointer flex flex-1 items-center justify-center rounded-lg shadow-lg shadow-red-800  hover:shadow-xl transition-shadow duration-300"
      >
        <p className="text-white text-2xl">Sell</p>
      </div>

      <Modal title="Sell" isOpen={isOpen} onClose={handleClose}>
        <div className="flex flex-1 flex-col gap-2">
          <div>
            <span>Do you want to sell </span>
            <span> {quote.symbol}</span>
            <span className="text-xs"> ({quote.shortName}) </span>
            <div className="flex">
              <input
                type="radio"
                name="choose"
                onClick={() => setWant("Yes")}
              />{" "}
              <span className="ml-1 mr-3">Yes</span>
              <input
                type="radio"
                name="choose"
                onClick={() => setWant("No")}
              />{" "}
              <span className="ml-1 mr-3">No</span>
            </div>
          </div>
          <div>
            <p>Your Portfolio</p>
            <select
              value={portId || 0}
              onChange={(e) => setPortId(e.target.value)}
              className="input"
            >
              {port.map((item: itemProps) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <p>How many do you want to sell ? </p>

            <span className="mr-2">Amount Quote</span>
            <span className="text-red-600 text-xs">
              ({amountQuote} in Port)
            </span>
            <input
              type="number"
              className="input "
              placeholder={amountQuote === 0 ? "You don't have this quote" : ""}
              disabled={amountQuote === 0}
              value={amountQuote != 0 ? amountSell : ""}
              onChange={(e) => handleAmountChange(Number(e.target.value))}
            />
            <span className="mr-2">Price Quote</span>
            <span className="text-red-600 text-xs">
              (Total : {(amountQuote * quote.regularMarketPrice).toFixed(2)}{" "}
              Dollars)
            </span>
            <input
              type="number"
              className="input "
              placeholder={amountQuote === 0 ? "You don't have this quote" : ""}
              disabled={amountQuote === 0}
              value={
                amountQuote != 0
                  ? priceSell
                    ? priceSell
                    : (amountSell * quote.regularMarketPrice).toFixed(2)
                  : ""
              }
              onChange={(e) => handlePriceChange(Number(e.target.value))}
            />
          </div>
          <div className="flex justify-between">
            <button className="btn" onClick={handleSave}>
              Submit
            </button>
            <button className="btn-cancel">Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
