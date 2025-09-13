"use client";

import React, { useEffect, useRef } from "react";
import { initDraw } from "../../draw";
import { DrawingTool } from "../../draw/types";

interface CanvasProps {
  roomId: string;
  socket: WebSocket | null;
  currentTool: DrawingTool;
  zoom: number;
}

function Canvas({ roomId, socket, currentTool, zoom }: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current && socket) {
      const canvas = canvasRef.current;
      initDraw(canvas, roomId, socket, currentTool, zoom);
    }
  }, [canvasRef, socket, currentTool, zoom]);

  return (
    <div>
      <canvas
        ref={canvasRef}
        id="canvas"
        width={2000}
        height={1000}
        className="cursor-crosshair"
      />
    </div>
  );
}

export default Canvas;
