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

  // This useEffect initializes the drawing functionality on the canvas when the component mounts
  // or when key dependencies change. It:
  // 1. Checks if canvas element and socket connection are available
  // 2. Calls initDraw to set up the drawing manager with event listeners and rendering
  // 3. Stores the cleanup function returned by initDraw
  // 4. Returns a cleanup function to properly remove event listeners and clean up resources
  //    when the component unmounts or dependencies change, preventing memory leaks
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
  }, [canvasRef, socket, roomId, currentTool, zoom]);

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
