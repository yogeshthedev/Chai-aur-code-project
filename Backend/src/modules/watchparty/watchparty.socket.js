import { WebSocketServer, WebSocket } from "ws";

/**
 * 🎓 EDUCATIONAL BREAKDOWN:
 *
 * 1. What is WebSocketServer?
 *    The `ws` package provides `WebSocketServer` which listens for the HTTP 'upgrade'
 *    event on the Node.js HTTP server. When a browser requests `ws://localhost:8000/ws/watch-party`,
 *    the server accepts the handshake and converts the connection into a 2-way TCP socket.
 *
 * 2. Why specify `path: "/ws/watch-party"`?
 *    By specifying a path, our WebSocket server will ONLY accept connections directed to
 *    `/ws/watch-party`. Any other requests or other potential websocket paths won't interfere.
 *
 * 3. What is Heartbeat (Ping/Pong)?
 *    TCP connections can become "zombies" (e.g., if a user loses Wi-Fi or closes their laptop).
 *    Neither the client nor the server knows the other is dead.
 *    By pinging clients every 30 seconds and waiting for a pong, we automatically clean up
 *    dead sockets and prevent memory leaks.
 */

let wssInstance = null;

export const initWatchPartySocketServer = (httpServer) => {
  const wss = new WebSocketServer({
    server: httpServer,
    path: "/ws/watch-party",
  });

  wssInstance = wss;

  console.log("⚡ WatchParty WebSocket Server initialized on path: /ws/watch-party");

  // Connection event fires when a client completes the WebSocket handshake
  wss.on("connection", (ws, req) => {
    ws.isAlive = true;

    // Heartbeat listener: When client responds to ping with pong, mark as alive
    ws.on("pong", () => {
      ws.isAlive = true;
    });

    console.log(`🔌 New WebSocket client connected from: ${req.socket.remoteAddress}`);

    // Welcome message to verify the connection is active
    ws.send(
      JSON.stringify({
        type: "CONNECTED",
        payload: {
          message: "Successfully connected to Watch Party WebSocket Server",
          timestamp: Date.now(),
        },
      })
    );

    // Incoming messages handler
    ws.on("message", (rawMessage) => {
      try {
        const parsed = JSON.parse(rawMessage.toString());
        console.log("📩 Received WebSocket message:", parsed.type);
        // Step 2 & 3 will route these messages to roomManager & sync handlers
      } catch (err) {
        console.error("❌ Invalid JSON message received:", err.message);
      }
    });

    // Connection closed
    ws.on("close", (code, reason) => {
      console.log(`🔌 WebSocket client disconnected (code: ${code})`);
    });

    // Error handling
    ws.on("error", (error) => {
      console.error("❌ WebSocket error:", error.message);
    });
  });

  // Heartbeat interval: Every 30 seconds, ping all connected clients
  const interval = setInterval(() => {
    wss.clients.forEach((ws) => {
      if (ws.isAlive === false) {
        console.log("💀 Terminating inactive/dead WebSocket client");
        return ws.terminate();
      }
      ws.isAlive = false;
      ws.ping();
    });
  }, 30000);

  wss.on("close", () => {
    clearInterval(interval);
  });

  return wss;
};

export const getWatchPartyWss = () => wssInstance;
