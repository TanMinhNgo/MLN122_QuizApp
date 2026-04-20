import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";

interface WaitingRoomHostProps {
  roomCode: string;
  joinUrl: string;
  players: string[];
}

export function WaitingRoomHost({ roomCode, joinUrl, players }: WaitingRoomHostProps) {
  return (
    <main className="mx-auto grid min-h-screen w-[min(1100px,calc(100%-2rem))] gap-5 py-6 lg:grid-cols-2">
      <section className="glass-card flex flex-col items-center justify-center gap-4 p-6">
        <QRCodeSVG value={joinUrl} size={256} bgColor="transparent" fgColor="#FFFFFF" />
        <p className="font-mono text-6xl font-extrabold tracking-[0.3em]">{roomCode}</p>
        <p className="text-center text-sm text-white/80">Chia sẻ PIN hoặc QR để người chơi tham gia nhanh.</p>
      </section>

      <section className="glass-card p-6">
        <h1 className="text-2xl font-extrabold">Người chơi đã tham gia ({players.length})</h1>
        <p className="mt-1 text-white/80">Danh sách sẽ cập nhật realtime khi socket hoạt động.</p>

        <div className="mt-4 grid min-h-40 gap-2 rounded-lg border border-white/15 bg-white/5 p-3">
          {players.length === 0 ? (
            <p className="place-self-center text-center text-white/70">Chưa có người chơi tham gia.</p>
          ) : (
            players.map((player) => (
              <div
                key={player}
                className="rounded-md bg-white/10 px-3 py-2 text-sm font-semibold"
              >
                {player}
              </div>
            ))
          )}
        </div>

        <Link
          href={`/phong/${roomCode}/game?mode=host`}
          className="mt-5 inline-flex w-full justify-center rounded-lg bg-[var(--accent)] px-4 py-3 font-bold hover:brightness-110"
        >
          Bắt Đầu Game
        </Link>
      </section>
    </main>
  );
}
