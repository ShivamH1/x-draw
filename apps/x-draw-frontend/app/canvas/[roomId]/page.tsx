"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import RoomCanvas from "../../components/Canvas/RoomCanvas";
import { ProtectedRoute } from "../../components/Auth/ProtectedRoute";
import { Button } from "@repo/ui/components/button";
import Toolbar from "../../components/TopBar/Toolbar";
import { DrawingTool } from "../../draw/types";
import { LogOut, Copy, Check, Users, Clock, Hash } from "lucide-react";
import axiosInstance from "../../services/axiosInstance";
import { HTTP_BACKEND_URL } from "../../../config";

function CanvasPage() {
  const params = useParams();
  const router = useRouter();
  const roomSlug = params.roomId as string; // This is actually the slug from URL
  const [roomData, setRoomData] = useState<{ id: number; slug: string; name?: string } | null>(null);
  const [currentTool, setCurrentTool] = useState<DrawingTool>("pointer");
  const [zoom, setZoom] = useState(1);
  const [isLeaving, setIsLeaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [joinTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const zoomIn = () => setZoom((prev) => prev * 1.1);
  const zoomOut = () => setZoom((prev) => prev / 1.1);

  useEffect(() => {
    const fetchRoomData = async () => {
      if (!roomSlug) return;
      
      try {
        setLoading(true);
        setError("");
        
        const response = await axiosInstance.get(`${HTTP_BACKEND_URL}/rooms/${roomSlug}`);
        setRoomData(response.data.room);
      } catch (err: unknown) {
        console.error("Error fetching room data:", err);
        const error = err as { response?: { status?: number } };
        if (error.response?.status === 404) {
          setError("Room not found");
        } else {
          setError("Failed to load room");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRoomData();
  }, [roomSlug]);

  const handleLeaveRoom = async () => {
    setIsLeaving(true);
    
    // Add a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Navigate to rooms page
    router.push("/rooms");
  };

  const copyRoomSlug = async () => {
    try {
      await navigator.clipboard.writeText(roomSlug);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy room slug:", err);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading room...</p>
        </div>
      </div>
    );
  }

  if (error || !roomData) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-6xl mb-6">⚠️</div>
          <h1 className="text-2xl font-bold mb-2">{error || "Room not found"}</h1>
          <p className="text-gray-400 mb-8">The room you&apos;re looking for doesn&apos;t exist or has been deleted.</p>
          <Button
            onClick={() => router.push("/rooms")}
            className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/25 hover:scale-105"
          >
            Back to Rooms
          </Button>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black text-white flex flex-col">
        <div className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-800/50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-xl blur opacity-50 animate-pulse"></div>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h1 className="text-xl font-semibold text-white capitalize">
                      {roomSlug.length > 20 ? `${roomSlug.substring(0, 20)}...` : roomSlug}
                    </h1>
                    <button
                      onClick={copyRoomSlug}
                      className="group flex items-center space-x-1 px-2 py-1 text-sm text-gray-400 hover:text-cyan-400 rounded-md hover:bg-gray-800/50 transition-all duration-200"
                      title="Copy room name"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 text-green-400" />
                          <span className="text-green-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span className="group-hover:text-cyan-400">Copy Name</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>Joined at {formatTime(joinTime)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Hash className="w-3 h-3" />
                      <span>Room ID: {roomData.id}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          <Toolbar
            currentTool={currentTool}
            setCurrentTool={setCurrentTool}
            zoomIn={zoomIn}
            zoomOut={zoomOut}
          />

            <Button
              onClick={handleLeaveRoom}
              disabled={isLeaving}
              className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-400 hover:to-pink-500 text-white border-0 rounded-xl px-6 py-2 font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-red-500/25 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLeaving ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Leaving...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <LogOut className="w-4 h-4" />
                  <span>Leave Room</span>
                </div>
              )}
          </Button>
          </div>
        </div>

        <div className="flex-grow relative">
          <RoomCanvas roomId={roomSlug} currentTool={currentTool} zoom={zoom} />
          
          <div className="absolute bottom-6 left-6 bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-xl px-4 py-2">
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span>Zoom:</span>
              <span className="text-white font-semibold">
                {Math.round(zoom * 100)}%
              </span>
            </div>
          </div>

          <div className="absolute bottom-6 right-6 bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-xl px-4 py-2">
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span>Tool:</span>
              <span className="text-cyan-400 font-semibold capitalize">
                {currentTool === "pointer" ? "Select" : currentTool}
              </span>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default CanvasPage;
