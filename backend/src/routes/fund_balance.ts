import express from "express";
const balance_routes = express.Router();

let balance = [{"uid": "ir23ty45","balance": 0}]
function find_user(uid : string)  {
    for (let i=0; i<balance.length;i++) {
            if (balance[i].uid){
                return i;
            }
            else{
                balance.push({"uid":uid,"balance":0})
                return find_user(uid)
            }
    }
}

function update_balance(uid: string, fund: number) {
    const index = find_user(uid);
    if (index) {
        balance[index].balance = fund;
    }

}

function get_balance(uid:string) {
    const index = find_user(uid);
    if (index){
            return balance[index].balance
    }

}

balance_routes.post('/fund',async (req,res) => {
    let fund = req.body.fund;
    let uid = req.body.uid;
    update_balance(uid,fund);
    res.status(200).json({
        "message": "balance updated."
    })
})

balance_routes.get('/fund',async (req, res) => {
    let uid = req.body.uid
    res.json({
        "balance": get_balance(uid)
    })
})


export default balance_routes;