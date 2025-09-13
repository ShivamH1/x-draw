"use client";

import { useEffect, useState } from "react";
import { useSocket } from "../../services/hooks/useSocket";
import Canvas from "./Canvas";
import { DrawingTool } from "../../draw/types";
import axiosInstance from "../../services/axiosInstance";
import { HTTP_BACKEND_URL } from "../../../config";

interface RoomCanvasProps {
  roomId: string; // This is actually the slug from URL
  currentTool: DrawingTool;
  zoom: number;
}

function RoomCanvas({ roomId: roomSlug, currentTool, zoom }: RoomCanvasProps) {
  const { socket, loading, error } = useSocket();
  const [actualRoomId, setActualRoomId] = useState<number | null>(null);
  const [roomError, setRoomError] = useState("");

  // Resolve slug to numeric roomId
  useEffect(() => {
    const getRoomId = async () => {
      try {
        if (isNaN(Number(roomSlug))) {
          // It's a slug, get the actual room ID
          const response = await axiosInstance.get(`${HTTP_BACKEND_URL}/rooms/${roomSlug}`);
          setActualRoomId(response.data.room.id);
        } else {
          // It's already a numeric ID
          setActualRoomId(Number(roomSlug));
        }
      } catch (err) {
        console.error("Error getting room ID:", err);
        setRoomError("Failed to resolve room");
      }
    };

    getRoomId();
  }, [roomSlug]);

  useEffect(() => {
    if (socket && actualRoomId) {
      socket.send(
        JSON.stringify({
          type: "join-room",
          roomId: actualRoomId, // Send numeric roomId to WebSocket
        })
      );
    }
  }, [socket, actualRoomId]);

  if (!socket || loading || !actualRoomId) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-gray-400">
            {roomError || "Connecting to the room..."}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="text-red-400 text-4xl mb-4">⚠️</div>
          <p className="text-red-300">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Canvas
        roomId={actualRoomId.toString()} // Pass numeric roomId as string to Canvas
        socket={socket}
        currentTool={currentTool}
        zoom={zoom}
      />
    </div>
  );
}

export default RoomCanvas;
