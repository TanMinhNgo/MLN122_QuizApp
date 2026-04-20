import Link from "next/link";

interface RoomEndPageProps {
  searchParams: Promise<{ mode?: string }>;
}

export default async function RoomEndPage({ searchParams }: RoomEndPageProps) {
  const { mode } = await searchParams;
  const isHost = mode === "host";

  return (
    <main className="mx-auto flex min-h-screen w-[min(900px,calc(100%-2rem))] flex-col justify-center gap-6 py-8">
      <section className="glass-card p-6 text-center">
        <h1 className="text-4xl font-extrabold">Kết quả chung cuộc</h1>
        <p className="mt-2 text-white/80">Chúc mừng top 3 người chơi xuất sắc nhất.</p>
      </section>

      <section className="grid items-end gap-4 sm:grid-cols-3">
        <article className="glass-card h-40 p-4 text-center">
          <p className="text-xl font-bold">#2</p>
          <p className="mt-2 text-white/80">Người chơi B</p>
        </article>
        <article className="glass-card h-52 border border-yellow-300/40 p-4 text-center">
          <p className="text-2xl font-extrabold">#1</p>
          <p className="mt-2 text-white/80">Người chơi A</p>
        </article>
        <article className="glass-card h-36 p-4 text-center">
          <p className="text-xl font-bold">#3</p>
          <p className="mt-2 text-white/80">Người chơi C</p>
        </article>
      </section>

      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/" className="rounded-lg bg-white/15 px-4 py-2 font-semibold hover:bg-white/25">
          Về Trang Chủ
        </Link>
        <Link href="/tham-gia" className="rounded-lg bg-[var(--accent)] px-4 py-2 font-semibold hover:brightness-110">
          Chơi Lại
        </Link>
        {isHost ? (
          <button type="button" className="rounded-lg bg-green-500 px-4 py-2 font-semibold hover:bg-green-400">
            Tải Kết Quả
          </button>
        ) : null}
      </div>
    </main>
  );
}
