"use client";

import { useEffect } from "react";
import { useSocket } from "../../services/hooks/useSocket";
import Canvas from "./Canvas";
import { DrawingTool } from "../../draw/types";

interface RoomCanvasProps {
  roomId: string;
  currentTool: DrawingTool;
  zoom: number;
}

function RoomCanvas({ roomId, currentTool, zoom }: RoomCanvasProps) {
  const { socket, loading, error } = useSocket();

  useEffect(() => {
    if (socket && roomId) {
      socket.send(
        JSON.stringify({
          type: "join-room",
          roomId: roomId,
        })
      );
    }
  }, [socket, roomId]);

  if (!socket || loading) {
    return <div>Connecting to the room...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <Canvas
        roomId={roomId}
        socket={socket}
        currentTool={currentTool}
        zoom={zoom}
      />
    </div>
  );
}

export default RoomCanvas;
