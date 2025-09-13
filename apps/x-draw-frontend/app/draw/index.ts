import { DrawingTool } from "./types";
import { DrawingManager } from "./DrawingManager";

export async function initDraw(
  canvas: HTMLCanvasElement,
  roomId: string,
  socket: WebSocket,
  currentTool: DrawingTool,
  zoom: number
): Promise<() => void> {
  const drawingManager = DrawingManager.getInstance();
  return await drawingManager.initialize(canvas, roomId, socket, currentTool, zoom);
}

export function updateDrawingTool(tool: DrawingTool) {
  const drawingManager = DrawingManager.getInstance();
  drawingManager.updateTool(tool);
}

export function updateDrawingZoom(zoom: number) {
  const drawingManager = DrawingManager.getInstance();
  drawingManager.updateZoom(zoom);
}
