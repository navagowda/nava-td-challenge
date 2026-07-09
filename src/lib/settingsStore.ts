export interface NavaSettings {
  displayName: string;
  baseCurrency: string;
  timezone: string;
  defaultRiskPct: number;
  dailyLossLimit: number;
  maxOpenTrades: number;
  theme: string;
}

export const DEFAULT_SETTINGS: NavaSettings = {
  displayName: "Nava",
  baseCurrency: "USD",
  timezone: "Asia/Kolkata (IST)",
  defaultRiskPct: 1,
  dailyLossLimit: 500,
  maxOpenTrades: 3,
  theme: "Matte black & gold",
};

const SETTINGS_KEY = "nava_settings";

export function loadSettings(): NavaSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = window.localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: NavaSettings): void {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }
}
