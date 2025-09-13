"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Plus, 
  Users, 
  ArrowRight, 
  Zap, 
  Sparkles,
  Hash,
  AlertCircle
} from "lucide-react";
import { Button } from "@repo/ui/components/button";
import axiosInstance from "../services/axiosInstance";
import { HTTP_BACKEND_URL } from "../../config";

export const RoomDashboard: React.FC = () => {
  const router = useRouter();
  const [roomSlug, setRoomSlug] = useState("");
  const [roomName, setRoomName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleCreateRoom = async () => {
    if (!roomName.trim()) {
      setError("Please enter a room name");
      return;
    }

    if (roomName.trim().length < 3 || roomName.trim().length > 20) {
      setError("Room name must be between 3 and 20 characters");
      return;
    }

    setIsCreating(true);
    setError("");
    
    try {
      const response = await axiosInstance.post(`${HTTP_BACKEND_URL}/room`, {
        name: roomName.trim()
      });
      
      const { slug } = response.data;
      router.push(`/canvas/${slug}`);
    } catch (err: any) {
      console.error("Error creating room:", err);
      setError(err.response?.data?.message || "Failed to create room. Please try again.");
      setIsCreating(false);
    }
  };

  const handleJoinRoom = async () => {
    if (!roomSlug.trim()) {
      setError("Please enter a room name");
      return;
    }
    
    setIsJoining(true);
    setError("");
    
    try {
      // Check if room exists
      await axiosInstance.get(`${HTTP_BACKEND_URL}/rooms/${roomSlug.trim().toLowerCase()}`);
      
      // If we get here, room exists, navigate to it
      router.push(`/canvas/${roomSlug.trim().toLowerCase()}`);
    } catch (err: any) {
      console.error("Error joining room:", err);
      if (err.response?.status === 404) {
        setError("Room not found. Please check the room name and try again.");
      } else {
        setError("Failed to join room. Please try again.");
      }
      setIsJoining(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (showCreateForm) {
        handleCreateRoom();
      } else {
        handleJoinRoom();
      }
    }
  };

  const clearError = () => setError("");

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-gray-300">
              Collaborative Drawing Rooms
            </span>
          </div>
          
          <h1 className="text-4xl font-bold mb-4 leading-tight">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Join the Canvas
            </span>
          </h1>
          
          <p className="text-gray-400 text-lg">
            Create a new room or join an existing one to start collaborating
          </p>
        </div>

        <div className="space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-900/50 backdrop-blur-sm border border-red-700/50 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <p className="text-red-300 text-sm">{error}</p>
                <button
                  onClick={clearError}
                  className="ml-auto text-red-400 hover:text-red-300 transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          {/* Create Room Card */}
          <div className="relative group bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-cyan-400/30 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="relative z-10">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-xl flex items-center justify-center">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Create New Room</h3>
                  <p className="text-gray-400 text-sm">Start a fresh collaborative session</p>
                </div>
              </div>
              
              {showCreateForm ? (
                <div className="space-y-4">
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={roomName}
                      onChange={(e) => setRoomName(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Enter room name (3-20 characters)"
                      className="w-full bg-gray-800/80 border border-gray-600/50 rounded-xl px-12 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                      maxLength={20}
                      disabled={isCreating}
                    />
                  </div>
                  
                  <div className="flex space-x-3">
                    <Button
                      onClick={handleCreateRoom}
                      disabled={isCreating || !roomName.trim()}
                      className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white border-0 rounded-xl py-3 font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/25 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isCreating ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Creating...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center space-x-2">
                          <span>Create</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      )}
                    </Button>
                    
                    <Button
                      onClick={() => {
                        setShowCreateForm(false);
                        setRoomName("");
                        clearError();
                      }}
                      disabled={isCreating}
                      className="px-6 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 border border-gray-600/50 rounded-xl py-3 font-semibold transition-all duration-300"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  onClick={() => {
                    setShowCreateForm(true);
                    clearError();
                  }}
                  className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white border-0 rounded-xl py-3 font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/25 hover:scale-105"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <span>Create Room</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </Button>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="relative flex items-center">
            <div className="flex-grow border-t border-gray-700"></div>
            <span className="flex-shrink-0 px-4 text-gray-500 text-sm font-medium bg-black">OR</span>
            <div className="flex-grow border-t border-gray-700"></div>
          </div>

          {/* Join Room Card */}
          <div className="relative group bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-purple-400/30 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="relative z-10">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Join Existing Room</h3>
                  <p className="text-gray-400 text-sm">Enter a room ID to collaborate</p>
                </div>
              </div>
              
               <div className="space-y-4">
                 <div className="relative">
                   <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                   <input
                     type="text"
                     value={roomSlug}
                     onChange={(e) => {
                       setRoomSlug(e.target.value);
                       clearError();
                     }}
                     onKeyPress={handleKeyPress}
                     placeholder="Enter room name (e.g., my-room)"
                     className="w-full bg-gray-800/80 border border-gray-600/50 rounded-xl px-12 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300"
                     disabled={isJoining}
                   />
                 </div>
                 
                 <Button
                   onClick={handleJoinRoom}
                   disabled={!roomSlug.trim() || isJoining}
                   className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500 text-white border-0 rounded-xl py-3 font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                   {isJoining ? (
                     <div className="flex items-center space-x-2">
                       <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                       <span>Joining Room...</span>
                     </div>
                   ) : (
                     <div className="flex items-center justify-center space-x-2">
                       <span>Join Room</span>
                       <ArrowRight className="w-4 h-4" />
                     </div>
                   )}
                 </Button>
               </div>
            </div>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="mt-8 bg-gray-900/30 backdrop-blur-sm border border-gray-700/30 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <Zap className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-white mb-1">Quick Tip</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Share the room ID with your team members to collaborate in real-time. 
                All drawing tools and changes are synchronized instantly!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
