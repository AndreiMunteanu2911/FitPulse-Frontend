import React from "react";
import { type LucideIcon } from "lucide-react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface AdminNavCardProps {
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
}

export default function AdminNavCard({ href, title, description, icon: Icon, color }: AdminNavCardProps) {
  return (
    <Link
      href={href}
      className="card-interactive group block p-5"
    >
      <div className="flex items-center gap-4">
        <div className={`flex size-12 shrink-0 items-center justify-center rounded-[var(--radius-md)] ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="mb-1 text-base font-bold text-[var(--foreground)]">{title}</h3>
          <p className="text-sm leading-6 text-[var(--muted-foreground)]">{description}</p>
        </div>
        <ArrowRight className="w-5 h-5 text-[var(--muted-foreground)] group-hover:translate-x-1 group-hover:text-[var(--foreground)] transition-all" />
      </div>
    </Link>
  );
}
