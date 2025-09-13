"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../services/hooks/useAuth";
import { Pen, LogOut, Menu, X, Home, Users } from "lucide-react";

export const Navigation: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const router = useRouter();

  if (!isAuthenticated) {
    return null;
  }

  const handleNavigation = (path: string) => {
    router.push(path);
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full bg-black/80 backdrop-blur-xl z-50 border-b border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <button
            onClick={() => handleNavigation("/")}
            className="flex items-center space-x-3 hover:scale-105 transition-transform duration-200"
          >
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center">
                <Pen className="w-5 h-5 text-white" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg blur opacity-50 animate-pulse"></div>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              X-Draw
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => handleNavigation("/")}
              className="flex items-center space-x-2 text-gray-300 hover:text-cyan-400 transition-all duration-200 hover:scale-105 px-3 py-2 rounded-lg hover:bg-gray-800/50"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </button>
            
            <button
              onClick={() => handleNavigation("/rooms")}
              className="flex items-center space-x-2 text-gray-300 hover:text-cyan-400 transition-all duration-200 hover:scale-105 px-3 py-2 rounded-lg hover:bg-gray-800/50"
            >
              <Users className="w-4 h-4" />
              <span>Rooms</span>
            </button>
            
            <button
              onClick={logout}
              className="flex items-center space-x-2 text-gray-300 hover:text-cyan-400 transition-all duration-200 hover:scale-105 px-3 py-2 rounded-lg hover:bg-gray-800/50"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-cyan-400 transition-colors"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-xl border-t border-gray-800/50">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <button
              onClick={() => handleNavigation("/")}
              className="w-full text-left px-3 py-2 text-gray-300 hover:text-cyan-400 transition-colors flex items-center space-x-2"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </button>
            
            <button
              onClick={() => handleNavigation("/rooms")}
              className="w-full text-left px-3 py-2 text-gray-300 hover:text-cyan-400 transition-colors flex items-center space-x-2"
            >
              <Users className="w-4 h-4" />
              <span>Rooms</span>
            </button>
            
            <button
              onClick={logout}
              className="w-full mt-2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-6 py-2 rounded-lg flex items-center justify-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
