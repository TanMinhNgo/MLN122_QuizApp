import { WaitingRoomHost } from "@/components/host/WaitingRoomHost";
import { WaitingRoomPlayer } from "@/components/player/WaitingRoomPlayer";

interface RoomWaitingPageProps {
  params: Promise<{ roomCode: string }>;
  searchParams: Promise<{ mode?: string; nickname?: string }>;
}

export default async function RoomWaitingPage({ params, searchParams }: RoomWaitingPageProps) {
  const { roomCode } = await params;
  const query = await searchParams;
  const mode = query.mode || "player";
  const nickname = query.nickname || "Người chơi";

  if (mode === "host") {
    return <WaitingRoomHost roomCode={roomCode} joinUrl="https://quizvui.local/tham-gia" players={[]} />;
  }

  return <WaitingRoomPlayer nickname={nickname} />;
}
