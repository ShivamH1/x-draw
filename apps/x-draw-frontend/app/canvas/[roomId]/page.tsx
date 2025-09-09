import React from 'react'
import RoomCanvas from '../../components/Canvas/RoomCanvas';
import { ProtectedRoute } from '../../components/Auth/ProtectedRoute';

async function CanvasPage({ params }: { params: { roomId: string } }) {
  const roomId = (await params).roomId;
  console.log(roomId);
  
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black text-white">
        <div className="p-4">
          <h1 className="text-xl mb-4">Canvas Room: {roomId}</h1>
          <RoomCanvas roomId={roomId} />
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default CanvasPage
