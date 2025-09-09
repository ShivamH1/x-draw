import axios from "axios";
import { Shape } from "./types";
import { HTTP_BACKEND_URL } from "../../config";

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
    const messageData = JSON.parse(event.data);
    if (messageData.type === "chat") {
      const parsedShape = JSON.parse(messageData.message);
      existingShapes.push(parsedShape);
      clearCanvas(canvas, ctx, existingShapes);
    }
  };

  clearCanvas(canvas, ctx, existingShapes);
  let isDrawing = false;
  let startX = 0;
  let startY = 0;

  canvas.addEventListener("mousedown", (e) => {
    isDrawing = true;
    startX = e.clientX;
    startY = e.clientY;
  });

  canvas.addEventListener("mouseup", (e) => {
    isDrawing = false;
    const width = e.clientX - startX;
    const height = e.clientY - startY;
    clearCanvas(canvas, ctx, existingShapes);
    const shape: Shape = {
      type: "rect",
      x: startX,
      y: startY,
      width,
      height,
    };
    existingShapes.push(shape);
    socket.send(
      JSON.stringify({ type: "chat", message: JSON.stringify(shape) })
    );
  });

  canvas.addEventListener("mousemove", (e) => {
    if (isDrawing) {
      const width = e.clientX - startX;
      const height = e.clientY - startY;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(0, 0, 0)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "rgba(255, 255, 255)";
      ctx.strokeRect(startX, startY, width, height);
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
  existingShapes.forEach((shape) => {
    if (shape.type === "rect") {
      ctx.strokeStyle = "rgba(255, 255, 255)";
      ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
    }
  });
}

async function getExistingShapes(roomId: string) {
  const response = await axios.get(`${HTTP_BACKEND_URL}/rooms/${roomId}`);
  const messages = response.data.message;

  const shapes = messages.map((x: { message: string }) => {
    const messageData = JSON.parse(x.message);
    return messageData;
  });
  return shapes;
}
