import React, { useEffect, useState } from "react";

interface Order {
  uid: string,
  price: number,
  quantity: number,
  ticker: string
}

const OrderBook: React.FC = () => {
  const [bids, setBids] = useState<Order[]>([]);
  const [asks, setAsks] = useState<Order[]>([]);
  const [lastPrice, setLastPrice] = useState<number>(0);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:3000");

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "orderBook") {
        setBids(data.bids);
        setAsks(data.asks);
        if (data.lastPrice) setLastPrice(data.lastPrice);
      }
    };

    return () => socket.close();
  }, []);

  return (
    <div className="bg-slate-900 text-white rounded-xl p-4 w-xl max-w-md mx-auto shadow-2xl">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-semibold">Order Book</h2>
        <span className="text-xs text-gray-400">
          Spread: 0.001 <span className="text-green-400">▮</span>
        </span>
      </div>

      {/* Headers */}
      <div className="flex text-xs text-gray-400 border-b border-slate-700 pb-1 mb-1">
        <div className="w-1/3">UID</div>
        <div className="w-1/3 ">Price</div>
        <div className="w-1/3 ">Quantity </div>
        <div className="w-1/3 ">Ticker </div>
      </div>

      {/* Asks */}
      <div className="max-h-32 overflow-y-auto mb-2">
        {asks.map((ask, i) => (
          <div
            key={`ask-${i}`}
            className="flex text-sm text-red-400 hover:bg-red-900/20 px-1 py-0.5 rounded transition"
          >
            <div className="w-1/3 ">{ask.uid}</div>
            <div className="w-1/3">{ask.price.toFixed(3)}</div>
            <div className="w-1/3 ">{ask.quantity}</div>
            <div className="w-1/3 ">{ask.ticker}</div>
          </div>
        ))}
      </div>

      {/* Last Price */}
      <div className="text-center text-2xl font-bold text-yellow-400 my-3">
        ${lastPrice.toFixed(3)}
      </div>

      {/* Bids */}
      <div className="max-h-32 overflow-y-auto">
        {[...bids].reverse().map((bid, i) => (
          <div
            key={`bid-${i}`}
            className="flex text-sm text-green-400 hover:bg-green-900/20 px-1 py-0.5 rounded transition"
          >
          <div className="w-1/3 ">{bid.uid}</div>
            <div className="w-1/3">{bid.price.toFixed(3)}</div>
            <div className="w-1/3 ">{bid.quantity}</div>
            <div className="w-1/3 ">{bid.ticker}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderBook;
