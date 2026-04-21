'use client';

import { use, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { LeaderboardTable } from '@/components/host/LeaderboardTable';
import { LiveDashboard } from '@/components/host/LiveDashboard';
import { AnswerButton } from '@/components/player/AnswerButton';
import { CountdownRing } from '@/components/player/CountdownRing';
import { QuestionDisplay } from '@/components/player/QuestionDisplay';
import { useHostGame } from '@/hooks/useHostGame';
import { usePlayerGame } from '@/hooks/usePlayerGame';

interface RoomGamePageProps {
  params: Promise<{ roomCode: string }>;
  searchParams: Promise<{
    mode?: string;
    sessionId?: string;
    nickname?: string;
  }>;
}

const OPTION_SYMBOLS = ['▲', '◆', '●', '■'] as const;

function HostGameRoom({
  roomCode,
  sessionId,
}: {
  roomCode: string;
  sessionId: string;
}) {
  const router = useRouter();
  const {
    players,
    gameStatus,
    currentQuestion,
    answerStats,
    leaderboard,
    totalAnswered,
    endGame,
  } = useHostGame(sessionId);

  useEffect(() => {
    if (gameStatus === 'ended') {
      router.replace(
        `/phong/${roomCode}/ket-thuc?mode=host&sessionId=${sessionId}`,
      );
    }
  }, [gameStatus, roomCode, sessionId, router]);

  const statusLabel: Record<string, string> = {
    starting: '⏳ Chuẩn bị câu hỏi đầu tiên...',
    question: '❓ Đang hiển thị câu hỏi',
    answer_reveal: '✅ Đang hiển thị đáp án',
    leaderboard: '🏆 Bảng xếp hạng',
    ended: '🎉 Kỳ thi kết thúc',
  };

  return (
    <main className="mx-auto grid min-h-screen w-[min(1100px,calc(100%-2rem))] gap-5 py-6">
      <div className="justify-self-start self-start">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/4 px-3 py-2 text-sm font-semibold text-mln-dim transition hover:bg-white/10 hover:text-mln-cream"
        >
          ← Quay lại Dashboard
        </Link>
      </div>

      <section className="glass-card p-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-mln-dim">
          {statusLabel[gameStatus] ?? 'Đang chờ...'}
        </p>
        <h1 className="mt-2 text-3xl font-extrabold text-mln-cream">
          {currentQuestion?.content ?? 'Host đang điều khiển game'}
        </h1>
        <p className="mt-1 text-mln-dim">
          {players.length} người chơi đang online
        </p>
      </section>

      {answerStats.length > 0 && (
        <LiveDashboard
          stats={answerStats}
          totalAnswered={totalAnswered}
          totalPlayers={players.length}
          revealed={gameStatus === 'answer_reveal'}
        />
      )}

      {leaderboard.length > 0 && gameStatus === 'leaderboard' && (
        <LeaderboardTable rankings={leaderboard} />
      )}

      <div className="justify-self-end self-start">
        <button
          type="button"
          onClick={endGame}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-xl border border-mln-red/30 bg-mln-red/10 px-4 py-2 text-sm font-semibold text-mln-red transition hover:bg-mln-red/20"
        >
          Kết thúc sớm
        </button>
      </div>
    </main>
  );
}

function PlayerGameRoom({ roomCode }: { roomCode: string }) {
  const router = useRouter();
  const {
    gameStatus,
    currentQuestion,
    timeLeft,
    hasAnswered,
    myScore,
    myRank,
    answeredCount,
    totalPlayers,
    submitAnswer,
  } = usePlayerGame();

  useEffect(() => {
    if (gameStatus === 'ended') {
      router.replace(`/phong/${roomCode}/ket-thuc`);
    }
  }, [gameStatus, roomCode, router]);

  if (gameStatus === 'leaderboard') {
    return (
      <main className="mx-auto flex min-h-screen w-[min(900px,calc(100%-2rem))] flex-col justify-center gap-5 py-6">
        <section className="glass-card p-8 text-center">
          <p className="text-4xl">🏆</p>
          <h2 className="mt-3 text-2xl font-extrabold text-mln-cream">
            Bảng xếp hạng
          </h2>
          <p className="mt-5 text-6xl font-extrabold text-mln-gold">
            #{myRank > 0 ? myRank : '—'}
          </p>
          <p className="mt-2 text-lg font-semibold text-mln-cream">
            {myScore.toLocaleString()} điểm
          </p>
          <p className="mt-1 text-sm text-mln-dim">
            Chờ host chuyển câu tiếp theo…
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="relative mx-auto flex min-h-screen w-[min(900px,calc(100%-2rem))] flex-col justify-center gap-5 py-6">
      <div className="absolute left-0 top-6">
        <Link
          href="/tham-gia"
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/4 px-3 py-2 text-sm font-semibold text-mln-dim transition hover:bg-white/10 hover:text-mln-cream"
        >
          ← Quay lại
        </Link>
      </div>

      {currentQuestion && (
        <>
          <QuestionDisplay question={currentQuestion.content} />
          <CountdownRing value={timeLeft} max={currentQuestion.timeLimit} />

          {hasAnswered ? (
            <section className="glass-card p-6 text-center">
              <p className="text-xl font-bold text-mln-cream">✅ Đã trả lời!</p>
              {totalPlayers > 0 ? (
                <p className="mt-2 text-mln-dim">
                  {answeredCount}/{totalPlayers} người đã trả lời
                </p>
              ) : (
                <p className="mt-2 text-mln-dim">Chờ kết quả từ host...</p>
              )}
            </section>
          ) : gameStatus === 'answer_reveal' ? (
            <section className="glass-card p-6 text-center">
              <p className="text-xl font-bold text-mln-cream">⏰ Hết giờ!</p>
              <p className="mt-1 text-mln-dim">Chờ câu hỏi tiếp theo...</p>
            </section>
          ) : (
            <section className="grid gap-3 sm:grid-cols-2">
              {currentQuestion.options.map((option, index) => (
                <AnswerButton
                  key={option.id}
                  symbol={OPTION_SYMBOLS[index] ?? '•'}
                  text={option.text}
                  color={option.color}
                  onClick={() => submitAnswer(currentQuestion._id, option.id)}
                />
              ))}
            </section>
          )}
        </>
      )}

      {gameStatus === 'answer_reveal' && !currentQuestion && (
        <section className="glass-card p-6 text-center">
          <p className="text-xl font-bold text-mln-cream">
            Chờ câu hỏi tiếp theo...
          </p>
        </section>
      )}
    </main>
  );
}

export default function RoomGamePage({
  params,
  searchParams,
}: RoomGamePageProps) {
  const { roomCode } = use(params);
  const { mode, sessionId = '' } = use(searchParams);
  const isHost = mode === 'host';

  if (isHost) {
    return <HostGameRoom roomCode={roomCode} sessionId={sessionId} />;
  }

  return <PlayerGameRoom roomCode={roomCode} />;
}
