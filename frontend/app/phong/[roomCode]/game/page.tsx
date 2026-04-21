import Link from "next/link";

import { GameController } from "@/components/host/GameController";
import { LeaderboardTable } from "@/components/host/LeaderboardTable";
import { LiveDashboard } from "@/components/host/LiveDashboard";
import { AnswerButton } from "@/components/player/AnswerButton";
import { CountdownRing } from "@/components/player/CountdownRing";
import { QuestionDisplay } from "@/components/player/QuestionDisplay";
import { OptionStat, Ranking } from "@/types";

interface RoomGamePageProps {
  params: Promise<{ roomCode: string }>;
  searchParams: Promise<{ mode?: string }>;
}

export default async function RoomGamePage({ params, searchParams }: RoomGamePageProps) {
  const { roomCode } = await params;
  const { mode } = await searchParams;
  const isHost = mode === "host";

  const stats: OptionStat[] = [
    { optionId: "a", text: "JavaScript", count: 8, percentage: 40, color: "#e21b3c" },
    { optionId: "b", text: "Python", count: 5, percentage: 25, color: "#1368ce" },
    { optionId: "c", text: "C++", count: 3, percentage: 15, color: "#d89e00" },
    { optionId: "d", text: "Java", count: 4, percentage: 20, color: "#26890c" },
  ];
  const leaderboard: Ranking[] = [
    { rank: 1, nickname: "Team A", score: 2800 },
    { rank: 2, nickname: "Team B", score: 2400 },
    { rank: 3, nickname: "Team C", score: 2100 },
  ];

  if (isHost) {
    return (
      <main className="mx-auto grid min-h-screen w-[min(1100px,calc(100%-2rem))] gap-5 py-6">
        <section className="glass-card p-6">
          <p className="text-sm uppercase tracking-wide text-white/70">Câu 1 / 10</p>
          <h1 className="mt-2 text-3xl font-extrabold">Host đang điều khiển game realtime</h1>
          <p className="mt-2 text-white/80">Khu vực này sẽ hiển thị biểu đồ đáp án và tiến độ trả lời theo thời gian thực.</p>
        </section>

        <LiveDashboard stats={stats} totalAnswered={20} totalPlayers={28} />
        <LeaderboardTable rankings={leaderboard} />

        <div className="flex flex-wrap items-center gap-3">
          <GameController
            gameState="question"
            onReveal={() => undefined}
            onShowLeaderboard={() => undefined}
            onNext={() => undefined}
          />
          <Link href={`/phong/${roomCode}/ket-thuc?mode=host`} className="rounded-lg bg-green-500 px-4 py-2 font-semibold hover:bg-green-400">
            Kết Thúc
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen w-[min(900px,calc(100%-2rem))] flex-col justify-center gap-5 py-6">
      <QuestionDisplay question="Đâu là ngôn ngữ chạy trên trình duyệt?" />
      <CountdownRing value={14} max={20} />

      <section className="grid gap-3 sm:grid-cols-2">
        <AnswerButton symbol="▲" text="JavaScript" color="#e21b3c" />
        <AnswerButton symbol="◆" text="Python" color="#1368ce" />
        <AnswerButton symbol="●" text="C++" color="#d89e00" />
        <AnswerButton symbol="■" text="Java" color="#26890c" />
      </section>
    </main>
  );
}
