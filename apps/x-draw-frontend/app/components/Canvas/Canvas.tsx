"use client";

import React, { useEffect, useRef } from "react";
import { initDraw } from "../../draw";
import { useSocket } from "../../services/hooks/useSocket";

function Canvas({ roomId }: { roomId: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { socket } = useSocket();
  
  useEffect(() => {
    if (canvasRef.current && socket) {
      const canvas = canvasRef.current;
      initDraw(canvas, roomId, socket);
    }
  }, [canvasRef, socket]);

  return (
    <div>
      <canvas ref={canvasRef} id="canvas" width={2000} height={1000}></canvas>
    </div>
  );
}

export default Canvas;
