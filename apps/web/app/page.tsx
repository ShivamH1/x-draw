"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import { BACKEND_URL } from "./config";
import axios from "axios";

export default function Home() {
  const [roomName, setRoomName] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth");
    } else {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, [router]);

  const handleCreateRoom = async () => {
    if (!roomName.trim()) return;
    
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${BACKEND_URL}/room`,
        { name: roomName },
        { headers: { Authorization: token } }
      );
      
      if (response.data.slug) {
        router.push(`/rooms/${response.data.slug}`);
      }
    } catch (error) {
      console.error("Failed to create room:", error);
    }
  };

  const handleJoinRoom = () => {
    if (!roomName.trim()) return;
    router.push(`/rooms/${roomName}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/auth");
  };

  if (loading) {
    return <div className={styles.page}>Loading...</div>;
  }

  if (!isAuthenticated) {
    return null; // Will redirect to auth
  }

  return (
    <div className={styles.page}>
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={handleLogout}
          style={{ 
            padding: '8px 16px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Room Name"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          style={{ 
            padding: '8px',
            marginRight: '10px',
            borderRadius: '4px',
            border: '1px solid #ccc'
          }}
        />
      </div>
      
      <div style={{ display: 'flex', gap: '10px' }}>
        <button 
          onClick={handleCreateRoom}
          style={{ 
            padding: '8px 16px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Create Room
        </button>
        
        <button 
          onClick={handleJoinRoom}
          style={{ 
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Join Room
        </button>
      </div>
    </div>
  );
}
