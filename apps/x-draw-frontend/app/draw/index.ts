import { Shape, DrawingTool } from "./types";
import { HTTP_BACKEND_URL } from "../../config";
import axiosInstance from "../services/axiosInstance";

export async function initDraw(
  canvas: HTMLCanvasElement,
  roomId: string,
  socket: WebSocket,
  currentTool: DrawingTool,
  zoom: number
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let existingShapes: Shape[] = await getExistingShapes(roomId);
  let isDrawing = false;
  let startX = 0;
  let startY = 0;
  let panStartX = 0;
  let panStartY = 0;
  let panOffsetX = 0;
  let panOffsetY = 0;

  const clearAndRedraw = () => {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(0, 0, 0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    ctx.save();
    ctx.translate(panOffsetX, panOffsetY);
    ctx.scale(zoom, zoom);
    drawShapes(existingShapes);
    ctx.restore();
  };

  const drawShapes = (shapes: Shape[]) => {
    ctx.strokeStyle = "rgba(255, 255, 255)";
    ctx.lineWidth = 2;
    shapes.forEach((shape) => {
      switch (shape.type) {
        case "rect":
          ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
          break;
        case "circle":
          ctx.beginPath();
          ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, 2 * Math.PI);
          ctx.stroke();
          break;
        case "line":
          ctx.beginPath();
          ctx.moveTo(shape.startX, shape.startY);
          ctx.lineTo(shape.endX, shape.endY);
          ctx.stroke();
          break;
        case "arrow":
          drawArrow(ctx, shape.startX, shape.startY, shape.endX, shape.endY);
          break;
        case "diamond":
          drawDiamond(ctx, shape.x, shape.y, shape.width, shape.height);
          break;
        case "text":
          ctx.font = shape.font;
          ctx.fillStyle = shape.color;
          ctx.fillText(shape.text, shape.x, shape.y);
          break;
      }
    });
  };

  clearAndRedraw();

  socket.onmessage = (event) => {
    try {
      const messageData = JSON.parse(event.data);
      if (messageData.type === "chat" && messageData.message) {
        const parsedMessage = JSON.parse(messageData.message);
        if (parsedMessage?.shape?.type) {
          existingShapes.push(parsedMessage.shape);
          clearAndRedraw();
        } else if (parsedMessage?.action === 'delete' && parsedMessage.shapeId) {
          existingShapes = existingShapes.filter(s => (s as any).id !== parsedMessage.shapeId);
          clearAndRedraw();
        }
      }
    } catch (error) {
      console.error("Error processing socket message:", error);
    }
  };

  const getCanvasCoordinates = (e: MouseEvent) => {
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - panOffsetX) / zoom;
    const y = (e.clientY - rect.top - panOffsetY) / zoom;
    return { x, y };
  };

  const handleMouseDown = (e: MouseEvent) => {
    const coords = getCanvasCoordinates(e);
    startX = coords.x;
    startY = coords.y;

    if (currentTool === "text") {
      const text = prompt("Enter text:");
      if (text) {
        const shape: Shape = {
          type: "text",
          x: startX,
          y: startY,
          text,
          font: "20px Arial",
          color: "white",
          id: Date.now().toString(),
        } as any;
        existingShapes.push(shape);
        clearAndRedraw();
        socket.send(
          JSON.stringify({
            type: "chat",
            roomId,
            message: JSON.stringify({ shape }),
          })
        );
      }
      return;
    }

    if (currentTool === "eraser") {
      const shapeToDelete = existingShapes.find(shape => isPointInShape(coords.x, coords.y, shape));
      if (shapeToDelete) {
        // @ts-ignore
        existingShapes = existingShapes.filter(s => s.id !== (shapeToDelete as any).id);
        clearAndRedraw();
        socket.send(JSON.stringify({
          type: "chat",
          roomId,
          message: JSON.stringify({ action: 'delete', shapeId: (shapeToDelete as any).id }),
        }));
      }
      return;
    }

    if (currentTool === "hand") {
      isDrawing = true;
      panStartX = e.clientX;
      panStartY = e.clientY;
      canvas.style.cursor = "grabbing";
      return;
    }

    if (currentTool !== "pointer") {
      isDrawing = true;
    }
  };

  const handleMouseUp = (e: MouseEvent) => {
    if (!isDrawing) return;
    isDrawing = false;
    canvas.style.cursor = "crosshair";

    const { x: endX, y: endY } = getCanvasCoordinates(e);
    const width = endX - startX;
    const height = endY - startY;
    let shape: Shape | null = null;
    const id = Date.now().toString();

    switch (currentTool) {
      case "rect":
        shape = { type: "rect", x: startX, y: startY, width, height, id } as any;
        break;
      case "circle":
        const radius = Math.sqrt(width ** 2 + height ** 2);
        shape = {
          type: "circle",
          centerX: startX,
          centerY: startY,
          radius,
          id
        } as any;
        break;
      case "line":
        shape = { type: "line", startX, startY, endX, endY, id } as any;
        break;
      case "arrow":
        shape = { type: "arrow", startX, startY, endX, endY, id } as any;
        break;
      case "diamond":
        shape = { type: "diamond", x: startX, y: startY, width, height, id } as any;
        break;
    }

    if (shape) {
      existingShapes.push(shape);
      clearAndRedraw();
      socket.send(
        JSON.stringify({
          type: "chat",
          roomId,
          message: JSON.stringify({ shape }),
        })
      );
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDrawing) return;

    if (currentTool === "hand") {
      const dx = e.clientX - panStartX;
      const dy = e.clientY - panStartY;
      panOffsetX += dx;
      panOffsetY += dy;
      panStartX = e.clientX;
      panStartY = e.clientY;
      clearAndRedraw();
      return;
    }

    const { x: currentX, y: currentY } = getCanvasCoordinates(e);
    clearAndRedraw();

    ctx.save();
    ctx.translate(panOffsetX, panOffsetY);
    ctx.scale(zoom, zoom);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
    ctx.setLineDash([5, 5]);

    const width = currentX - startX;
    const height = currentY - startY;

    switch (currentTool) {
      case "rect":
        ctx.strokeRect(startX, startY, width, height);
        break;
      case "circle":
        const radius = Math.sqrt(width ** 2 + height ** 2);
        ctx.beginPath();
        ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
        ctx.stroke();
        break;
      case "line":
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(currentX, currentY);
        ctx.stroke();
        break;
      case "arrow":
        drawArrow(ctx, startX, startY, currentX, currentY);
        break;
      case "diamond":
        drawDiamond(ctx, startX, startY, width, height);
        break;
    }

    ctx.setLineDash([]);
    ctx.restore();
  };

  canvas.addEventListener("mousedown", handleMouseDown);
  canvas.addEventListener("mouseup", handleMouseUp);
  canvas.addEventListener("mousemove", handleMouseMove);

  return () => {
    canvas.removeEventListener("mousedown", handleMouseDown);
    canvas.removeEventListener("mouseup", handleMouseUp);
    canvas.removeEventListener("mousemove", handleMouseMove);
  };
}

function isPointInShape(x: number, y: number, shape: Shape): boolean {
    switch(shape.type) {
        case 'rect':
            return x >= shape.x && x <= shape.x + shape.width && y >= shape.y && y <= shape.y + shape.height;
        case 'circle':
            const distance = Math.sqrt((x - shape.centerX) ** 2 + (y - shape.centerY) ** 2);
            return distance <= shape.radius;
        case 'line':
            const d1 = Math.sqrt((x - shape.startX) ** 2 + (y - shape.startY) ** 2);
            const d2 = Math.sqrt((x - shape.endX) ** 2 + (y - shape.endY) ** 2);
            const lineLen = Math.sqrt((shape.endX - shape.startX) ** 2 + (shape.endY - shape.startY) ** 2);
            return d1 + d2 >= lineLen - 0.1 && d1 + d2 <= lineLen + 0.1;
        default:
            return false;
    }
}

function drawArrow(
  ctx: CanvasRenderingContext2D,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number
) {
  const headlen = 10;
  const dx = toX - fromX;
  const dy = toY - fromY;
  const angle = Math.atan2(dy, dx);
  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  ctx.lineTo(
    toX - headlen * Math.cos(angle - Math.PI / 6),
    toY - headlen * Math.sin(angle - Math.PI / 6)
  );
  ctx.moveTo(toX, toY);
  ctx.lineTo(
    toX - headlen * Math.cos(angle + Math.PI / 6),
    toY - headlen * Math.sin(angle + Math.PI / 6)
  );
  ctx.stroke();
}

function drawDiamond(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number
) {
  const midX = x + width / 2;
  const midY = y + height / 2;
  ctx.beginPath();
  ctx.moveTo(midX, y);
  ctx.lineTo(x + width, midY);
  ctx.lineTo(midX, y + height);
  ctx.lineTo(x, midY);
  ctx.closePath();
  ctx.stroke();
}

async function getExistingShapes(roomId: string): Promise<Shape[]> {
  try {
    const response = await axiosInstance.get(
      `${HTTP_BACKEND_URL}/chats/${roomId}`
    );
    const messages = response.data.chats;
    if (!Array.isArray(messages)) return [];
    return messages
      .map((chat: { message: string }) => {
        try {
          const parsed = JSON.parse(chat.message);
          if(parsed.shape) {
            return parsed.shape;
          }
          return null;
        } catch {
          return null;
        }
      })
      .filter((shape): shape is Shape => shape !== null);
  } catch (error) {
    console.error("Error fetching existing shapes:", error);
    return [];
  }
}
