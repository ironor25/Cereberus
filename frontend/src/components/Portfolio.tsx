import React, { useEffect, useState } from "react";
import axios from "axios";

interface Assets {
  [key: string]: number;
}

interface PortfolioProps {
  uid: string;
}

const categories = ["cash", "coins"];

const Portfolio: React.FC<PortfolioProps> = ({ uid }) => {
  let url = import.meta.env.VITE_BASE_URL
  const [selectedCategory, setSelectedCategory] = useState<string>("cash");
  const [assets, setAssets] = useState<Assets>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAssets() {
      setLoading(true);
      try {
        const res = await axios.get(`${url}/assets`, { params: { uid } });
        setAssets(res.data.assets || {});
      } catch (err) {
        setAssets({});
      }
      setLoading(false);
    }
    fetchAssets();
  }, [uid]);

  // Filter assets by category
  const cashAssets = Object.entries(assets).filter(([k]) => k.toLowerCase().includes("cash"));
  const coinAssets = Object.entries(assets).filter(([k]) => !k.toLowerCase().includes("cash"));

  return (
    <div className="flex h-screen bg-black text-white  overflow-hidden">
      {/* Sidebar */}
      <div className="p-3 w-1/5 bg-black flex flex-col items-center py-8 border-r border-slate-800 h-full">
        <h2 className="text-2xl font-bold mb-8 pb-10">Portfolio</h2>
        {categories.map((category) => (
          <button
            key={category}
            className={`w-full  p-3 mb-2 rounded-lg text-lg text-black font-semibold transition-colors cursor-pointer ${selectedCategory === category ? "bg-lime-500 text-black" : "bg-slate-800 text-white hover:bg-lime-100/50 hover:text-black"}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>
      {/* Main Content */}
      <div className="w-4/5 p-8 overflow-auto h-full">
        <h3 className="text-xl font-bold mb-6">{selectedCategory === "cash" ? "Cash Holdings" : "Coin Holdings"}</h3>
        {loading ? (
          <div className="text-gray-400">Loading...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="py-2 px-4">Asset</th>
                <th className="py-2 px-4">Amount</th>
                {/* Add more columns if needed */}
              </tr>
            </thead>
            <tbody>
              {(selectedCategory === "cash" ? cashAssets : coinAssets).length === 0 ? (
                <tr><td colSpan={2} className="py-4 text-gray-500">No assets found.</td></tr>
              ) : (
                (
                  selectedCategory === "cash" ? cashAssets : coinAssets).map(([asset, amount]) => (
                  <tr key={asset} className="border-b border-slate-800 hover:bg-slate-800 transition">
                    <td className="py-2 px-4 font-semibold">{asset}</td>
                    <td className="py-2 px-4">{amount}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
        {/* Add more relevant info here, e.g. total value, recent activity, etc. */}
      </div>
    </div>
  );
};

export default Portfolio;