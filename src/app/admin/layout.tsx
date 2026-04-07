import { DashboardShell } from "./_components/DashboardShell";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell variant="admin">{children}</DashboardShell>;
}
