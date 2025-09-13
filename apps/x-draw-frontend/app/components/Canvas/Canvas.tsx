"use client";

import React, { useEffect, useRef } from "react";
import { initDraw } from "../../draw";

function Canvas({ roomId, socket }: { roomId: string; socket: WebSocket | null }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current && socket) {
      const canvas = canvasRef.current;
      initDraw(canvas, roomId, socket);
    }
  }, [canvasRef, socket]);

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
