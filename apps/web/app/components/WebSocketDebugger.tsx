"use client";

import { useState, useEffect } from "react";
import { useSocket } from "../hooks/useSocket";

export function WebSocketDebugger({ roomId }: { roomId: string }) {
  const [logs, setLogs] = useState<string[]>([]);
  const [testMessage, setTestMessage] = useState("");
  const { loading, socket, error } = useSocket();
  
  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 49)]);
  };

  useEffect(() => {
    if (socket && !loading) {
      addLog("✅ WebSocket connected successfully");
      
      // Join room
      socket.send(JSON.stringify({ type: "join-room", roomId }));
      addLog(`📝 Sent join-room request for room: ${roomId}`);

      // Listen for all messages
      const handleMessage = (event: MessageEvent) => {
        addLog(`📨 Received: ${event.data}`);
        
        try {
          const data = JSON.parse(event.data);
          if (data.type === "chat") {
            addLog(`💬 Chat message: "${data.message}" in room ${data.roomId}`);
          }
        } catch (e) {
          addLog(`📄 Non-JSON message: ${event.data}`);
        }
      };

      socket.addEventListener('message', handleMessage);
      
      return () => {
        socket.removeEventListener('message', handleMessage);
      };
    } else if (loading) {
      addLog("🔄 Connecting to WebSocket...");
    } else if (error) {
      addLog(`❌ WebSocket error: ${error}`);
    }
  }, [socket, loading, error, roomId]);

  const sendTestMessage = () => {
    if (socket && testMessage.trim()) {
      const message = {
        type: "chat",
        message: testMessage,
        roomId: roomId
      };
      socket.send(JSON.stringify(message));
      addLog(`📤 Sent: ${JSON.stringify(message)}`);
      setTestMessage("");
    }
  };

  const testRoomJoin = () => {
    if (socket) {
      socket.send(JSON.stringify({ type: "join-room", roomId }));
      addLog(`📝 Re-sent join-room for: ${roomId}`);
    }
  };

  const checkConnection = () => {
    if (socket) {
      addLog(`🔌 WebSocket state: ${socket.readyState === 1 ? 'OPEN' : 'CLOSED/CONNECTING'}`);
      addLog(`🎫 Token in localStorage: ${localStorage.getItem('token') ? 'Present' : 'Missing'}`);
    }
  };

  return (
    <div style={{ 
      border: '2px solid #333', 
      padding: '20px', 
      margin: '20px 0', 
      // backgroundColor: '#f5f5f5',
      borderRadius: '8px'
    }}>
      <h3>🐛 WebSocket Debugger - Room {roomId}</h3>
      
      <div style={{ marginBottom: '15px' }}>
        <button onClick={checkConnection} style={{ marginRight: '10px', padding: '5px 10px' }}>
          Check Connection
        </button>
        <button onClick={testRoomJoin} style={{ marginRight: '10px', padding: '5px 10px' }}>
          Re-join Room
        </button>
        <span style={{ 
          color: loading ? 'orange' : error ? 'red' : socket ? 'green' : 'gray',
          fontWeight: 'bold'
        }}>
          Status: {loading ? 'Connecting' : error ? 'Error' : socket ? 'Connected' : 'Disconnected'}
        </span>
      </div>

      <div style={{ marginBottom: '15px', display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={testMessage}
          onChange={(e) => setTestMessage(e.target.value)}
          placeholder="Test message..."
          style={{ flex: 1, padding: '8px' }}
          onKeyPress={(e) => e.key === 'Enter' && sendTestMessage()}
        />
        <button 
          onClick={sendTestMessage}
          disabled={!socket || !testMessage.trim()}
          style={{ padding: '8px 16px' }}
        >
          Send Test Message
        </button>
      </div>

      <div style={{ 
        height: '200px', 
        overflowY: 'auto', 
        // backgroundColor: 'white', 
        padding: '10px',
        border: '1px solid #ccc',
        fontFamily: 'monospace',
        fontSize: '12px'
      }}>
        {logs.map((log, index) => (
          <div key={index} style={{ marginBottom: '2px' }}>
            {log}
          </div>
        ))}
        {logs.length === 0 && (
          <div style={{ color: '#666' }}>No logs yet...</div>
        )}
      </div>
    </div>
  );
}
