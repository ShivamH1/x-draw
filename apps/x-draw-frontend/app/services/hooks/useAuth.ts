"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    try {
      const token = localStorage.getItem("authToken");
      
      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      // Optional: Add token validation logic here
      // You could decode JWT, check expiration, or verify with backend
      
      setIsAuthenticated(true);
      setLoading(false);
    } catch (error) {
      console.error("Error checking auth status:", error);
      setIsAuthenticated(false);
      setLoading(false);
    }
  };

  const login = (token: string) => {
    localStorage.setItem("authToken", token);
    setIsAuthenticated(true);
    router.push("/"); // Redirect to home or dashboard
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
    router.push("/auth/signin");
  };

  const requireAuth = () => {
    if (!loading && !isAuthenticated) {
      router.push("/auth/signin");
    }
  };

  return {
    isAuthenticated,
    loading,
    login,
    logout,
    requireAuth,
    checkAuthStatus
  };
}