import { WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";

const wss = new WebSocketServer({ port: 8081 });

function checkUser(token: string): string | null {
  const decoded = jwt.verify(token, JWT_SECRET as string) as JwtPayload;

  if (typeof decoded == "string") {
    return null;
  }

  if (!decoded || !decoded.userId) {
    return null;
  }

  return decoded.userId;
}

wss.on("connection", (ws, request) => {
  try {
    const url = request.url;

    if (!url) {
      return;
    }
    const queryParams = new URLSearchParams(url.split("?")[1]);
    const token = queryParams.get("token") || "";
    
    const userAuthenticated = checkUser(token);
    
    if (!userAuthenticated) {
      ws.close();
      return;
    }

    ws.send("Hello from server");
  } catch (error) {
    console.error("WebSocket error:", error);
  }
});
