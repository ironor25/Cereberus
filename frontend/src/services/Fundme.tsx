import axios from "axios";
import { useEffect, useState } from "react";

interface FundmeProps {
  uid: string;
}



interface FundmeProps {
  uid: string;
}

export default function Fundme({ uid }: FundmeProps) {
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [fundType,setFundType] = useState(true);
  const [ticker,setticker] = useState<string>("")
  const [Quantity,setQuantity] = useState("");
  
  useEffect(() => {
    const fetchBalance = async () => {
      let cash_balance = await axios.get('http://127.0.0.1:3000/assets', { params: { "uid": uid } });
      console.log(cash_balance)
      setBalance(cash_balance.data.assets["CASH"]);
    };
    fetchBalance();
  }, []);


  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (fundType) {
      const cash = Number(amount);
      if (cash > 0) {
        console.log("Updated Balance:", balance +cash);
        
        await axios.post('http://127.0.0.1:3000/add_update_details', { 
          "uid": uid,
          "cash": amount,
          "fundtype":fundType } );
      }
    } else {
        const qty = Number(Quantity)
        if (ticker && qty > 0) {
        console.log("Ticker:", ticker, "Quantity:", qty);
        await axios.post('http://127.0.0.1:3000/add_update_details', { 
         "uid": uid,
         "ticker": ticker,
          "qty":qty,
          "fundtype":fundType } );
 
      }

    }
    let cash_balance   = await axios.get('http://127.0.0.1:3000/assets', { params: { "uid": uid } })
    setBalance(cash_balance.data.assets["CASH"]);
    setAmount("");
    setticker("");
    setQuantity("");
    setShowForm(false);
    };

  return (

    <div>
      {showForm ? (
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
            <label className="text-black font-medium cursor-pointer hover:text-blue-400" onClick={()=> {setFundType(true)}}>Cash</label>
            <label className="text-black font-medium p-5 cursor-pointer hover:text-blue-400" onClick={()=> {setFundType(false)}}>Assets</label>
            <hr className="text-black p-2"></hr>
            {fundType  ? 
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
            (<label className=" font-medium" >
              Ticker : 
               <input
                type="text"
                min={1}
                value={ticker}
                onChange={e => setticker(e.target.value)}
                className="block border rounded-md px-4 py-2 mt-1 w-full text-black"
                required
              />
              Quantity
              <input
                type="number"
                min={1}
                value={Quantity}
                onChange={e => setQuantity(e.target.value)}
                className="block border rounded-md px-4 py-2 mt-1 w-full text-black"
                required
              />
            </label>)}
            <input
              type="submit"
              value="Submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md w-full cursor-pointer mt-4"
            />
          </form>
        </div>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="p-2 w-30 bg-blue-300 mt-4 rounded-md hover:bg-blue-500 text-black font-medium"
        >
          Fund Wallet
        </button>
      )}

      <span className="mt-4 p-2 text-white">Balance: ₹{balance }</span>
    </div>
  );
}
