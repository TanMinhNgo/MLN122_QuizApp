type HostGameState = "question" | "answer_reveal" | "leaderboard";

interface GameControllerProps {
  gameState: HostGameState;
  onReveal: () => void;
  onShowLeaderboard: () => void;
  onNext: () => void;
}

export function GameController({ gameState, onReveal, onShowLeaderboard, onNext }: GameControllerProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {gameState === "question" ? (
        <button
          type="button"
          onClick={onReveal}
          className="rounded-lg bg-white/15 px-4 py-2 font-semibold hover:bg-white/25"
        >
          Xem Đáp Án
        </button>
      ) : null}

      {gameState === "answer_reveal" ? (
        <button
          type="button"
          onClick={onShowLeaderboard}
          className="rounded-lg bg-[var(--accent)] px-4 py-2 font-semibold hover:brightness-110"
        >
          Bảng Xếp Hạng
        </button>
      ) : null}

      {gameState === "leaderboard" ? (
        <button
          type="button"
          onClick={onNext}
          className="rounded-lg bg-green-500 px-4 py-2 font-semibold hover:bg-green-400"
        >
          Câu Tiếp Theo
        </button>
      ) : null}
    </div>
  );
}
