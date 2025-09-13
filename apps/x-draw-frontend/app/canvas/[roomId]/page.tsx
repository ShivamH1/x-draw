import React from "react";
import RoomCanvas from "../../components/Canvas/RoomCanvas";
import { ProtectedRoute } from "../../components/Auth/ProtectedRoute";
import { Button } from "../../../../../packages/ui/src/components/button";

async function CanvasPage({ params }: { params: { roomId: string } }) {
  const roomId = (await params).roomId;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black text-white">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl">Canvas Room: {roomId}</h1>
            <nav className="flex space-x-2">
              <Button variant="outline" className="rounded-lg cursor-pointer">
                Pointer
              </Button>
              <Button variant="outline" className="rounded-lg cursor-pointer">
                Rect
              </Button>
              <Button variant="outline" className="rounded-lg cursor-pointer">
                Circle
              </Button>
              <Button variant="outline" className="rounded-lg cursor-pointer">
                Line
              </Button>
            </nav>
            <Button variant="outline" className="rounded-lg cursor-pointer">
              Leave
            </Button>
          </div>
          <RoomCanvas roomId={roomId} />
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default CanvasPage;
