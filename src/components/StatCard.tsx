import type { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: ReactNode;
  subtitle?: ReactNode;
  icon?: ReactNode;
  trend?: "up" | "down" | "neutral";
}

export default function StatCard({ title, value, subtitle, icon, trend }: StatCardProps) {
  const trendIcon = trend === "up" ? "+" : trend === "down" ? "-" : null;
  const trendColor =
    trend === "up"
      ? "text-[var(--color-success)]"
      : trend === "down"
        ? "text-[var(--color-destructive)]"
        : "text-[var(--muted-foreground)]";

  return (
    <div className="card relative p-5">
      {icon ? (
        <div className="icon-tile absolute right-5 top-5 !size-10">
          {icon}
        </div>
      ) : null}

      <p className="mb-3 pr-10 text-xs font-bold uppercase tracking-[0.08em] text-[var(--muted-foreground)]">{title}</p>
      <p className="text-3xl font-bold leading-none tracking-[-0.04em] text-[var(--foreground)]">{value}</p>
      {subtitle ? (
        <p className={`mt-3 text-sm font-medium ${trendColor}`}>
          {trendIcon ? <span className="mr-1">{trendIcon}</span> : null}
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
