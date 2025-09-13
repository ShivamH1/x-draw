import { useEffect, useState } from "react";
import { WS_BACKEND_URL } from "../config";

export function useSocket() {
  const [loading, setLoading] = useState<boolean>(false);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    // Get token from localStorage (assuming it's stored there after signin)
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      setError("No authentication token found");
      return;
    }
        
    try {
      const ws = new WebSocket(`${WS_BACKEND_URL}?token=${token}`);
      
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
        console.log("WebSocket connection closed:", event.code, event.reason);
        setSocket(null);
        if (event.code !== 1000) { // Not a normal closure
          setError(`Connection closed: ${event.reason || 'Unknown reason'}`);
        }
      };
      
    } catch (err) {
      console.error("Failed to create WebSocket:", err);
      setLoading(false);
      setError("Failed to create WebSocket connection");
    }
  }, []);

  return { loading, socket, error };
}
