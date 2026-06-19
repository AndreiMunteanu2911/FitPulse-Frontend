"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useAuthSession } from "@/components/AuthSessionProvider";

type AuthRouteGuardProps = {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireOnboarding?: boolean;
  onboardingOnly?: boolean;
};

export default function AuthRouteGuard({
  children,
  requireAdmin = false,
  requireOnboarding = false,
  onboardingOnly = false,
}: AuthRouteGuardProps) {
  const router = useRouter();
  const { user, refreshSession } = useAuthSession();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    refreshSession().finally(() => {
      if (active) setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [refreshSession]);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (requireAdmin && user.role !== "admin") {
      router.replace("/dashboard");
      return;
    }

    if (requireOnboarding && !user.onboarding_done) {
      router.replace("/onboarding/gender");
      return;
    }

    if (onboardingOnly && user.onboarding_done) {
      router.replace("/dashboard");
    }
  }, [loading, onboardingOnly, requireAdmin, requireOnboarding, router, user]);

  if (
    loading ||
    !user ||
    (requireAdmin && user.role !== "admin") ||
    (requireOnboarding && !user.onboarding_done) ||
    (onboardingOnly && user.onboarding_done)
  ) {
    return (
      <div className="grid min-h-dvh place-items-center bg-[var(--background)]">
        <LoadingSpinner />
      </div>
    );
  }

  return <>{children}</>;
}
