import { DashboardShell } from "./_components/DashboardShell";

export default function InvestorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell variant="investor">{children}</DashboardShell>;
}
