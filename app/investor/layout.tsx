import { DashboardShell } from "@/components/dashboard/DashboardShell";

export default function InvestorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell variant="investor">{children}</DashboardShell>;
}
