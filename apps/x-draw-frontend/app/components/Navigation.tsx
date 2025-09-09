"use client";

import React from "react";
import { useAuth } from "../services/hooks/useAuth";
import { Pen, LogOut } from "lucide-react";

export const Navigation: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="fixed top-0 w-full bg-black/80 backdrop-blur-xl z-50 border-b border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center">
                <Pen className="w-5 h-5 text-white" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg blur opacity-50 animate-pulse"></div>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              X-Draw
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={logout}
              className="flex items-center space-x-2 text-gray-300 hover:text-cyan-400 transition-all duration-200 hover:scale-105 px-3 py-2 rounded-lg hover:bg-gray-800/50"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
