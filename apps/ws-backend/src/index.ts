import { WebSocketServer, WebSocket } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { prismaClient } from "@repo/db/client";
import { UserManager, User } from "./UserManager";

const wss = new WebSocketServer({ port: 8081 });

const userManager = UserManager.getInstance();

function checkUser(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET as string) as JwtPayload;

    if (typeof decoded == "string") {
      return null;
    }

    if (!decoded || !decoded.userId) {
      return null;
    }

    return decoded.userId;
  } catch (error) {
    return null;
  }
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

    userManager.addUser({
      userId: userAuthenticated,
      rooms: [],
      ws,
    });

    ws.on("message", async (message) => {
      const parsedMessage = JSON.parse(message.toString());

      if (parsedMessage.type === "join-room") {
        userManager.joinRoom(ws, parsedMessage.roomId);
      }

      if (parsedMessage.type === "leave-room") {
        userManager.leaveRoom(ws, parsedMessage.roomId);
      }

      if (parsedMessage.type === "chat") {
        const roomId = parsedMessage.roomId;
        const message = parsedMessage.message;

        userManager.broadcastToRoom(roomId, {
          type: "chat",
          roomId,
          message,
        });

        await prismaClient.chat.create({
          data: {
            message,
            roomId,
            userId: userAuthenticated,
          },
        });
      }
    });

    ws.on("close", () => {
      userManager.removeUser(ws);
    });

    ws.send("Hello from server");
  } catch (error) {
    console.error("WebSocket error:", error);
  }
});
