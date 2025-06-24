/* eslint-disable @typescript-eslint/no-explicit-any */

import { formatDate } from "@/utility/formatTime";
import { Calendar, DollarSign, Hash, TrendingUp, Wallet } from "lucide-react";

export const OrderCard = (prop : any) => {
    const { order } = prop;
    
    return (
        <div className="flex flex-col  bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Hash className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-gray-600">Order ID</span>
                </div>
                <span className="text-lg font-bold text-gray-900">#{order.id}</span>
            </div>
            
        
            <div className="space-y-4">
                {/* Port */}
                <div className="flex flex-col bg-amber-50 rounded-lg p-4">
                    <div className="flex gap-2 text-sm font-medium text-amber-800 mb-2">
                        <Wallet className="w-4 h-4 text-amber-600" />
                        Portfolio Detail
                    </div>
                    <div className="text-amber-800">
                        From Port : {order.portfolio?.name}
                    </div>
                </div>
                {/* Quote */}
                <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">Quote Details</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2">
                            <p className=" text-blue-600 text-xl ">{order.quote.displaySymbol}</p>
                            <p className=" text-blue-600  ">{order.quote.description}</p>
                        </div>
                        <div>
                            <p className="text-xs text-blue-600 uppercase tracking-wide">Amount</p>
                            <p className="text-lg font-semibold text-blue-900">{order.amountQuote}</p>
                        </div>
                        <div>
                            <p className="text-xs text-blue-600 uppercase tracking-wide">Quote Price</p>
                            <p className="text-lg font-semibold text-blue-900">฿{order.priceQuote?.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
                
                {/* Price */}
                <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">Total Payment</span>
                    </div>
                    <p className="text-2xl font-bold text-green-900">฿{order.priceToPay?.toLocaleString()}</p>
                </div>
                
                {/* CreateAt */}
                <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Buy Order At:</span>
                    <span className="text-sm font-medium text-gray-900">{formatDate(order.createdAt)}</span>
                </div>
            </div>
        </div>
    );
};

