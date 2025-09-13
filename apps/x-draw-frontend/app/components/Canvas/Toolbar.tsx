"use client";

import React from "react";
import {
  MousePointer,
  Hand,
  RectangleHorizontal,
  Circle,
  Baseline,
  Slash,
  Square,
  ArrowRight,
  Eraser,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { DrawingTool } from "../../../draw/types";
import { Button } from "@repo/ui/components/button";

interface ToolbarProps {
  currentTool: DrawingTool;
  setCurrentTool: (tool: DrawingTool) => void;
  zoomIn: () => void;
  zoomOut: () => void;
}

function Toolbar({
  currentTool,
  setCurrentTool,
  zoomIn,
  zoomOut,
}: ToolbarProps) {
  const tools: { name: DrawingTool; icon: React.ElementType }[] = [
    { name: "pointer", icon: MousePointer },
    { name: "hand", icon: Hand },
    { name: "rect", icon: RectangleHorizontal },
    { name: "diamond", icon: Square },
    { name: "circle", icon: Circle },
    { name: "arrow", icon: ArrowRight },
    { name: "line", icon: Slash },
    { name: "text", icon: Baseline },
    { name: "eraser", icon: Eraser },
  ];

  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center bg-gray-800 border-2 border-gray-700 rounded-lg p-1 space-x-1">
        {tools.map((tool) => (
          <Button
            key={tool.name}
            variant={currentTool === tool.name ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setCurrentTool(tool.name)}
            className="rounded-md"
            aria-label={tool.name}
          >
            <tool.icon className="w-5 h-5" />
          </Button>
        ))}
      </div>
      <div className="flex items-center bg-gray-800 border-2 border-gray-700 rounded-lg p-1 space-x-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={zoomIn}
          className="rounded-md"
          aria-label="Zoom In"
        >
          <ZoomIn className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={zoomOut}
          className="rounded-md"
          aria-label="Zoom Out"
        >
          <ZoomOut className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}

export default Toolbar;
