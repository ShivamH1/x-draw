import axios from "axios";
import { BACKEND_URL } from "../../config";
import { ChatRooms } from "../../components/ChatRooms";

async function getRoom(slug: string) {
  const response = await axios.get(`${BACKEND_URL}/rooms/${slug}`);
  return response.data.room.id;
}

export default async function ChatRoom({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const roomId = await getRoom(slug);

  return <div>
    <ChatRooms roomId={roomId.toString()} />
  </div>
}
