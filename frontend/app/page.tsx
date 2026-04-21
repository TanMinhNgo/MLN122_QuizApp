import Link from "next/link";
import { PlayCircle, Sparkles, Trophy, Users2 } from "lucide-react";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden px-6 py-8 lg:px-12">
      <div className="hero-shape hero-shape-1" />
      <div className="hero-shape hero-shape-2" />
      <div className="hero-shape hero-shape-3" />

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col justify-center gap-12">
        <section className="space-y-6 text-center lg:text-left">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.15em]">
            <Sparkles className="size-4" />
            Nền tảng Quiz Realtime
          </p>
          <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-tight lg:mx-0 lg:text-6xl">
            Học vui - Chơi thật - Cùng nhau!
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-white/85 lg:mx-0">
            Tạo phòng trong vài giây, tham gia bằng PIN hoặc QR, theo dõi bảng xếp hạng trực tiếp như Kahoot nhưng tối ưu cho lớp học Việt Nam.
          </p>
        </section>

        <div className="flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
          <Link
            href="/dang-nhap"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-8 py-4 text-base font-bold text-white transition hover:brightness-110"
          >
            <PlayCircle className="size-5" />
            Tạo Quiz Ngay
          </Link>
          <Link
            href="/tham-gia"
            className="inline-flex items-center justify-center rounded-xl border border-white/30 bg-white/10 px-8 py-4 text-base font-bold text-white transition hover:bg-white/20"
          >
            Tham Gia Ngay
          </Link>
        </div>

        <section className="grid gap-4 md:grid-cols-3">
          <article className="glass-card p-5">
            <Users2 className="mb-3 size-6 text-white" />
            <h2 className="text-lg font-bold">Tham gia tức thì</h2>
            <p className="mt-2 text-sm text-white/80">Vào phòng bằng PIN hoặc QR chỉ trong vài giây, tối ưu cho mobile.</p>
          </article>
          <article className="glass-card p-5">
            <Trophy className="mb-3 size-6 text-white" />
            <h2 className="text-lg font-bold">Bảng xếp hạng trực tiếp</h2>
            <p className="mt-2 text-sm text-white/80">Điểm số, streak và thứ hạng cập nhật realtime theo từng câu hỏi.</p>
          </article>
          <article className="glass-card p-5">
            <Sparkles className="mb-3 size-6 text-white" />
            <h2 className="text-lg font-bold">Thiết kế đậm chất game</h2>
            <p className="mt-2 text-sm text-white/80">Hiệu ứng sinh động giúp giờ học bớt nhàm chán và tăng tương tác.</p>
          </article>
        </section>
      </div>
    </main>
  );
}
