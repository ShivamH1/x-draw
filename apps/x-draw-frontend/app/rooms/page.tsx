"use client";

import { ProtectedRoute } from "../components/Auth/ProtectedRoute";
import { RoomDashboard } from "../components/RoomDashboard";

export default function RoomsPage() {
  return (
    <ProtectedRoute>
      <RoomDashboard />
    </ProtectedRoute>
  );
}
