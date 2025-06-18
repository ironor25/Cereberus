import express from "express";
import pgClient from "../database/db_setup";

const add_user_routes = express.Router();



add_user_routes.get('/get-user',async (req , res) => {
    let emailID = req.query.email
    console.log(emailID)
    const query = `SELECT * FROM user_data WHERE email = '${emailID}';`
    const response = await pgClient.query(query)
    console.log(response)
    res.json( response.rows[0])
});

add_user_routes.post('/add-user',async (req , res ) => {
    let data = req.body
    const query = `INSERT INTO USER_DATA VALUES ('${data.UID}', '${data.name}', '${data.email}');`
    const response = await pgClient.query(query)
    res.json({
        "message" : "New user added"
    })
})

export default add_user_routes;
