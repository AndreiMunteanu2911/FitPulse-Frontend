import React from "react";

interface AdminStatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  accentColor?: string;
}

/**
 * Stat card with a customizable left accent bar.
 * Uses the app's primary color scale for accents.
 *
 * @param accentColor - CSS var class for the accent bar (e.g. "bg-[var(--primary-500)]")
 */
export default function AdminStatCard({ title, value, subtitle, icon, accentColor = "bg-[var(--primary-500)]" }: AdminStatCardProps) {
  return (
    <div className="card relative p-5">
      <div className={`absolute inset-x-0 top-0 h-1 ${accentColor}`} />
      {icon && (
        <div className="flex items-center gap-2 mb-3">
          <span className="icon-tile !size-10">{icon}</span>
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--muted-foreground)]">{title}</p>
        </div>
      )}
      {!icon && (
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.08em] text-[var(--muted-foreground)]">{title}</p>
      )}
      <p className="text-3xl font-bold leading-none tracking-[-0.04em] text-[var(--foreground)]">{value}</p>
      {subtitle && <p className="mt-3 text-sm font-medium text-[var(--muted-foreground)]">{subtitle}</p>}
    </div>
  );
}
