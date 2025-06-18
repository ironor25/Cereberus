import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import add_user_routes from "./routes/add_user";
import balance_routes from "./routes/fund_balance";
import order_book_routes from "./routes/order_book";

import http from "http";
import { WebSocketServer } from "ws"; // use ws library

const app = express();
const server = http.createServer(app); // HTTP + WS combined

const wss = new WebSocketServer({ server }); // attach WebSocket to same server

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Routes
app.use(add_user_routes);
app.use(balance_routes);
app.use(order_book_routes);

// WebSocket connection handler
wss.on("connection", (ws) => {
  console.log("WebSocket client connected");

  // You can listen for messages from client here
  ws.on("message", (msg) => {
    console.log("Received:", msg.toString());
    // ws.send("Echo: " + msg); // example response
  });

  // Send initial message
  ws.send("WebSocket connected to Cereberus");
});

// Start HTTP + WebSocket server on same port
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`HTTP + WebSocket server running on port ${PORT}`);
});
