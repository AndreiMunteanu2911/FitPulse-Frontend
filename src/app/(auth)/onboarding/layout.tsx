import { AuthSessionProvider } from "@/components/AuthSessionProvider";
import AuthRouteGuard from "@/components/AuthRouteGuard";
import OnboardingShell from "./OnboardingShell";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthSessionProvider initialUser={null}>
      <AuthRouteGuard onboardingOnly>
        <OnboardingShell>{children}</OnboardingShell>
      </AuthRouteGuard>
    </AuthSessionProvider>
  );
}
