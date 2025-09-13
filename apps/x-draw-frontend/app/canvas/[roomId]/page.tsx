"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import RoomCanvas from "../../components/Canvas/RoomCanvas";
import { ProtectedRoute } from "../../components/Auth/ProtectedRoute";
import { Button } from "@repo/ui/components/button";
import Toolbar from "../../components/Canvas/Toolbar";
import { DrawingTool } from "../../draw/types";

function CanvasPage() {
  const params = useParams();
  const roomId = params.roomId as string;
  const [currentTool, setCurrentTool] = useState<DrawingTool>("pointer");
  const [zoom, setZoom] = useState(1);

  const zoomIn = () => setZoom((prev) => prev * 1.1);
  const zoomOut = () => setZoom((prev) => prev / 1.1);

  if (!roomId) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <div className="p-4 flex items-center justify-between">
        <h1 className="text-xl">Canvas Room: {roomId}</h1>
        <Toolbar
          currentTool={currentTool}
          setCurrentTool={setCurrentTool}
          zoomIn={zoomIn}
          zoomOut={zoomOut}
        />
        <Button variant="outline" className="rounded-lg cursor-pointer">
          Leave
        </Button>
      </div>
      <div className="flex-grow">
        <RoomCanvas roomId={roomId} currentTool={currentTool} zoom={zoom} />
      </div>
    </div>
  );
}

export default CanvasPage;
