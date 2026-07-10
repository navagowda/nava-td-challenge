"use client";

import { useEffect, useRef, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import Topbar from "@/components/layout/Topbar";
import GlassCard from "@/components/ui/GlassCard";
import GlowButton from "@/components/ui/GlowButton";
import { User, ShieldCheck, Palette, DatabaseBackup, Check } from "lucide-react";
import { DEFAULT_SETTINGS, loadSettings, saveSettings, NavaSettings } from "@/lib/settingsStore";

const inputClass =
  "w-full rounded-xl border border-void-border bg-void-800 px-3.5 py-2.5 text-sm text-bone placeholder:text-bone-faint transition-colors focus:border-gold focus:outline-none";
const labelClass = "mb-1.5 block text-xs uppercase tracking-wider text-bone-faint";

const themes = [
  { name: "Matte black & gold", available: true },
  { name: "Charcoal & gold", available: false },
  { name: "Deep navy & gold", available: false },
];

export default function SettingsPage() {
  const [settings, setSettings] = useState<NavaSettings>(DEFAULT_SETTINGS);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSettings(loadSettings());
  }, []);

  function update<K extends keyof NavaSettings>(key: K, value: NavaSettings[K]) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  function handleSave() {
    saveSettings(settings);
    setSavedMessage("Changes saved.");
    setTimeout(() => setSavedMessage(null), 2500);
  }

  function handleExport() {
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "nava-settings-backup.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setSavedMessage("Settings exported — check your downloads.");
    setTimeout(() => setSavedMessage(null), 3000);
  }

  function handleImportClick() {
    fileInputRef.current?.click();
  }

  function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        const merged = { ...DEFAULT_SETTINGS, ...parsed };
        setSettings(merged);
        saveSettings(merged);
        setSavedMessage("Backup imported.");
        setTimeout(() => setSavedMessage(null), 2500);
      } catch {
        setSavedMessage("Import failed — invalid backup file.");
        setTimeout(() => setSavedMessage(null), 3000);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  return (
    <AppShell>
      <Topbar title="Settings" subtitle="Profile, defaults, and workspace preferences" />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <GlassCard glow hover={false}>
          <div className="mb-5 flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-gold/10 text-gold">
              <User size={16} />
            </div>
            <h3 className="font-display text-lg font-semibold text-bone">Profile</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Display name</label>
              <input
                className={inputClass}
                value={settings.displayName}
                onChange={(e) => update("displayName", e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Base currency</label>
              <select
                className={inputClass}
                value={settings.baseCurrency}
                onChange={(e) => update("baseCurrency", e.target.value)}
              >
                <option>USD</option>
                <option>EUR</option>
                <option>GBP</option>
                <option>INR</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Time zone</label>
              <input
                className={inputClass}
                value={settings.timezone}
                onChange={(e) => update("timezone", e.target.value)}
              />
            </div>
          </div>
        </GlassCard>

        <GlassCard glow hover={false}>
          <div className="mb-5 flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-gold/10 text-gold">
              <ShieldCheck size={16} />
            </div>
            <h3 className="font-display text-lg font-semibold text-bone">Risk defaults</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Default risk per trade (%)</label>
              <input
                className={inputClass}
                type="number"
                step={0.1}
                value={settings.defaultRiskPct}
                onChange={(e) => update("defaultRiskPct", Number(e.target.value))}
              />
            </div>
            <div>
              <label className={labelClass}>Daily loss limit ($)</label>
              <input
                className={inputClass}
                type="number"
                value={settings.dailyLossLimit}
                onChange={(e) => update("dailyLossLimit", Number(e.target.value))}
              />
            </div>
            <div>
              <label className={labelClass}>Max open trades</label>
              <input
                className={inputClass}
                type="number"
                value={settings.maxOpenTrades}
                onChange={(e) => update("maxOpenTrades", Number(e.target.value))}
              />
            </div>
          </div>
        </GlassCard>

        <GlassCard glow hover={false}>
          <div className="mb-5 flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-gold/10 text-gold">
              <Palette size={16} />
            </div>
            <h3 className="font-display text-lg font-semibold text-bone">Theme</h3>
          </div>
          <div className="space-y-3">
            {themes.map((theme) => (
              <label
                key={theme.name}
                className={`flex items-center justify-between rounded-xl border border-void-border bg-void-800/60 px-4 py-3 text-sm text-bone-dim ${
                  theme.available ? "cursor-pointer" : "cursor-not-allowed opacity-50"
                }`}
              >
                <span className="flex items-center gap-2">
                  {theme.name}
                  {!theme.available && (
                    <span className="rounded-full bg-void-700 px-2 py-0.5 text-[10px] uppercase tracking-wider text-bone-faint">
                      Soon
                    </span>
                  )}
                </span>
                <input
                  type="radio"
                  name="theme"
                  disabled={!theme.available}
                  checked={settings.theme === theme.name}
                  onChange={() => update("theme", theme.name)}
                  className="accent-gold"
                />
              </label>
            ))}
          </div>
        </GlassCard>

        <GlassCard glow hover={false}>
          <div className="mb-5 flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-gold/10 text-gold">
              <DatabaseBackup size={16} />
            </div>
            <h3 className="font-display text-lg font-semibold text-bone">Backup &amp; export</h3>
          </div>
          <p className="mb-5 text-sm leading-relaxed text-bone-dim">
            Export your saved profile and risk defaults as a local backup
            file, or restore them from a previous export.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <GlowButton variant="outline" className="w-full" onClick={handleExport}>
              Export settings (.json)
            </GlowButton>
            <GlowButton variant="ghost" className="w-full" onClick={handleImportClick}>
              Import backup
            </GlowButton>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json"
              className="hidden"
              onChange={handleImportFile}
            />
          </div>
        </GlassCard>
      </div>

      <div className="mt-6 flex items-center justify-end gap-4">
        {savedMessage && (
          <span className="flex items-center gap-1.5 text-sm text-profit">
            <Check size={15} />
            {savedMessage}
          </span>
        )}
        <GlowButton onClick={handleSave}>Save changes</GlowButton>
      </div>
    </AppShell>
  );
}
