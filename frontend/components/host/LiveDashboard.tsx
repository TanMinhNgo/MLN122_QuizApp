import { OptionStat } from "@/types";
import { AnswerBar } from "@/components/host/AnswerBar";

interface LiveDashboardProps {
  stats: OptionStat[];
  totalAnswered: number;
  totalPlayers: number;
}

export function LiveDashboard({ stats, totalAnswered, totalPlayers }: LiveDashboardProps) {
  if (stats.length === 0) {
    return (
      <section className="glass-card grid min-h-56 place-items-center p-6 text-white/75">
        Chưa có dữ liệu trả lời.
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((item, index) => {
          const symbols = ["▲", "◆", "●", "■"];
          return (
            <AnswerBar
              key={item.optionId}
              color={item.color}
              label={symbols[index] || "•"}
              text={item.text}
              count={item.count}
              percentage={item.percentage}
            />
          );
        })}
      </div>
      <div className="glass-card p-3 text-sm text-white/80">
        {totalAnswered} / {totalPlayers} người đã trả lời
      </div>
    </section>
  );
}
