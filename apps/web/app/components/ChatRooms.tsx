import axios from "axios";
import { BACKEND_URL } from "../config";
import { ChatRoomsClient } from "./ChatRoomsClient";

async function getChats(roomId: string) {
    const response = await axios.get(`${BACKEND_URL}/chats/${roomId}`);
    return response.data.chats;
}

export async function ChatRooms({ roomId }: { roomId: string }) {
    const messages = await getChats(roomId);
    return <ChatRoomsClient messages={messages} id={roomId} />;
}