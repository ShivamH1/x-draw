import { Shape } from "./types";
import { HTTP_BACKEND_URL } from "../../config";
import axiosInstance from "../services/axiosInstance";

export async function initDraw(
  canvas: HTMLCanvasElement,
  roomId: string,
  socket: WebSocket
) {
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return;
  }

  let existingShapes: Shape[] = await getExistingShapes(roomId);

  socket.onmessage = (event) => {
    try {
      const messageData = JSON.parse(event.data);
      if (messageData.type === "chat" && messageData.message) {
        try {
          const parsedMessage = JSON.parse(messageData.message);
          if (
            parsedMessage &&
            typeof parsedMessage === "object" &&
            parsedMessage.shape &&
            parsedMessage.shape.type
          ) {
            existingShapes.push(parsedMessage.shape);
            clearCanvas(canvas, ctx, existingShapes);
          }
        } catch (parseError) {
          console.log("Received non-shape message:", messageData.message);
        }
      }
    } catch (error) {
      console.error("Error processing socket message:", error);
    }
  };

  clearCanvas(canvas, ctx, existingShapes);
  let isDrawing = false;
  let startX = 0;
  let startY = 0;

  canvas.addEventListener("mousedown", (e) => {
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    startX = e.clientX - rect.left;
    startY = e.clientY - rect.top;
  });

  canvas.addEventListener("mouseup", (e) => {
    if (!isDrawing) return;
    isDrawing = false;
    const rect = canvas.getBoundingClientRect();
    const endX = e.clientX - rect.left;
    const endY = e.clientY - rect.top;
    const width = endX - startX;
    const height = endY - startY;

    const shape: Shape = {
      type: "rect",
      x: startX,
      y: startY,
      width,
      height,
    };
    existingShapes.push(shape);
    clearCanvas(canvas, ctx, existingShapes);

    socket.send(
      JSON.stringify({
        type: "chat",
        roomId: roomId,
        message: JSON.stringify({ shape }),
      })
    );
  });

  canvas.addEventListener("mousemove", (e) => {
    if (isDrawing) {
      const rect = canvas.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;
      const width = currentX - startX;
      const height = currentY - startY;

      clearCanvas(canvas, ctx, existingShapes);

      ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(startX, startY, width, height);
      ctx.setLineDash([]);
    }
  });
}

function clearCanvas(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  existingShapes: Shape[]
) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(0, 0, 0)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "rgba(255, 255, 255)";
  ctx.lineWidth = 2;

  existingShapes.forEach((shape) => {
    if (shape.type === "rect") {
      ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
    } else if (shape.type === "circle") {
      ctx.beginPath();
      ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, 2 * Math.PI);
      ctx.stroke();
    }
  });
}

async function getExistingShapes(roomId: string) {
  try {
    const response = await axiosInstance.get(
      `${HTTP_BACKEND_URL}/chats/${roomId}`
    );
    const messages = response.data.chats;

    if (!Array.isArray(messages)) {
      return [];
    }

    const shapes = messages
      .filter((message: { message: string }) => {
        try {
          const messageData = JSON.parse(message.message);
          return (
            messageData &&
            typeof messageData === "object" &&
            messageData.shape &&
            messageData.shape.type
          );
        } catch {
          return false;
        }
      })
      .map((chat: { message: string }) => {
        const parsedMessage = JSON.parse(chat.message);
        return parsedMessage.shape;
      });

    return shapes;
  } catch (error) {
    console.error("Error fetching existing shapes:", error);
    return [];
  }
}
