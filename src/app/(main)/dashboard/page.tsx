import ProtectedWrapper from "@/components/ProtectedWrapper";
import DashboardStats from "@/components/DashboardStats";
import DashboardShortcuts from "@/components/DashboardShortcuts";
import Link from "next/link";
import { ArrowRight, Dumbbell, History, Library, User } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

const quickActions = [
  { name: "Start workout", description: "Log sets and track your session", href: "/workout", Icon: Dumbbell },
  { name: "Workout history", description: "Review completed sessions", href: "/history", Icon: History },
  { name: "Exercise library", description: "Browse movements and stats", href: "/exercises", Icon: Library },
  { name: "Your profile", description: "Progress, weight, and records", href: "/profile", Icon: User },
];

export default function DashboardPage() {
  return (
    <ProtectedWrapper>
      <div className="page-stack">
        <PageHeader
          title="Dashboard"
          description="Your training activity, progress, and shortcuts in one place."
        />

        <section className="section">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {quickActions.map(({ name, description, href, Icon }) => (
              <Link
                key={name}
                href={href}
                className="card-interactive group flex items-center gap-4 p-4"
              >
                <div className="flex size-11 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--primary-50)] text-[var(--primary-600)] dark:bg-[var(--primary-100)] dark:text-[var(--primary-700)]">
                  <Icon className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-[var(--foreground)]">{name}</p>
                  <p className="mt-0.5 text-xs leading-5 text-[var(--muted-foreground)]">{description}</p>
                </div>
                <ArrowRight className="size-4 shrink-0 text-[var(--muted-foreground)] transition-transform group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        </section>

        <DashboardShortcuts />

        <section className="section">
          <div className="section-header">
            <h2 className="section-heading">Training overview</h2>
          </div>
          <DashboardStats />
        </section>
      </div>
    </ProtectedWrapper>
  );
}
