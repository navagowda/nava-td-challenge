export function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

export function formatCurrency(value: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatSigned(value: number) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${formatCurrency(value)}`;
}

export function formatPct(value: number, digits = 1) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(digits)}%`;
}

/** Pip size for a given forex pair. JPY-quoted pairs use 0.01, XAU/USD is
 * treated in 0.1 "points", everything else uses the standard 0.0001. */
export function getPipSize(pair: string): number {
  if (pair.includes("JPY")) return 0.01;
  if (pair.startsWith("XAU")) return 0.1;
  return 0.0001;
}

export function calcPips(pair: string, entry: number, exit: number): number {
  const size = getPipSize(pair);
  return size > 0 ? (exit - entry) / size : 0;
}
