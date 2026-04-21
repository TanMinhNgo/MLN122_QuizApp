'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';

import LandingSwitchNav from '@/components/shared/LandingSwitchNav';
import { useSessionStore } from '@/stores/sessionStore';

function normalizePin(pin: string) {
  return pin.replace(/\D/g, '').slice(0, 6);
}

export default function JoinPage() {
  const router = useRouter();
  const { getSessionByPin, loading } = useSessionStore();
  const [pin, setPin] = useState('');
  const [nickname, setNickname] = useState('');

  const formattedPin = pin.replace(/(\d{3})(\d{0,3})/, '$1 $2').trim();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (pin.length < 6 || nickname.trim().length < 2) return;

    try {
      const session = await getSessionByPin(pin);
      if (session.status !== 'waiting') {
        toast.error('Phòng này đã bắt đầu hoặc đã kết thúc.');
        return;
      }
      router.push(
        `/phong/${pin}/cho?nickname=${encodeURIComponent(nickname.trim())}`,
      );
    } catch {
      toast.error('Phòng không tồn tại hoặc mã PIN không đúng.');
    }
  };

  return (
    <main className="relative min-h-screen bg-mln-dark">
      <LandingSwitchNav />

      <div className="flex min-h-[calc(100vh-65px)] items-center justify-center px-4 py-8">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/3 size-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-mln-red/8 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 size-64 rounded-full bg-mln-gold/5 blur-3xl" />
      </div>

      <div className="w-full max-w-md animate-fade-in">
        {/* Badge */}
        <div className="mb-6 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-mln-gold/30 bg-mln-gold/10 px-4 py-1.5 text-xs font-semibold text-mln-gold">
            <span className="animate-star-pulse">★</span>
            MLN122 — Tham Gia Kỳ Thi
          </span>
        </div>

        <section className="overflow-hidden rounded-2xl border border-white/10 bg-linear-to-b from-mln-mid to-mln-dark shadow-2xl shadow-black/60 ring-1 ring-mln-red/30">
          {/* Header */}
          <div className="border-b border-white/8 bg-linear-to-r from-mln-red/20 to-transparent px-6 py-5">
            <div className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-full bg-mln-red/20 text-lg text-mln-gold">
                ★
              </span>
              <div>
                <h1 className="text-xl font-extrabold uppercase tracking-wider text-mln-cream">
                  Tham Gia Kỳ Thi
                </h1>
                <p className="text-xs text-mln-dim">
                  Nhập mã PIN để vào phòng thi
                </p>
              </div>
            </div>
          </div>

          {/* Body */}
          <form className="space-y-5 px-6 py-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="pin"
                className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-mln-dim"
              >
                <span className="text-mln-gold">◆</span> Mã PIN (6 số)
              </label>
              <input
                id="pin"
                type="text"
                inputMode="numeric"
                value={formattedPin}
                onChange={(event) => setPin(normalizePin(event.target.value))}
                placeholder="123 456"
                autoFocus
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-center font-mono text-3xl tracking-[0.25em] text-mln-cream outline-none transition duration-200 placeholder:text-mln-dim/50 focus:border-mln-red/60 focus:bg-mln-red/5 focus:ring-2 focus:ring-mln-red/15"
              />
            </div>

            <div>
              <label
                htmlFor="nickname"
                className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-mln-dim"
              >
                <span className="text-mln-gold">●</span> Tên hiển thị
              </label>
              <input
                id="nickname"
                type="text"
                value={nickname}
                onChange={(event) => setNickname(event.target.value)}
                placeholder="Ví dụ: Nguyễn Văn A"
                maxLength={32}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-mln-cream outline-none transition duration-200 placeholder:text-mln-dim/50 focus:border-mln-red/60 focus:bg-mln-red/5 focus:ring-2 focus:ring-mln-red/15"
              />
            </div>

            <div className="flex gap-3 pt-1">
              <Link
                href="/noi-dung"
                className="flex-1 rounded-xl border border-white/10 bg-white/5 py-3 text-center font-semibold text-mln-dim transition duration-200 hover:border-white/20 hover:bg-white/10 hover:text-mln-cream"
              >
                Hủy
              </Link>
              <button
                type="submit"
                disabled={
                  pin.length !== 6 || nickname.trim().length < 2 || loading
                }
                className="flex-2 rounded-xl bg-linear-to-br from-mln-red to-mln-red-dark py-3 font-semibold text-white shadow-lg shadow-mln-red/25 transition duration-200 hover:brightness-110 hover:shadow-mln-red/40 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {loading ? 'Đang kiểm tra…' : '★ Vào Phòng Thi'}
              </button>
            </div>
          </form>
        </section>
      </div>
      </div>
    </main>
  );
}
