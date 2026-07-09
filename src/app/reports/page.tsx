import AppShell from "@/components/layout/AppShell";
import Topbar from "@/components/layout/Topbar";
import ReportCard from "@/components/reports/ReportCard";
import { reports } from "@/lib/mockData";

export default function ReportsPage() {
  return (
    <AppShell>
      <Topbar title="Reports" subtitle="Daily, weekly, and monthly summaries" />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {reports.map((r, i) => (
          <ReportCard key={r.id} report={r} delay={i * 0.05} />
        ))}
      </div>
    </AppShell>
  );
}
