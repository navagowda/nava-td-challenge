import Logo from "@/components/ui/Logo";

export default function Footer() {
  return (
    <footer className="relative border-t border-void-border px-6 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
        <Logo size={24} />

        <p className="max-w-xl text-center text-xs leading-relaxed text-bone-faint sm:text-left">
          NAVA is a private, personal trading workspace used solely to track
          my own trades. It is not a proprietary trading firm, funding
          program, brokerage, educational product, or copy-trading service,
          and it does not offer trading challenges, payouts, or financial
          products to any third party.
        </p>

        <p className="font-mono text-xs text-bone-faint">
          © {new Date().getFullYear()} NAVA
        </p>
      </div>
    </footer>
  );
}
