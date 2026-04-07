import { DashboardShell } from "@/features/investor/DashboardShell";

export default function InvestorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell variant="investor">{children}</DashboardShell>;
}
