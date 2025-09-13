"use client";

import React from "react";
import { useAuth } from "../../services/hooks/useAuth";
import { useRouter } from "next/navigation";

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  fallback,
}) => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  // Show loading spinner while checking authentication
  if (loading) {
    return (
      fallback || (
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Verifying authentication...</p>
          </div>
        </div>
      )
    );
  }

  // Redirect happens in the useAuth hook
  if (!isAuthenticated) {
    router.push("/auth/signin");
    return;
  }

  return <>{children}</>;
};
