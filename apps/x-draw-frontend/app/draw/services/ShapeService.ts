import { Shape } from "../types";
import { HTTP_BACKEND_URL } from "../../../config";
import axiosInstance from "../../services/axiosInstance";

export class ShapeService {
  static async getExistingShapes(roomIdentifier: string): Promise<Shape[]> {
    try {
      // If it's a slug (non-numeric), we need to get the room first to get the numeric ID
      let roomId: number;
      
      if (isNaN(Number(roomIdentifier))) {
        // It's a slug, get the room data first
        const roomResponse = await axiosInstance.get(
          `${HTTP_BACKEND_URL}/rooms/${roomIdentifier}`
        );
        roomId = roomResponse.data.room.id;
      } else {
        // It's already a numeric room ID
        roomId = Number(roomIdentifier);
      }
      
      const response = await axiosInstance.get(
        `${HTTP_BACKEND_URL}/chats/${roomId}`
      );
      const messages = response.data.chats;
      if (!Array.isArray(messages)) return [];
      return messages
        .map((chat: { message: string }) => {
          try {
            const parsed = JSON.parse(chat.message);
            if (parsed.shape) {
              return parsed.shape;
            }
            return null;
          } catch {
            return null;
          }
        })
        .filter((shape): shape is Shape => shape !== null);
    } catch (error) {
      console.error("Error fetching existing shapes:", error);
      return [];
    }
  }
}
