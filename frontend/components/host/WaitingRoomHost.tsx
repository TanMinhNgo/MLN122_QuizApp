import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';

import { Player } from '@/types';

interface WaitingRoomHostProps {
  roomCode: string;
  joinUrl: string;
  players: Player[];
  onStartGame: () => void;
}

export function WaitingRoomHost({
  roomCode,
  joinUrl,
  players,
  onStartGame,
}: WaitingRoomHostProps) {
  return (
    <main className="mx-auto grid min-h-screen w-[min(1100px,calc(100%-2rem))] gap-5 py-8 lg:grid-cols-2">
      <div className="lg:col-span-2">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/4 px-3 py-2 text-sm font-semibold text-mln-dim transition hover:bg-white/10 hover:text-mln-cream"
        >
          ← Quay lại Dashboard
        </Link>
      </div>

      {/* QR + PIN section */}
      <section className="glass-card flex flex-col items-center justify-center gap-5 p-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-mln-dim">
          Quét QR để tham gia
        </p>
        <div className="rounded-2xl border border-white/10 bg-mln-dark p-4 shadow-xl">
          <QRCodeSVG
            value={joinUrl}
            size={210}
            bgColor="#09090b"
            fgColor="#f4f4f5"
          />
        </div>
        {/* PIN */}
        <div className="w-full rounded-2xl bg-linear-to-br from-mln-red to-mln-red-dark p-5 text-center shadow-lg shadow-mln-red/20">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/70">
            Mã PIN
          </p>
          <p className="mt-1 font-mono text-5xl font-extrabold tracking-[0.25em] text-white">
            {roomCode}
          </p>
        </div>
        <p className="text-center text-xs text-mln-dim">
          Truy cập <span className="text-mln-cream">{joinUrl}</span>
        </p>
      </section>

      {/* Player list section */}
      <section className="glass-card flex flex-col p-6">
        <h1 className="text-xl font-semibold text-mln-cream">
          Thí sinh đã vào phòng{' '}
          <span className="ml-1 rounded-full bg-mln-red/20 px-2 py-0.5 text-sm font-bold text-mln-red">
            {players.length}
          </span>
        </h1>
        <p className="mt-1 text-sm text-mln-dim">
          Danh sách cập nhật realtime.
        </p>

        <div className="mt-4 flex-1 overflow-auto rounded-xl border border-white/6 bg-mln-dark/50 p-3">
          {players.length === 0 ? (
            <p className="p-4 text-center text-sm text-mln-dim">
              Chưa có thí sinh tham gia.
            </p>
          ) : (
            <div className="space-y-1.5">
              {players.map((player) => (
                <div
                  key={player.socketId}
                  className="rounded-xl bg-white/4 px-3 py-2.5 text-sm font-medium text-mln-cream"
                >
                  ★ {player.nickname}
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onStartGame}
          className="mt-5 w-full rounded-xl bg-linear-to-br from-mln-red to-mln-red-dark py-3.5 font-semibold text-white shadow-lg shadow-mln-red/25 transition hover:brightness-110"
        >
          ★ Bắt đầu kỳ thi
        </button>
      </section>
    </main>
  );
}
