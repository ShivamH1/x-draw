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

    console.log(`User ${userAuthenticated} connected to WebSocket`);

    ws.on("message", async (message) => {
      try {
        const parsedMessage = JSON.parse(message.toString());
        console.log(`Received message from user ${userAuthenticated}:`, parsedMessage);

        if (parsedMessage.type === "join-room") {
          userManager.joinRoom(ws, parsedMessage.roomId);
          console.log(`User ${userAuthenticated} joined room ${parsedMessage.roomId}`);
          
          // Send confirmation back to user
          ws.send(JSON.stringify({
            type: "room-joined",
            roomId: parsedMessage.roomId,
            message: `Successfully joined room ${parsedMessage.roomId}`
          }));
        }

        if (parsedMessage.type === "leave-room") {
          userManager.leaveRoom(ws, parsedMessage.roomId);
          console.log(`User ${userAuthenticated} left room ${parsedMessage.roomId}`);
        }

        if (parsedMessage.type === "chat") {
        const roomId = parsedMessage.roomId;
        const message = parsedMessage.message;

        console.log(`Broadcasting message in room ${roomId}: "${message}" from user ${userAuthenticated}`);

        // Broadcast to all users in the room (including sender for confirmation)
        userManager.broadcastToRoom(roomId, {
          type: "chat",
          roomId,
          message,
          userId: userAuthenticated,
          timestamp: new Date().toISOString(),
        });

        // Save to database
        try {
          await prismaClient.chat.create({
            data: {
              message,
              roomId: parseInt(roomId),
              userId: userAuthenticated,
            },
          });
          console.log("Message saved to database");
        } catch (error) {
          console.error("Error saving message to database:", error);
        }
        }
      } catch (error) {
        console.error("Error parsing message:", error);
        ws.send(JSON.stringify({
          type: "error",
          message: "Invalid message format"
        }));
      }
    });

    ws.on("close", () => {
      console.log(`User ${userAuthenticated} disconnected from WebSocket`);
      userManager.removeUser(ws);
    });

    // Send welcome message
    ws.send(JSON.stringify({
      type: "welcome",
      message: "Connected to WebSocket server",
      userId: userAuthenticated
    }));
  } catch (error) {
    console.error("WebSocket error:", error);
  }
});
