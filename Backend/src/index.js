import "dotenv/config";
import http from "http";
import connectDB from "./db/index.js";
import { app } from "./app.js";
import { initWatchPartySocketServer } from "./modules/watchparty/watchparty.socket.js";

/**
 * 🎓 WHY DO WE USE http.createServer(app)?
 * 
 * Express app is a request listener function (app(req, res)).
 * To allow both standard HTTP REST requests AND WebSocket (WS) connections
 * to live on the SAME PORT (e.g. 8000):
 * 1. We wrap Express inside Node's native HTTP server `http.createServer(app)`.
 * 2. We attach our WebSocket server to this same `httpServer`.
 * 3. When a browser sends a normal HTTP request -> Express handles it.
 * 4. When a browser sends an 'Upgrade: websocket' header -> WebSocketServer handles it!
 */

const httpServer = http.createServer(app);

// Initialize WatchParty WebSocket Server on the HTTP Server instance
initWatchPartySocketServer(httpServer);

connectDB()
  .then(() => {
    const PORT = process.env.PORT || 8000;
    httpServer.listen(PORT, () => {
      console.log(`⚙️ HTTP & WebSocket Server running at port : ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
  });