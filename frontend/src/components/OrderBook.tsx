import React, { useEffect, useState } from "react";
import axios from "axios";
interface Order {
  uid: string,
  price: number,
  quantity: number,
  ticker: string
}

interface OrderBookProps {
  selectedTicker: string;
}

const OrderBook: React.FC<OrderBookProps> = ({ selectedTicker }) => {
  let url = import.meta.env.VITE_BASE_URL
  const [bids, setBids] = useState<Order[]>([]);
  const [asks, setAsks] = useState<Order[]>([]);
  const [lastPrice, setLastPrice] = useState<Record<string, number>>({});

  useEffect(() => {
    axios.get(`${url}/orderbook`, {
      params: { ticker: selectedTicker }
    }).then(res => {
      setBids(res.data.bids);
      setAsks(res.data.asks);
      setLastPrice(res.data.pricefeed);
    });
    const socket = new WebSocket("wss://cereberus.onrender.com");

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "orderBook") {
        setBids(data.bids);
        setAsks(data.asks);
        if (data.latestprice) setLastPrice(data.latestprice);
      }
    };

    return () => socket.close();
  }, []);

  const filteredBids = bids.filter(bid => bid.ticker === selectedTicker);
  const filteredAsks = asks.filter(ask => ask.ticker === selectedTicker);
  // Get the last price for the selected ticker from the lastPrice object
  const filteredPriceFeed =
    lastPrice && typeof lastPrice === "object" && selectedTicker in lastPrice
      ? lastPrice[selectedTicker]
      : null;

  return (
    <div className="bg-slate-900 text-white rounded-xl p-4 w-1/4 max-w-md mx-auto shadow-2xl">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-semibold">Order Book</h2>
        <span className="text-xs text-gray-400">
          Spread: 0.001 <span className="text-green-400">▮</span>
        </span>
      </div>

      {/* Headers */}
      <div className="flex text-xs text-gray-400 border-b border-slate-700 pb-1 mb-1">
        <div className="w-1/3">Ticker</div>
        <div className="w-1/3 ">Price</div>
        <div className="w-1/3 ">Quantity </div>
        <div className="w-1/3 ">UID </div>
      </div>

      {/* Asks */}
      <div className="max-h-32 overflow-y-auto mb-2">
        {filteredAsks.map((ask, i) => (
          <div
            key={`ask-${i}`}
            className="flex text-sm text-red-400 hover:bg-red-900/20 px-1 py-0.5 rounded transition"
          >
            <div className="w-1/3 ">{ask.ticker}</div>
            <div className="w-1/3 ">{ask.price.toFixed(3)}</div>
            <div className="w-1/3 ">{ask.quantity}</div>
            <div className="w-1/3 ">{ask.uid}</div>
          </div>
        ))}
      </div>

      {/* Last Price */}
      <div className="text-center text-2xl font-bold text-yellow-400 my-3">
        {filteredPriceFeed !== null ? `$${filteredPriceFeed}` : "--"}
      </div>

      {/* Bids */}
      <div className="max-h-32 overflow-y-auto">
        {[...filteredBids].reverse().map((bid, i) => (
          <div
            key={`bid-${i}`}
            className="flex text-sm text-green-400 hover:bg-green-900/20 px-1 py-0.5 rounded transition"
          >
            <div className="w-1/3 ">{bid.ticker}</div>
            <div className="w-1/3">{bid.price.toFixed(3)}</div>
            <div className="w-1/3 ">{bid.quantity}</div>
            <div className="w-1/3 ">{bid.uid}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderBook;
