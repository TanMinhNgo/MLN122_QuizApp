interface WaitingRoomPlayerProps {
  nickname: string;
}

export function WaitingRoomPlayer({ nickname }: WaitingRoomPlayerProps) {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <section className="glass-card w-full max-w-lg p-8 text-center">
        <p className="text-3xl font-extrabold">Bạn đã vào phòng!</p>
        <p className="mt-2 text-white/85">Tên hiển thị: {nickname}</p>

        <div className="mx-auto mt-6 flex w-fit gap-2">
          <span className="size-3 animate-bounce rounded-full bg-white" />
          <span className="size-3 animate-bounce rounded-full bg-white [animation-delay:0.1s]" />
          <span className="size-3 animate-bounce rounded-full bg-white [animation-delay:0.2s]" />
        </div>

        <p className="mt-4 text-white/80">Đang chờ host bắt đầu...</p>
      </section>
    </main>
  );
}
