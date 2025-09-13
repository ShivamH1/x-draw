"use client";

import React from "react";
import {
  MousePointer,
  Hand,
  RectangleHorizontal,
  Circle,
  Slash,
  ArrowRight,
  ZoomIn,
  ZoomOut,
  Diamond,
} from "lucide-react";
import { Button } from "@repo/ui/components/button";
import { DrawingTool } from "../../draw/types";

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
    { name: "diamond", icon: Diamond },
    { name: "circle", icon: Circle },
    { name: "arrow", icon: ArrowRight },
    { name: "line", icon: Slash },
    // { name: "text", icon: Baseline },
    // { name: "eraser", icon: Eraser },
  ];

  return (
    <div className="flex items-center space-x-3">
      <div className="flex items-center bg-gray-900/80 backdrop-blur-sm border-2 border-gray-700/50 rounded-xl p-1.5 space-x-1">
        {tools.map((tool) => (
          <Button
            key={tool.name}
            variant="ghost"
            size="icon"
            onClick={() => setCurrentTool(tool.name)}
            className={`
              relative rounded-lg transition-all duration-300 cursor-pointer
              ${currentTool === tool.name
                ? "bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg shadow-cyan-500/25 border border-cyan-400/30"
                : "text-gray-400 hover:text-white hover:bg-gray-700/50 border border-transparent hover:border-gray-600/30"
              }
            `}
            aria-label={tool.name}
          >
            {currentTool === tool.name && (
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg blur opacity-30 animate-pulse"></div>
            )}
            <tool.icon 
              className={`
                w-5 h-5 relative z-10 transition-all duration-300
                ${currentTool === tool.name ? "drop-shadow-sm" : ""}
              `} 
            />
          </Button>
        ))}
      </div>
      
      <div className="flex items-center bg-gray-900/80 backdrop-blur-sm border-2 border-gray-700/50 rounded-xl p-1.5 space-x-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={zoomIn}
          className="rounded-lg cursor-pointer text-gray-400 hover:text-white hover:bg-gray-700/50 transition-all duration-300 border border-transparent hover:border-gray-600/30"
          aria-label="Zoom In"
        >
          <ZoomIn className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={zoomOut}
          className="rounded-lg cursor-pointer text-gray-400 hover:text-white hover:bg-gray-700/50 transition-all duration-300 border border-transparent hover:border-gray-600/30"
          aria-label="Zoom Out"
        >
          <ZoomOut className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}

export default Toolbar;
