import { Ranking } from "@/types";

interface LeaderboardTableProps {
  rankings: Ranking[];
}

export function LeaderboardTable({ rankings }: LeaderboardTableProps) {
  return (
    <section className="glass-card p-4">
      <h3 className="text-lg font-bold">Bảng xếp hạng</h3>
      <div className="mt-3 space-y-2">
        {rankings.length === 0 ? (
          <p className="text-sm text-white/70">Chưa có dữ liệu xếp hạng.</p>
        ) : (
          rankings.map((item) => (
            <div key={`${item.rank}-${item.nickname}`} className="grid grid-cols-[60px_1fr_100px] items-center rounded-lg bg-white/10 px-3 py-2 text-sm">
              <span className="font-bold">#{item.rank}</span>
              <span>{item.nickname}</span>
              <span className="text-right font-semibold">{item.score}</span>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
