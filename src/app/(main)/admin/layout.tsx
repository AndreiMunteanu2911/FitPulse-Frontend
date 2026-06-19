import AuthRouteGuard from "@/components/AuthRouteGuard";

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <AuthRouteGuard requireAdmin>{children}</AuthRouteGuard>;
}
