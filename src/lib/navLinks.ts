import {
  LayoutDashboard,
  LineChart,
  NotebookPen,
  ShieldCheck,
  BarChart3,
  Layers,
  FileText,
  Settings,
  Trophy,
  type LucideIcon,
} from "lucide-react";

export interface NavLink {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const navLinks: NavLink[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/chart", label: "Chart", icon: LineChart },
  { href: "/journal", label: "Trade journal", icon: NotebookPen },
  { href: "/challenge", label: "50 Trade Challenge", icon: Trophy },
  { href: "/risk", label: "Risk management", icon: ShieldCheck },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/vault", label: "Strategy vault", icon: Layers },
  { href: "/reports", label: "Reports", icon: FileText },
  { href: "/settings", label: "Settings", icon: Settings },
];
