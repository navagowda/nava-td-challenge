import AppShell from "@/components/layout/AppShell";
import Topbar from "@/components/layout/Topbar";
import StrategyCard from "@/components/vault/StrategyCard";
import GlowButton from "@/components/ui/GlowButton";
import { strategies } from "@/lib/mockData";
import { Plus } from "lucide-react";

export default function VaultPage() {
  return (
    <AppShell>
      <Topbar title="Strategy vault" subtitle="Every playbook, documented and versioned" />
      <div className="-mt-4 mb-6 flex justify-end">
        <GlowButton icon={<Plus size={16} />}>Add strategy</GlowButton>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {strategies.map((s, i) => (
          <StrategyCard key={s.id} strategy={s} delay={i * 0.05} />
        ))}
      </div>
    </AppShell>
  );
}
