import { WebSocketServer, WebSocket } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { prismaClient } from "@repo/db/client";

const wss = new WebSocketServer({ port: 8081 });

interface User {
  ws: WebSocket;
  rooms: string[];
  userId: string;
}

const users: User[] = [];

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

    users.push({
      userId: userAuthenticated,
      rooms: [],
      ws,
    });

    ws.on("message", async (message) => {
      const parsedMessage = JSON.parse(message.toString());

      if (parsedMessage.type === "join-room") {
        const user = users.find((x) => x.ws === ws);
        user?.rooms.push(parsedMessage.roomId);
      }

      if (parsedMessage.type === "leave-room") {
        const user = users.find((x) => x.ws === ws);
        if (!user) {
          return;
        }
        user.rooms = user.rooms.filter((x) => x === parsedMessage.room);
      }

      if (parsedMessage.type === "chat") {
        const roomId = parsedMessage.roomId;
        const message = parsedMessage.message;

        users.forEach((user) => {
          if (user.rooms.includes(roomId)) {
            user.ws.send(
              JSON.stringify({
                type: "chat",
                roomId,
                message,
              })
            );
          }
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

    ws.send("Hello from server");
  } catch (error) {
    console.error("WebSocket error:", error);
  }
});
