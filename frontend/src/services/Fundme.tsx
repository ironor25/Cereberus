import axios from "axios";
import { useEffect, useState } from "react";
import { userStore } from "../store/user/userStore";


export default function Fundme() {
  const uid  = userStore.getState().uid
  let url = import.meta.env.VITE_BASE_URL
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [showPopup, setShowPopup] = useState(false); // <-- new state for popup
  const [fundType,setFundType] = useState(true);
  const [ticker,setticker] = useState<string>("")
  const [Quantity,setQuantity] = useState("");
  useEffect(() => {
    const fetchBalance = async () => {
      let cash_balance = await axios.get(`${url}/assets`, { params: { "uid": uid } });
      setBalance(cash_balance.data.assets && cash_balance.data.assets["CASH"] ? cash_balance.data.assets["CASH"] : 0);
    };
    fetchBalance();
  }, [uid]);




  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (fundType) {
      const cash = Number(amount);
      if (cash > 0) {
        
        await axios.post(`${url}/add_update_details`, { 
          "uid": uid,
          "cash": amount,
          "fundtype":fundType,
        "mode": "add"} );
      }
    } else {
        const qty = Number(Quantity)
        if (ticker && qty > 0) {
        
        await axios.post(`${url}/add_update_details`, { 
         "uid": uid,
         "ticker": ticker,
          "qty":qty,
          "fundtype":fundType } );
 
      }

    }
    let cash_balance   = await axios.get(`${url}/assets`, { params: { "uid": uid } })
    setBalance(cash_balance.data.assets["CASH"]);
    setAmount("");
    setticker("");
    setQuantity("");
    setShowForm(false);
    };

  return (

    <div>
      {showForm ? (
        <>
          {uid ? (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div
          className="absolute inset-0 bg-transparent backdrop-blur-sm"
          onClick={() => setShowForm(false)}
              />
              <form
          onSubmit={handleSubmit}
          className="relative z-10 bg-white rounded-xl p-6 shadow-lg w-80 text-black"
              >
          <label className="block text-black mb-2 font-medium text-2xl">Fund</label>
          <label className="text-black font-medium cursor-pointer hover:text-blue-400" onClick={() => { setFundType(true) }}>Cash</label>
          <label className="text-black font-medium p-5 cursor-pointer hover:text-blue-400" onClick={() => { setFundType(false) }}>Assets</label>
          <hr className="text-black p-2"></hr>
          {fundType ?
            (<label className="font-medium">
              Amount
              <input
                type="number"
                min={1}
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="block border rounded-md px-4 py-2 mt-1 w-full text-black"
                required
              />
            </label>)
            :
            <label className="font-medium">
              Asset:
              <select
                value={ticker}
                onChange={e => setticker(e.target.value)}
                className="block border rounded-md px-4 py-2 mt-1 w-full text-black"
                required
              >
                <option value="" disabled>
            Select Asset
                </option>
                <option value="ETHUSD">ETHUSD</option>
                <option value="BTCUSD">BTCUSD</option>
                <option value="SOLUSD">SOLUSD</option>
              </select>
              Quantity
              <input
                type="number"
                min={1}
                value={Quantity}
                onChange={e => setQuantity(e.target.value)}
                className="block border rounded-md px-4 py-2 mt-1 w-full text-black"
                required
                disabled={!ticker}
              />
            </label>}
          <input
            type="submit"
            value="Submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md w-full cursor-pointer mt-4"
          />
              </form>
            </div>
          ) : null}
        </>
      ) : (
        <button
          onClick={() => {
            if (uid) {
              setShowForm(true);
            } else {
              setShowPopup(true);
              setTimeout(() => setShowPopup(false), 3000);
            }
          }}
          className="p-2 w-30 bg-lime-300 mt-4 rounded-md hover:bg-lime-500 text-black font-medium"
        >
          Fund Wallet
        </button>
      )}

      {showPopup && (
        <div
          className="fixed bottom-6 right-6 bg-red-100 text-red-700 p-4 rounded-md shadow-lg z-50"
          style={{ minWidth: "220px" }}
        >
          Please log in to fund your wallet.
        </div>
      )}

      <span className="mt-4 p-2 text-white">Balance: ₹{balance }</span>
    </div>
  );
}
