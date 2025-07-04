import express, { response } from "express";
// Import the WebSocket server instance from the main server file
import { wss } from "../index";

const order_book_routes = express.Router();

interface Balances{
    [key: string] : number
}

interface User{
    uid: string,
    assets:  Balances
}

interface Order{
    uid : string,
    ticker : string,
    price : number,
    quantity :  number,
   
   
}


// let ticker : string = "";
let pricefeed: { [key: string]: number } = {
    "BTCUSD": 0,
    "ETHUSD": 0,
    "SOLUSD": 0
};
let balances : User[]= [{
    "uid": "ir23ty45",
    "assets" : {"ETHUSD":10,"CASH": 90000}
    },
    {
    "uid":"s19f11",
    "assets": {
        "BTCUSD":2 ,  "CASH": 10000000}
    }
];

const bids: Order[] = [];
const asks : Order[] = [];

order_book_routes.get("/assets",(req: any, res: any) => {
    const uid = req.query.uid;
    const user_details = balances.find(x => x.uid == uid)
    res.json({
        "assets" : user_details?.assets
    })
})

order_book_routes.post("/add_update_details",(req: any, res: any) => {
    const  mode = req.body.mode
    if (mode == "add" ){
        let message = ""
            const uid = req.body.uid
            const fundtype = req.body.fundtype
            if (fundtype){
                const cash = req.body.cash || 0 
                let user_details =  balances.find(x => x.uid == uid)
                if (user_details){
                    user_details.assets["CASH"] = cash
                    message = "Cash Balance updated!"
                }
                else{
                balances.push({
                    "uid":uid,
                    "assets": {"CASH":cash}
                    
                })
                message = "Cash Balance added!"
               }
             
            }


            else{
                const ticker = req.body.ticker
                const qty  = req.body.qty
                let user_details =  balances.find(x => x.uid == uid)
                if (user_details){
                    user_details.assets[ticker] =  qty
                    message = "Asset Balance updated!:>"
                }
                else{ 
                balances.push({
                    "uid":uid,
                    "assets": {ticker:qty}})
                    message = "Asset Balance added!"
                }
                 
            }
            return res.json({
                        "message" : message
                })

    }
    else{
            const fundtype = req.body.fundtype
            const uid = req.body.uid
            let message = ""
            if (fundtype){
                const cash = req.body.cash
                let user_details =  balances.find(x => x.uid == uid)
                if (user_details){
                    user_details.assets["CASH"] = cash
                    message = "Cash Balance updated!"
            }
                    
                else{
                    message = "User not found"
                }
            }
            else{
            const ticker = req.body.ticker
            const qty  = req.body.qty
            let user_details =  balances.find(x => x.uid == uid)

            if (user_details){
                user_details.assets[ticker] = ((user_details.assets[ticker] == undefined)? 0: user_details.assets[ticker]) + qty
                message = "Asset Balance updated!"
            }
            else{
                message ="User not found!"
            }
            }
            res.status(200).json({
                "message": message
})
    }
})
order_book_routes.post("/limit-order", (req: any, res: any) => {
        const side  = req.body.side
        const price  = req.body.price
        const qty  = req.body.qty
        const ticker  = req.body.ticker  
        const uid  = req.body.uid        
        let user_balance = balances.find(x => x.uid == uid)  
        
        
        if (user_balance == undefined){
            return res.json({
                "message" : "User not found"
            })
        }

        //trade match will happen among the least price in ask and the hisghest bid one can place.
        if (side == "bid" ){
            if ( user_balance.assets["CASH"] > price*qty){
                bids.push({
                    "uid": uid,
                    "ticker": ticker,
                    "price":price,
                    "quantity":qty,
                })

                bids.sort((a, b) => a.price < b.price ? -1 : 1);  //sorting in ascending order
                
                console.log("asks",asks)
                console.log("bids:",bids)}
            else{
                return res.json({
                "message" : false
            })
            }

            
        
        }
        else{
            if ( user_balance.assets[ticker] >= qty ){
                 asks.push({
                "uid": uid,
                "ticker": ticker,
                "price":price,
                "quantity":qty, 
            })
            asks.sort((a, b) => a.price < b.price ? 1 : -1); //sorting in descending order
            console.log("asks",asks)
            console.log("bids:",bids)
            }

            else{
                return res.json({
                "message" : false
            })
            }
           
        }

    

        const remaining_qty = fillOrders(side,price , qty, uid,ticker) 
        broadcastOrderBook(pricefeed);
        if (remaining_qty == 0 ){
            return res.json({
            "filled_Qty" : qty
        })
        }

        else{
            return res.json({
            "filled_Qty" : qty- remaining_qty
        })
        }
        
    
        

})



function flipBalance (uid1 : string ,uid2: string, price :number, qty: number, ticker: string){
    let user1 = balances.find(x => x.uid == uid1)
    let user2 = balances.find(x => x.uid == uid2)

    if (!user1 || !user2){
        return "both user required to swap balances."
    }

    user1.assets[ticker] -= qty;
    user2.assets[ticker] = (user2.assets[ticker] || 0) + qty;
    user1.assets["CASH"] += (qty * price);
    user2.assets["CASH"] -= (qty * price);      
}

function fillOrders(side:  string , price:  number , qty: number , uid : string , ticker:string){
    let remaining_qty = qty

    if (side == "bid"){

                    for (let i = asks.length -1 ; i >=0 ; i--){
                        if ( asks[i].ticker == ticker){
                            if (asks[i].price > price  ){
                                continue
                            }
                            
                            if (asks[i].quantity >= remaining_qty ){
                                asks[i].quantity -= remaining_qty
        
                                flipBalance(asks[i].uid,uid,asks[i].price,remaining_qty,ticker)
                                bids.pop()
                                pricefeed[ticker] =  asks[i].price
                                if (asks[i].quantity == 0){
                                    asks.pop()
                                }
                                return 0 ;
                            }

                            else{
                                flipBalance(asks[i].uid,uid,asks[i].price,remaining_qty,ticker)
                                remaining_qty -=  asks[i].quantity
                                pricefeed[ticker] =  asks[i].price
                                bids[bids.length-1].quantity  = remaining_qty
                                asks.pop()
                            }
                        }
                    }

            return remaining_qty;

        
    }
    else{
                for (let i = bids.length -1 ; i >=0 ; i--){

                    if ( bids[i].ticker == ticker){

                        if (bids[i].price < price ){
                            continue
                        }
                        if (bids[i].quantity >= remaining_qty){
                            bids[i].quantity -= remaining_qty
                            flipBalance(uid,bids[i].uid,bids[i].price,remaining_qty,ticker)
                            pricefeed[ticker] =  bids[i].price
                            asks.pop()
                            if (bids[i].quantity == 0){
                                bids.pop()
                            }
                            return 0 ;
                        }
                        else{
                            remaining_qty -=  bids[i].quantity
                            flipBalance(uid,bids[i].uid,bids[i].price,remaining_qty,ticker)
                            pricefeed[ticker] =  bids[i].price
                            bids.pop()
                            
                        }
                }
        }
        return remaining_qty;
    }
}

function broadcastOrderBook(latestprice: { [key: string]: number }) {
    const message = JSON.stringify({
        type: "orderBook",
        bids,
        asks,
        latestprice
    });
    wss.clients.forEach((client) => {
        if (client.readyState === 1) {
            client.send(message);
        }
    });
}

// GET endpoint to fetch current asks, bids, and live price
order_book_routes.get("/orderbook", (req, res) => {
    const ticker = req.query.ticker
  res.json({
    asks,
    bids,
    pricefeed,
  });
});

export default order_book_routes;










