/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { config } from "@/app/config";
import Modal from "@/utility/modal";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
interface itemProps {
  id: string;
  name: string;
}
export default function Buy(prop: any) {
  const { quote } = prop;
  const [isOpen, setOpen] = useState(false);
  const [port, setPort] = useState<any>([]);
  const [portId, setPortId] = useState("");
  const [quoteId, setQuoteId] = useState("No");
  const [priceQuote, setPriceQuote] = useState(0);
  const [amountQuote, setAmountQuote] = useState(1);
  const [priceToPay, setPriceToPay] = useState(0);

  const { user } = useSelector((state: any) => state.user);

  const handleClose = () => {
    clearForm();
    setOpen(false);
  };

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
    setPriceQuote(quote.regularMarketPrice);
    setPriceToPay(quote.regularMarketPrice);
  }, [port, quote, quoteId]);

  const handleSave = async () => {
    try {
      const payload = {
        portId: portId,
        quoteId: quoteId,
        priceQuote: priceQuote,
        amountQuote: amountQuote,
        priceToPay: priceToPay,
      };
      const res = await axios.post(
        `${config.apiBackend}/order/create`,
        payload
      );
      console.log(res);
      handleClose();
      Swal.fire({
        title: "Buy Success!",
        text: "successfully ",
        icon: "success",
        timer: 2000,
      });
    } catch (error: any) {
      Swal.fire({
        title: "Error!",
        text: error.message,
        icon: "warning",
        timer: 2000,
      });
    }
  };

  const clearForm = () => {
    setPortId(port[0]?.id);
    setPriceQuote(quote.regularMarketPrice);
    setPriceToPay(quote.regularMarketPrice);
    setAmountQuote(1);
  };
  return (
    <div>
      <div
        className="bg-green-400 hover:bg-green-600 cursor-pointer flex flex-1 items-center justify-center rounded-lg shadow-lg shadow-green-800 p-6 hover:shadow-xl transition-shadow duration-300"
        onClick={() => setOpen(true)}
      >
        <p className="text-white text-2xl">Buy</p>
      </div>
      <Modal title="Buy Quote" isOpen={isOpen} onClose={handleClose}>
        <div>
          <div>
            <p>Choose Your Portfolio</p>

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
            <p>Quote Price</p>
            <input type="text" value={priceQuote} disabled className="input" />
          </div>
          <div>
            <p>Quote Amount</p>
            <input
              type="number"
              className="input"
              value={amountQuote}
              onChange={(e) => {
                setAmountQuote(Number(e.target.value));
                setPriceToPay(Number(e.target.value) * priceQuote);
              }}
            />
          </div>
          <div>
            <p>Price To Pay</p>
            <input
              type="number"
              className="input"
              value={priceToPay}
              onChange={(e) => {
                setPriceToPay(Number(e.target.value));
                setAmountQuote(Number(e.target.value) / priceQuote);
              }}
            />
          </div>
          <div className="mt-2" onClick={handleSave}>
            <button className="btn">Confirm</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
