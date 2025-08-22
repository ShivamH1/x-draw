import { WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";

const wss = new WebSocketServer({ port: 8081 });

wss.on("connection", (ws, request) => {
  try {
    const url = request.url;

    if (!url) {
      return;
    }
    const queryParams = new URLSearchParams(url.split("?")[1]);
    const token = queryParams.get("token") || "";
    const decoded = jwt.verify(token, JWT_SECRET as string) as JwtPayload;

    if (!decoded || !decoded.userId) {
      ws.close();
      return;
    }
    ws.on("message", (message) => {
      console.log("Received message:", message);
    });

    ws.send("Hello from server");
  } catch (error) {
    ws.on("error", (error) => {
      console.error("WebSocket error:", error);
    });
  }
});
