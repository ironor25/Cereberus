import { useState } from "react"
import axios  from "axios";


interface BuySellProps {
  uid: string;
  ticker: string;
  setTicker: (ticker: string) => void;
}

interface Message { message: string , success:Boolean}

function BuySellUI({uid, ticker, setTicker}:BuySellProps){
    let url = import.meta.env.VITE_BASE_URL
    const [side, setside] = useState<Boolean>(true)
    const [leverage, setLeverage] = useState<number>(1);
    const [price, setPrice] = useState<number>(0);
    const [qty, setQty] = useState<number>(0);
    const [showSuccess, setShowSuccess] = useState(false);
    const [msg ,setmsg] = useState("")
    const [success, setsuccess] = useState(false);

    function OrderSuccess({ message,success }: Message) {
    return (
        <>
        {success ? 
        <div className="fixed bottom-4 right-4 bg-white border-2 border-green-500 p-4 rounded-lg shadow-lg text-green-500"  >
            <span>{message}</span>
        </div>
        :
        <div className="fixed bottom-4 right-4 bg-white border-2 border-red-500 p-4 rounded-lg shadow-lg text-red-500"  >
            <span>{message}</span>
        </div>
        }
        

        </>
    );
}

    function place_order()  {
        if (!price || !qty || !uid || !ticker) {
            setsuccess(false)
            setShowSuccess(true);
            if (!uid){
                setmsg("Login to place order.")
                setTimeout(() => setShowSuccess(false), 3000);
            }
            else{
                if (!price){
                setmsg("Price is missing.")
                setTimeout(() => setShowSuccess(false), 3000);
            }
                if (!qty){
                    setmsg("Quantity is missing.")
                    setTimeout(() => setShowSuccess(false), 3000);
                }
            }
            
            return;
        }
           axios.post(`${url}/limit-order`, {
            "side": side ? "bid" : "ask",
            "price": price,
            "qty": qty,
            "uid": uid,
            "ticker": ticker
        })
        .then(response => {
            
            if (response.data.message == false)
                if (side== true){
                    setsuccess(false)
                    setShowSuccess(true);
                    setmsg("Order Failed : Low Cash Balance.")
                    setTimeout(() => setShowSuccess(false), 3000);
                }
                else{
                    setShowSuccess(true);
                    setmsg(`Order Failed : Low ${ticker} Balance.`)
                    setTimeout(() => setShowSuccess(false), 3000);
                }
            else{
                setsuccess(true)
                setShowSuccess(true);
                setmsg("Order Placed successfully.")
                setTimeout(() => setShowSuccess(false), 3000);
            }
        })
        .catch(error => {
            console.error("Error placing order:", error);
        });
    };

    

    return (
        <div>
            {showSuccess && <OrderSuccess message={msg} success={success} />}
            <div className="bg-slate-700 ">
                <button 
                    className={`p-2 text-sm cursor-pointer font-medium ${side ? "bg-slate-800" : ""}`}  
                    onClick={() => { setside(true); }}
                >
                    Long/Buy
                </button>
                <button className={`p-2 text-sm cursor-pointer font-medium ${side ? "" : "bg-slate-800"}`}  onClick={()=> {setside(false)}}>Short/Sell</button>
            </div>
            <div className="p-2 flex">
                <div className="flex p-1 rounded-xl bg-slate-900 w-32 justify-between">
                    <button className="p-1 pl-3 text-xs font-medium">Market</button>
                    <button className="p-1 pr-4 text-xs font-medium">Limit</button>
                </div>
                <div className="bg-slate-900 flex rounded-xl ml-4 p-2 w-20 justify-end">
                    <span className="text-xs">$160.50</span>
                </div>
            </div>

            <div className="p-2 h-56">
                <div className="h-1/2 bg-slate-900 rounded-t-2xl">
                <div className="flex justify-between p-2 pt-3">
                    {side ? 
                    <span className="w-1/2">Buying at</span>:
                    <span className="w-1/2" >Selling at</span>
                    }
                    <input 
                        type="number" 
                        className="w-1/2 text-right no-spinner outline-none focus:outline-none focus:ring-0 focus:border-transparent"
                        autoFocus
                        placeholder="$00.0"
                        required
                        onBlur={(e) => setPrice(Number(e.target.value))}
                    />
                </div>
                <div className="flex justify-between p-1 pt-3">
                    
                        <select
                            className="cursor-pointer "
                            value={ticker}
                            onChange={e => setTicker(e.target.value)}
                        >
                            <option value="ETHUSD" className="text-black">ETHUSD</option>
                            <option value="BTCUSD" className="text-black">BTCUSD</option>
                            <option value="SOLUSD" className="text-black">SOLUSD</option>
                        </select>
            
                    <input 
                        type="number" 
                        className="text-right no-spinner p-1 outline-none focus:outline-none focus:ring-0 focus:border-transparent"
                        autoFocus
                        placeholder="00.0"
                        required
                        onBlur={(e) => setQty(Number(e.target.value))}
                    />
                </div>
                </div>


                <div className="h-1/2 bg-gray-200-500 rounded-b-2xl bg-slate-700/70 ">
                    <div className="flex flex-col items-center pt-6">
                        <label htmlFor="leverage-slider" className="mb-1 text-xs font-semibold text-white">Leverage: <span className="text-blue-400">{leverage}x</span></label>
                        <input
                            id="leverage-slider"
                            type="range"
                            min={1}
                            max={100}
                            value={leverage}
                            onChange={e => setLeverage(Number(e.target.value))}
                            className="w-2/3 accent-blue-500"
                        />
                        <div className="flex justify-between w-2/3 text-[10px] text-gray-400 mt-1">
                            <span>1x</span>
                            <span>100x</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex justify-between p-2 text-xs">
                <span className="p-1 bg-gray-900 rounded-2xl pt-3 pl-3 pr-3 font-medium">Slippage: 2.0% </span>
                <div className="flex">
                    <div className="p-1 flex flex-col font-medium">
                        <span>Available Liq.</span>
                        <span>$2.50M</span>
                    </div>
                    <div className="p-1 flex flex-col font-medium">
                        <span>Borrow Rate</span>
                        <span>0.0011% / hr</span>
                    </div>
                </div>
            </div>

            <div className="p-2 ">
                {side ? (
                    <button 
                        className="border-green-500 border-2 rounded-xl w-full p-2 text-sm cursor-pointer hover:bg-green-500 transition duration-400 ease-in-out" 
                        onClick={() => place_order()}
                    >
                        Long/Buy
                    </button>
                ) : (
                    <button className="border-red-500 border-2 p-2 rounded-xl w-full text-sm cursor-pointer hover:bg-red-500 transition duration-400 ease-in-out" onClick={()=>place_order()}>Short/Sell</button>
                )}
            </div>
            <div className="border-2 border-amber-50 mt-4 ml-3 h-37 rounded-xl">
                <div className="flex justify-between p-2">
                    <span>Entry Price</span>
                    <span>-</span>
                </div>
                <div className="flex justify-between p-2" >
                    <span>Liquidation Price</span>
                    <span>-</span>
                </div>
                <div className="flex justify-between p-2" >
                    <span>Total Fees</span>
                    <span>-</span>
                </div>
            </div>
        </div>
    )
}

export default BuySellUI;