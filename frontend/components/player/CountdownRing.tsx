interface CountdownRingProps {
  value: number;
  max: number;
}

export function CountdownRing({ value, max }: CountdownRingProps) {
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const progress = max > 0 ? value / max : 0;
  const offset = circumference * (1 - progress);

  const ringColor = progress > 0.5 ? "#34d399" : progress > 0.2 ? "#fbbf24" : "#f87171";

  return (
    <div className="mx-auto grid h-28 w-28 place-items-center">
      <svg width="112" height="112" viewBox="0 0 112 112" className="-rotate-90">
        <circle cx="56" cy="56" r={radius} stroke="rgba(255,255,255,0.2)" strokeWidth="10" fill="none" />
        <circle
          cx="56"
          cy="56"
          r={radius}
          stroke={ringColor}
          strokeWidth="10"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute text-2xl font-extrabold">{value}</span>
    </div>
  );
}
