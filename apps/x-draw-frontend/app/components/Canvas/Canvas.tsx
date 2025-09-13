"use client";

import React, { useEffect, useRef } from "react";
import { initDraw, updateDrawingTool, updateDrawingZoom } from "../../draw";
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
      let cleanup: (() => void) | undefined;
      
      const setupCanvas = async () => {
        cleanup = await initDraw(canvas, roomId, socket, currentTool, zoom);
      };
      
      setupCanvas();
      
      // Return cleanup function to remove event listeners when effect reruns
      return () => {
        if (cleanup) {
          cleanup();
        }
      };
    }
  }, [canvasRef, socket, roomId]);

  // Handle tool changes separately to avoid recreating the entire canvas
  useEffect(() => {
    updateDrawingTool(currentTool);
  }, [currentTool]);

  // Handle zoom changes
  useEffect(() => {
    updateDrawingZoom(zoom);
  }, [zoom]);

  return (
    <div className="w-full max-h-screen overflow-hidden">
      <canvas
        ref={canvasRef}
        id="canvas"
        width={typeof window !== 'undefined' ? window.innerWidth : 2000}
        height={typeof window !== 'undefined' ? window.innerHeight : 1000}
        // className="cursor-crosshair"
      />
    </div>
  );
}

export default Canvas;
