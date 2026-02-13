import { DashboardShell } from "@/components/dashboard/DashboardShell";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell variant="admin">{children}</DashboardShell>;
}
