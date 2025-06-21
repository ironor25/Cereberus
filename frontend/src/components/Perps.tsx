// import { Navigate, useNavigate } from "react-router-dom};
import { useState } from "react";
import BuySellUI from "./BuySellUI";
import Fundme from "../services/Fundme";
import OrderBook from "./OrderBook";

interface PerpsProps {
  uid: string;
}

function Perps({ uid }: PerpsProps) {
    

    const [pair,setpair] = useState("BTC")
    const [ticker, setTicker] = useState("ETHUSD");
    let link = `https://s.tradingview.com/widgetembed/?symbol=${pair}USD&interval=15&theme=dark&style=1&locale=en`
    return (
        <div className="text-white">
            <div className="h-18 flex border-2 border-white  mt-2">
                <div className="flex border-r-2 w-1/5" >
                <div className=" mt-2 ml-5 space-x-3">
                    <button  className="p-3 cursor-pointer rounded-2xl border-2 w-20  hover:bg-lime-300 hover:text-black" onClick={()=> {setpair("BTC")}}>BTC</button>
                    <button className="p-3 cursor-pointer rounded-2xl border-2 w-20 hover:bg-lime-300 hover:text-black" onClick={()=> {setpair("ETH")}}>ETH</button>
                    <button className="p-3 cursor-pointer rounded-2xl border-2 w-20 hover:bg-lime-300 hover:text-black" onClick={()=> {setpair("SOL")}}>SOL</button>
                </div>
                </div>
                <div className="flex border-r-2 ml-33 justify-end mr-8 w-2/6">
                    <div className = "mt-2">
                        <div className="flex flex-col"  >
                        <span >24hr Vol</span>
                        <span >24m</span>
                        </div>
                    </div>
                    <div className = "mt-2">
                        <div className="flex flex-col pl-5"  >
                        <span >24hr High</span>
                        <span >124</span>  
                        </div>
                    </div>
                    <div className = "mt-2">
                        <div className="flex flex-col pl-5 pr-3"  >
                        <span >24hr low</span>
                        <span >100</span>
                        </div>
                    </div>
                    

                    
                </div>
                
                <div className="flex justify-between w-2/6">
                    <Fundme uid = {uid}/>
                    <span className="p-3 pt-4 text-3xl">$152</span>
                </div>
            </div>
            <div className="flex">
            <div
                className="w-7xl"
                style={{ height: 'calc(110vh - 192px - 96px)' }}
            >
                <iframe
                    id="tradingview_d454d"
                    name="tradingview_d454d"
                    src={link}
                    title="Financial Chart"
                    frameBorder="0"
                    allowTransparency={true}
                    scrolling="no"
                    allowFullScreen
                    style={{ width: "100%", height: "100%" }}
                />
            </div>
            <OrderBook selectedTicker={ticker} />
            <div className="w-1/5 bg-slate-600/50"
            style={{ height: 'calc(90vh - 192px - 96px)' }} >
                    
            <BuySellUI uid = {uid} ticker={ticker} setTicker={setTicker} />
            </div>
            </div>
        </div>
    )
}
export default Perps;