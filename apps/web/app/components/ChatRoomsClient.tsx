"use client";

import { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";
import { WebSocketDebugger } from "./WebSocketDebugger";

export function ChatRoomsClient({
  messages,
  id,
}: {
  messages: { message: string }[];
  id: string;
}) {
  const [chats, setChats] = useState(messages);
  const [currentMessage, setCurrentMessage] = useState("");
  const [showDebugger, setShowDebugger] = useState(true);
  const { loading, socket, error } = useSocket();

  useEffect(() => {
    if (socket && !loading) {
      socket.send(JSON.stringify({ type: "join-room", roomId: id }));

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === "chat" && data.roomId === id) {
            setChats((prev) => [...prev, { message: data.message }]);
          }
        } catch (error) {
          console.log("Received non-JSON message:", event.data);
        }
      };
    }
  }, [socket, loading, id]);

  if (loading) {
    return <div>Connecting to chat...</div>;
  }

  if (error) {
    return (
      <div style={{ color: 'red', padding: '20px' }}>
        <h3>Connection Error</h3>
        <p>{error}</p>
        <p>Please make sure the WebSocket server is running on port 8081.</p>
      </div>
    );
  }

  if (!socket) {
    return <div>No connection available</div>;
  }

  const sendMessage = () => {
    if (currentMessage.trim()) {
      // Add message to local chat immediately for better UX
      setChats((prev) => [...prev, { message: currentMessage }]);
      
      // Send to WebSocket server
      socket.send(
        JSON.stringify({ type: "chat", message: currentMessage, roomId: id })
      );
      setCurrentMessage("");
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '10px' }}>
        <button 
          onClick={() => setShowDebugger(!showDebugger)}
          style={{ padding: '5px 10px', fontSize: '12px' }}
        >
          {showDebugger ? 'Hide' : 'Show'} Debugger
        </button>
      </div>

      {showDebugger && <WebSocketDebugger roomId={id} />}

      <div style={{ marginBottom: '20px', padding: '10px' }}>
        <h3>Room: {id}</h3>
        <div style={{ 
          maxHeight: '300px', 
          overflowY: 'auto', 
          border: '1px solid #ccc', 
          padding: '10px',
        }}>
          {chats.length === 0 ? (
            <div style={{ color: '#666', fontStyle: 'italic' }}>No messages yet...</div>
          ) : (
            chats.map((msg, index) => (
              <div key={index} style={{ 
                marginBottom: '8px', 
                padding: '5px',
                borderRadius: '4px'
              }}>
                {msg.message}
              </div>
            ))
          )}
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          placeholder="Type your message..."
          style={{ 
            flex: 1,
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ccc'
          }}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && currentMessage.trim()) {
              sendMessage();
            }
          }}
        />
        <button
          onClick={sendMessage}
          disabled={!currentMessage.trim()}
          style={{
            padding: '8px 16px',
            backgroundColor: currentMessage.trim() ? '#007bff' : '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: currentMessage.trim() ? 'pointer' : 'not-allowed'
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
