"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

function normalizePin(pin: string) {
  return pin.replace(/\D/g, "").slice(0, 6);
}

export default function JoinPage() {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [nickname, setNickname] = useState("");

  const formattedPin = pin.replace(/(\d{3})(\d{0,3})/, "$1 $2").trim();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (pin.length < 6 || nickname.trim().length < 2) {
      return;
    }

    router.push(`/phong/${pin}/cho?nickname=${encodeURIComponent(nickname.trim())}`);
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <section className="glass-card w-full max-w-md p-6">
        <h1 className="text-3xl font-extrabold">Tham gia phòng</h1>
        <p className="mt-1 text-sm text-white/80">Nhập mã PIN hoặc quét QR để vào trò chơi.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="pin" className="mb-1 block text-sm font-semibold">
              Mã PIN (6 số)
            </label>
            <input
              id="pin"
              type="text"
              inputMode="numeric"
              value={formattedPin}
              onChange={(event) => setPin(normalizePin(event.target.value))}
              placeholder="123 456"
              className="w-full rounded-lg border border-white/25 bg-white/10 px-3 py-3 text-center font-mono text-3xl tracking-[0.2em] outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
          </div>

          <div>
            <label htmlFor="nickname" className="mb-1 block text-sm font-semibold">
              Tên hiển thị của bạn
            </label>
            <input
              id="nickname"
              type="text"
              value={nickname}
              onChange={(event) => setNickname(event.target.value)}
              placeholder="Ví dụ: Team A"
              className="w-full rounded-lg border border-white/25 bg-white/10 px-3 py-3 outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
          </div>

          <button
            type="submit"
            disabled={pin.length !== 6 || nickname.trim().length < 2}
            className="w-full rounded-lg bg-[var(--accent)] py-3 font-bold transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Vào Phòng
          </button>
        </form>
      </section>
    </main>
  );
}
