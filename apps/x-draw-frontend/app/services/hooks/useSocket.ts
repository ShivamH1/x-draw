"use client";

import { useEffect, useState } from "react";
import { WS_BACKEND_URL } from "../../../config";
import { useAuth } from "./useAuth";

export function useSocket() {
  const [loading, setLoading] = useState<boolean>(false);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, requireAuth } = useAuth();

  useEffect(() => {
    // Wait for auth check to complete
    if (isAuthenticated === null) return;

    if (!isAuthenticated) {
      requireAuth();
      return;
    }

    setLoading(true);
    setError(null);

    const token = localStorage.getItem("authToken");
    let ws: WebSocket;

    try {
      ws = new WebSocket(`${WS_BACKEND_URL}?token=${token}`);

      ws.onopen = () => {
        console.log("WebSocket connection opened successfully");
        setLoading(false);
        setSocket(ws);
        setError(null);
      };

      ws.onerror = (event) => {
        console.error("WebSocket error:", event);
        setLoading(false);
        setError("WebSocket connection failed");
      };

      ws.onclose = (event) => {
        console.log("WebSocket connection closed");
        setLoading(false);
        setSocket(null);
        if (event.code !== 1000) {
          // Not a normal closure
          setError(`Connection closed: ${event.reason || "Unknown reason"}`);
        }
      };
    } catch (err) {
      console.error("Failed to create WebSocket:", err);
      setLoading(false);
      setError("Failed to create WebSocket connection");
    }

    // Cleanup function to close WebSocket when component unmounts
    return () => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close(1000, "Component unmounting");
      }
    };
  }, [isAuthenticated]);

  return { loading, socket, error };
}
