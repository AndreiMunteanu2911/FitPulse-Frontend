import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import TopBar from "@/components/TopBar";
import { AuthSessionProvider } from "@/components/AuthSessionProvider";
import AuthRouteGuard from "@/components/AuthRouteGuard";

export const metadata: Metadata = {
  title: "FitPulse - Workout Tracker",
  description: "Track your workouts and progress with ease.",
};

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthSessionProvider initialUser={null}>
      <AuthRouteGuard requireOnboarding>
        <div className="flex min-h-dvh w-full bg-[var(--background)] text-[var(--foreground)]">
          <Navbar />
          <div className="flex min-h-dvh min-w-0 flex-1 flex-col">
            <TopBar />
            <div className="h-[var(--ph-top)] flex-shrink-0 md:hidden" aria-hidden="true" />
            <main className="page-shell min-w-0 flex-1 px-4 pb-[calc(7rem+env(safe-area-inset-bottom))] pt-5 sm:px-6 md:px-8 md:pb-10 md:pt-8 lg:px-10">
              {children}
            </main>
          </div>
        </div>
      </AuthRouteGuard>
    </AuthSessionProvider>
  );
}
