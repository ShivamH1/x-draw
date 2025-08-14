import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8081 });

wss.on("connection", (ws) => {
  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });

  ws.on("message", (message) => {
    console.log("Received message:", message);
  });

  ws.send("Hello from server");
});
